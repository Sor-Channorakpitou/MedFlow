// src/pages/DoctorDash.jsx
import React, { useState, useMemo, useEffect } from "react";
import ActiveConsultationHeader from "../components/doctor/ActiveConsultationHeader";
import PatientVisitQueue from "../components/doctor/PatientVisitQueue";
import ClinicalHistoryTimeline from "../components/doctor/ClinicalHistoryTimeline";
import SoapNotesForm from "../components/doctor/SoapNotesForm";
import SymptomsAndActions from "../components/doctor/SymptomsAndActions";
import PrescriptionOrderEntry from "../components/doctor/PrescriptionOrderEntry";
import Header from '../components/Header';

import { useWorkflow } from "../context/WorkflowContext";

function DoctorDash() {
  // Connect directly to the global pipeline engine
  const { appointments, patients, triages, submitDoctorConsultation } = useWorkflow();

  const [activeQueueId, setActiveQueueId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Local state to hold the prescription entry row items locally before submission block
  const [prescribedMeds, setPrescribedMeds] = useState([]);

  const [soapNotes, setSoapNotes] = useState({
    subjective: "Patient reports persistent fatigue and general malaise...",
    objective: "", // Will be auto-populated with the Nurse's logged vitals
    assessment: "",
    plan: "",
  });

  const [symptoms, setSymptoms] = useState([
    { id: "s1", label: "Chest Pain", checked: false },
    { id: "s2", label: "Palpitations", checked: false },
    { id: "s3", label: "Dizziness", checked: false },
    { id: "s4", label: "Nausea", checked: false },
  ]);

  const currentUser = {
    name: "Dr. Aris Thorne",
    role: "Attending Cardiologist",
    initials: "AT",
  };

  // ==========================================================================
  // RELATIONAL DATA JOIN: Assemble queue matching 'AWAITING_CONSULTATION'
  // ==========================================================================
  const reactiveQueue = useMemo(() => {
    return appointments
      .filter((app) => app.workflow_step === "AWAITING_CONSULTATION")
      .map((app) => {
        const patientInfo = patients.find((p) => p.patient_id === app.patient_id);
        const triageInfo = triages.find((t) => t.appointment_id === app.appointment_id);

        // Derive structural age calculation metrics natively
        const birthYear = patientInfo ? new Date(patientInfo.DOB).getFullYear() : 1990;
        const currentYear = new Date().getFullYear();

        return {
          id: app.appointment_id, // Primary operational index target
          patientId: app.patient_id,
          name: patientInfo ? patientInfo.full_name : "Unknown Patient",
          type: "IN PROGRESS",
          time: new Date(app.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reason: app.reason,
          pid: app.patient_id,
          age: `${currentYear - birthYear} Y.O.`,
          gender: patientInfo?.gender === "M" ? "Male" : "Female",
          room: "Exam Room 3",
          // Triage details injected from Upstream Nurse payload
          titals: triageInfo,
          history: [
            {
              date: "Oct 12, 2025",
              title: "Previous Intake Log",
              desc: triageInfo?.note || "Routine walk-in entry logged at front reception counter.",
              tags: triageInfo ? [`ESI-${triageInfo.urgency_level}`] : [],
            }
          ],
          activeMeds: [],
        };
      })
      .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [appointments, patients, triages, searchQuery]);

  // Maintain local index choice focus mapping as queue shifts
  useEffect(() => {
    if (reactiveQueue.length > 0 && !activeQueueId) {
      setActiveQueueId(reactiveQueue[0].id);
    }
  }, [reactiveQueue, activeQueueId]);

  const activeCase = useMemo(() => {
    return reactiveQueue.find((q) => q.id === activeQueueId) || reactiveQueue[0] || null;
  }, [reactiveQueue, activeQueueId]);

  // Auto-fill objective fields block when doctor swaps focus target choice item
  useEffect(() => {
    if (activeCase?.titals) {
      const t = activeCase.titals;
      setSoapNotes((prev) => ({
        ...prev,
        objective: `BP: ${t.blood_pressure} mmHg | HR: ${t.heart_rate} bpm | Temp: ${t.temperature} °C | Wt: ${t.weight} kg.`,
      }));
    } else {
      setSoapNotes((prev) => ({ ...prev, objective: "No triage vitals recorded." }));
    }
    setPrescribedMeds([]); // Clear previous local prescription inputs scratchpad
  }, [activeCase]);

  const handleSoapChange = (field, value) => {
    setSoapNotes((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleSymptom = (id) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  // Capture prescribed items locally on the doctor workspace desk panel scratchpad
  const handleAddMedication = (newMed) => {
    setPrescribedMeds((prev) => [
      ...prev,
      {
        name: newMed.medication_name || newMed.name,
        instruction: newMed.instruction || "As directed by provider",
        quantity: newMed.quantity || 30,
        refills: newMed.refills || 0,
        type: ""
      },
    ]);
  };

  // ==========================================================================
  // DISPATCH CONSULTATION: Commit diagnosis & push payload down to Pharmacy
  // ==========================================================================
  const handleFinishSession = () => {
    if (!activeCase) return;

    const consultationPayload = {
      diagnosis: soapNotes.assessment || "Unspecified Medical Examination Summary",
      allergies: "None reported",
      medications: prescribedMeds.length > 0 ? prescribedMeds : [
        { name: "Observation Protocol", instruction: "Rest and hydration as prescribed", quantity: 1, refills: 0 }
      ]
    };

    // Trigger state mutator engine forwarding patient onto Pharmacists
    submitDoctorConsultation(
      activeCase.id, 
      activeCase.patientId, 
      "USR-DOC1", // Logged in doctor unique primary identity string
      consultationPayload
    );

    // Reset selection indexing triggers
    setActiveQueueId("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden">
      {/* Unified Global Dynamic Navigation Header */}
      <Header
        user={currentUser}
        searchPlaceholder="Filter clinical queue records..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        hasNotifications={true}
      />

      {activeCase ? (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden p-4 gap-4">
          <ActiveConsultationHeader 
            className="shrink-0" 
            caseData={activeCase} 
            onFinish={handleFinishSession} 
          />

          {/* Main Container Workstation Splits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1 min-h-0 overflow-hidden"> 
            
            {/* COLUMN 1: LEFT PANEL (Queue & Timeline side-by-side) */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch h-full overflow-hidden">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
                <PatientVisitQueue
                  queue={reactiveQueue}
                  selectedId={activeQueueId}
                  onSelect={setActiveQueueId}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full p-4 overflow-y-auto">
                <ClinicalHistoryTimeline
                  history={activeCase.history || []}
                  activeMeds={prescribedMeds} // Feed live scratchpad list directly into history viewer preview panel
                />
              </div>
            </div>

            {/* COLUMN 2: RIGHT PANEL (Master Workstation Data Desk) */}
            <div className="lg:col-span-7 flex flex-col gap-4 h-full overflow-y-auto pr-1">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm shrink-0">
                <SoapNotesForm data={soapNotes} onChange={handleSoapChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[300px]">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
                  <SymptomsAndActions
                    symptoms={symptoms}
                    onToggle={handleToggleSymptom}
                  />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
                  <PrescriptionOrderEntry onAdd={handleAddMedication} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
          <p className="text-sm font-medium">All outpatient medical consultations have been concluded for this session slice.</p>
        </div>
      )}
    </div>
  );
}

export default DoctorDash;