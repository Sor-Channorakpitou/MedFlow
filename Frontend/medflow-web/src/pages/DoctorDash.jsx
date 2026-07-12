import { useState, useMemo, useEffect } from "react";
import ActiveConsultationHeader from "../components/doctor/ActiveConsultationHeader";
import PatientVisitQueue from "../components/doctor/PatientVisitQueue";
import ClinicalHistoryTimeline from "../components/doctor/ClinicalHistoryTimeline";
import SoapNotesForm from "../components/doctor/SoapNotesForm";
import SymptomsAndActions from "../components/doctor/SymptomsAndActions";
import PrescriptionOrderEntry from "../components/doctor/PrescriptionOrderEntry";
import Header from "../components/Header";

import { useWorkflow } from "../hooks/useWorkFlow";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";
import { getPatientHistory, submitConsultation, claimConsultationPatient } from "../services/consultationAPI";
import { getAllMedications } from "../services/medicationAPI";
import { useAuth } from "../hooks/useAuth";

function DoctorDash() {
  const {
    consultationQueue: rawQueue,
    loading: isLoading,
    refreshConsultationQueue,
  } = useWorkflow();

  const { toasts, showToast, dismissToast } = useToast();
  const { user: currentUser } = useAuth();

  const [activeQueueId, setActiveQueueId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [patientHistory, setPatientHistory] = useState([]);
  const [mobileView, setMobileView] = useState("queue"); // 'queue', 'history', 'soap', 'medications'

  const [needsFollowUp, setNeedsFollowUp] = useState(false);
  const [prescribedMeds, setPrescribedMeds] = useState([]);
  const [allMedications, setAllMedications] = useState([]);

  const [soapNotes, setSoapNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });

  const [symptoms, setSymptoms] = useState([
    { id: "s1", label: "Chest Pain", checked: false },
    { id: "s2", label: "Palpitations", checked: false },
    { id: "s3", label: "Dizziness", checked: false },
    { id: "s4", label: "Nausea", checked: false },
  ]);

  const reactiveQueue = useMemo(() => {
    const safeQueue = Array.isArray(rawQueue) ? rawQueue : [];

    return safeQueue
      .map((item) => {
        if (!item) return null;

        const appointment = item.appointment;
        const patient = item.patient || appointment?.patient;
        const triage = item.triage || appointment?.triage;

        if (!patient) return null;

        const birthYear = patient.dateOfBirth
          ? new Date(patient.dateOfBirth).getFullYear()
          : new Date().getFullYear();

        const currentYear = new Date().getFullYear();

        return {
          id: item.id,
          appointmentId: item.appointmentId,
          patientId: patient.id || item.patientId,
          name: (patient.fullName || "Unknown Patient").toUpperCase(),
          type: item.status === "PROCESSING" ? "IN PROGRESS" : "WAITING",
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--:--",
          reason: item.reason || appointment?.reason || "General Consultation",
          age: `${currentYear - birthYear} Y.O.`,
          gender:
            patient.gender === "MALE"
              ? "Male"
              : patient.gender === "FEMALE"
                ? "Female"
                : "Unknown",
          room: "Exam Room 3",
          vitals: {
            bloodPressure: triage?.bloodPressure || "",
            heartRate: triage?.heartRate || "",
            temperature: triage?.temperature || "",
            weight: triage?.weight || "",
            urgencyLevel: triage?.urgencyLevel || "MEDIUM",
            note: triage?.note || "",
          },
        };
      })
      .filter(Boolean)
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [rawQueue, searchQuery]);

  useEffect(() => {
    if (reactiveQueue.length > 0 && !activeQueueId) {
      setActiveQueueId(reactiveQueue[0].id);
    }
  }, [reactiveQueue, activeQueueId]);

  const activeCase = useMemo(() => {
    return (
      reactiveQueue.find((q) => q.id === activeQueueId) ||
      reactiveQueue[0] ||
      null
    );
  }, [reactiveQueue, activeQueueId]);

  useEffect(() => {
    const loadMedications = async () => {
      try {
        const data = await getAllMedications();
        setAllMedications(data);
      } catch (err) {
        console.error("Error loading medication list:", err);
      }
    };

    loadMedications();
  }, []);

  useEffect(() => {
    if (!activeCase) {
      setPrescribedMeds([]);
      setPatientHistory([]);
      setSymptoms((prev) => prev.map((s) => ({ ...s, checked: false })));
      setSoapNotes({ subjective: "", objective: "", assessment: "", plan: "" });
      return;
    }

    setPrescribedMeds([]);
    setSymptoms((prev) => prev.map((s) => ({ ...s, checked: false })));

    setSoapNotes({
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
    });

    getPatientHistory(activeCase.patientId)
      .then((res) => setPatientHistory(res?.history || res || []))
      .catch(() => setPatientHistory([]));
  }, [activeQueueId, activeCase]);

  const handleSoapChange = (field, value) => {
    setSoapNotes((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleSymptom = (id) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    );
  };

  const handleAddMedication = (newMed) => {
    if (!newMed.id && !newMed.medicationId) {
      showToast("Please select a valid medication from the list.", "error");
      return;
    }

    const incomingMedId = Number(newMed.medicationId || newMed.id);

    setPrescribedMeds((prev) => [
      ...prev,
      {
        medicationId: incomingMedId,
        name: newMed.name || newMed.medication_name,
        dosage: Number(newMed.dosage || 1),
        frequency: Number(newMed.frequency || 1),
        duration: String(newMed.duration || newMed.instruction || "7 Days"),
      },
    ]);
  };

  const handleFinishSession = async () => {
    if (!activeCase) return;

    try {
      const targetMedications = prescribedMeds.map((m) => ({
        medicationId: Number(m.medicationId),
        dosage: Number(m.dosage),
        frequency: Number(m.frequency),
        duration: String(m.duration),
      }));

      const consultationPayload = {
        appointmentId: Number(activeCase.appointmentId),
        patientId: Number(activeCase.patientId),
        diagnosis: soapNotes.assessment,
        notes: `SUBJECTIVE:\n${soapNotes.subjective}\n\nOBJECTIVE:\n${soapNotes.objective}\n\nPLAN:\n${soapNotes.plan}`.trim(),
        medications: targetMedications,
        needsFollowUp,
      };

      await submitConsultation(consultationPayload);
      await refreshConsultationQueue();

      setActiveQueueId("");
      setMobileView("queue");
      showToast("Consultation finalized successfully. Case dispatched to pharmacy.", "success");
    } catch (err) {
      console.error("Consultation submission crash:", err);
      showToast(err.response?.data?.message || "Failed to submit consultation.", "error");
    }
  };

  const handleClaimPatient = async (queueId) => {
    try {
      await claimConsultationPatient(queueId);
      await refreshConsultationQueue();
      showToast("Patient claimed successfully.", "success");
    } catch (err) {
      console.error("Claim failed:", err);
      showToast("Failed to claim patient.", "error");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header
          user={currentUser}
          searchPlaceholder="Filter clinical queue..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hasNotifications={true}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading clinical queue...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!activeCase) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header
          user={currentUser}
          searchPlaceholder="Filter clinical queue..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hasNotifications={true}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            All consultations completed
          </h3>
          <p className="text-sm text-gray-600 text-center max-w-md">
            There are no outpatient medical consultations pending for this session. Great work!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <Header
        user={currentUser}
        searchPlaceholder="Filter clinical queue..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        hasNotifications={true}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Active Consultation Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 2xl:px-10 py-4 sm:py-5 border-b border-gray-200 bg-white">
          <ActiveConsultationHeader
            caseData={activeCase}
            onFinish={handleFinishSession}
          />
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="flex gap-1 px-4 overflow-x-auto -mb-px">
            <button
              onClick={() => setMobileView("queue")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                mobileView === "queue"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Queue
            </button>
            <button
              onClick={() => setMobileView("history")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                mobileView === "history"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              History
            </button>
            <button
              onClick={() => setMobileView("soap")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                mobileView === "soap"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              SOAP
            </button>
            <button
              onClick={() => setMobileView("medications")}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                mobileView === "medications"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Rx
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 min-h-0 overflow-hidden px-4 sm:px-6 lg:px-8 2xl:px-10 py-4 sm:py-5 lg:py-6">
          
          {/* Left Panel - Queue & History */}
          <div
            className={`${
              mobileView !== "queue" && mobileView !== "history"
                ? "hidden lg:flex"
                : "flex"
            } flex-col lg:flex-row lg:w-2/5 gap-4 sm:gap-5 min-h-0 overflow-hidden`}
          >
            {/* Queue Section */}
            <div
              className={`${
                mobileView === "history" ? "hidden lg:flex" : "flex"
              } flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm flex-col min-h-0 overflow-hidden`}
            >
              <PatientVisitQueue
                queue={reactiveQueue}
                selectedId={activeQueueId}
                onSelect={(id) => {
                  setActiveQueueId(id);
                  setMobileView("history");
                }}
                onClaim={handleClaimPatient}
              />
            </div>

            {/* History Section */}
            <div
              className={`${
                mobileView === "queue" ? "hidden lg:flex" : "flex"
              } flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm flex-col min-h-0 overflow-hidden p-4 sm:p-5 lg:p-6`}
            >
              <ClinicalHistoryTimeline
                history={patientHistory}
                activeMeds={prescribedMeds}
              />
            </div>
          </div>

          {/* Right Panel - SOAP & Medications */}
          <div
            className={`${
              mobileView === "queue" || mobileView === "history"
                ? "hidden lg:flex"
                : "flex"
            } flex-col lg:w-3/5 gap-4 sm:gap-5 min-h-0 overflow-hidden`}
          >
            {/* SOAP Notes Section */}
            <div
              className={`${
                mobileView !== "soap" ? "hidden lg:flex" : "flex"
              } bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm flex-col min-h-0 overflow-hidden p-4 sm:p-5 lg:p-6`}
            >
              <SoapNotesForm
                data={soapNotes}
                onChange={handleSoapChange}
                needsFollowUp={needsFollowUp}
                onFollowUpChange={setNeedsFollowUp}
              />
            </div>

            {/* Medications & Symptoms Section */}
            <div
              className={`${
                mobileView !== "medications" ? "hidden lg:flex" : "flex"
              } flex-1 gap-4 sm:gap-5 grid grid-cols-1 md:grid-cols-2 min-h-0 overflow-hidden`}
            >
              {/* Symptoms */}
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm flex-col min-h-0 overflow-hidden p-4 sm:p-5 lg:p-6 flex">
                <SymptomsAndActions
                  symptoms={symptoms}
                  onToggle={handleToggleSymptom}
                  onAddTreatment={(act) =>
                    showToast(`Action queued: ${act.text}`, "info")
                  }
                />
              </div>

              {/* Prescriptions */}
              <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm flex-col min-h-0 overflow-hidden p-4 sm:p-5 lg:p-6 flex">
                <PrescriptionOrderEntry
                  onAdd={handleAddMedication}
                  allMedications={allMedications}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDash;