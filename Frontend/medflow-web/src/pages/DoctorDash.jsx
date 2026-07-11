// src/pages/DoctorDash.jsx
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

// Retained purely for history line queries matching user selections
import { getPatientHistory, submitConsultation, claimConsultationPatient } from "../services/consultationAPI";
import { getAllMedications } from "../services/medicationAPI";
import { useAuth } from "../hooks/useAuth";

function DoctorDash() {
  const {
    consultationQueue: rawQueue,
    loading: isLoading,
    refreshConsultationQueue
  } = useWorkflow();

  const { toasts, showToast, dismissToast } = useToast();

  const [activeQueueId, setActiveQueueId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [patientHistory, setPatientHistory] = useState([]);

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

  const { user } = useAuth();
  const currentUser = user;

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

  // Sync active id with first item if selection drops out
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
      // Clear data immediately if there is no active patient context
      setPrescribedMeds([]);
      setPatientHistory([]);
      setSymptoms((prev) => prev.map((s) => ({ ...s, checked: false })));
      setSoapNotes({ subjective: "", objective: "", assessment: "", plan: "" });
      return;
    }

    setPrescribedMeds([]);
    setSymptoms((prev) => prev.map((s) => ({ ...s, checked: false })));

    let parsedVitalsString = "No upstream triage vitals recorded.";
    if (activeCase.vitals) {
      const v = activeCase.vitals;
      parsedVitalsString = `BP: ${v.bloodPressure || "--"} mmHg | HR: ${v.heartRate || "--"} bpm | Temp: ${v.temperature || "--"} °C | Wt: ${v.weight || "--"} kg.`;
    }

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
    // newMed MUST come from a dropdown of real medications from your database
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

      // Format strictly for the backend schema
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

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden px-4 py-3">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Header
        user={currentUser}
        searchPlaceholder="Filter clinical queue records..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        hasNotifications={true}
      />

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-slate-400">
          Syncing incoming clinical triage metrics...
        </div>
      ) : activeCase ? (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden p-4 gap-4">
          <ActiveConsultationHeader
            className="shrink-0"
            caseData={activeCase}
            onFinish={handleFinishSession}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch flex-1 min-h-0 overflow-hidden">
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch h-full overflow-hidden">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
                <PatientVisitQueue
                  queue={reactiveQueue}
                  selectedId={activeQueueId}
                  onSelect={setActiveQueueId}
                  onClaim={handleClaimPatient}

                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full p-3 overflow-y-auto">
                <ClinicalHistoryTimeline
                  history={patientHistory}
                  activeMeds={prescribedMeds}
                />
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4 h-full overflow-y-auto pr-1">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm shrink-0">
                <SoapNotesForm
                  className="h-full"
                  data={soapNotes}
                  onChange={handleSoapChange}
                  needsFollowUp={needsFollowUp}
                  onFollowUpChange={setNeedsFollowUp}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[300px]">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
                  <SymptomsAndActions
                    className="h-full"
                    symptoms={symptoms}
                    onToggle={handleToggleSymptom}
                    onAddTreatment={(act) => showToast(`Action queued: ${act.text}`, "info")}
                  />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
                  <PrescriptionOrderEntry
                    onAdd={handleAddMedication}
                    allMedications={allMedications}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
          <p className="text-sm font-medium">
            All outpatient medical consultations have been concluded for this
            session slice.
          </p>
        </div>
      )}
    </div>
  );
}

export default DoctorDash;
