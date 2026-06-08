// src/pages/DoctorDash.jsx
import React, { useState } from "react";
import ActiveConsultationHeader from "../components/doctor/ActiveConsultationHeader";
import PatientVisitQueue from "../components/doctor/PatientVisitQueue";
import ClinicalHistoryTimeline from "../components/doctor/ClinicalHistoryTimeline";
import SoapNotesForm from "../components/doctor/SoapNotesForm";
import SymptomsAndActions from "../components/doctor/SymptomsAndActions";
import PrescriptionOrderEntry from "../components/doctor/PrescriptionOrderEntry";

import { Search, Bell, HelpCircle } from "lucide-react";

function DoctorDash() {
  const [queue, setQueue] = useState([
    {
      id: "Q-8829",
      name: "Sarah Jenkins",
      type: "IN PROGRESS",
      time: "10:15 AM",
      reason: "Annual Cardiac Review",
      pid: "8829-WF",
      age: "34 Y.O.",
      gender: "Female",
      room: "Room 4B",
      history: [
        {
          date: "Oct 12, 2023",
          title: "Hypertension Diagnosis",
          desc: "Confirmed after consecutive high readings (150/95).",
          tags: ["CHRONIC", "VANCE, J"],
        },
        {
          date: "Aug 05, 2023",
          title: "Routine Bloodwork",
          desc: "HbA1c: 5.6% (Normal), Cholesterol: 210 mg/dL (Elevated).",
        },
        {
          date: "May 21, 2023",
          title: "Chest X-Ray",
          desc: "Negative for acute findings. Normal heart size.",
        },
      ],
      activeMeds: [
        { id: "am1", name: "Lisinopril", dosage: "10mg", frequency: "Daily" },
        {
          id: "am2",
          name: "Atorvastatin",
          dosage: "20mg",
          frequency: "Nightly",
        },
      ],
    },
    {
      id: "Q-1100",
      name: "Robert Miller",
      type: "WAITING",
      time: "11:00 AM",
      reason: "Post-Op Checkup",
      pid: "4412-KM",
      age: "45 Y.O.",
      gender: "Male",
      room: "Room 2A",
      history: [
        {
          date: "Jan 15, 2026",
          title: "Arthroscopic Knee Surgery",
          desc: "Left knee meniscus repair surgery completed successfully.",
        },
        {
          date: "Feb 02, 2026",
          title: "Post-Op Follow-up I",
          desc: "Wound healing well. Minor stiffness reported. Commenced physical therapy.",
        },
      ],
      activeMeds: [
        {
          id: "am3",
          name: "Tramadol",
          dosage: "50mg",
          frequency: "As Needed (PRN)",
        },
        { id: "am4", name: "Meloxicam", dosage: "15mg", frequency: "Daily" },
      ],
    },
    {
      id: "Q-1145",
      name: "Elena Rodriguez",
      type: "UPCOMING",
      time: "11:45 AM",
      reason: "ECG Results Discussion",
      pid: "9021-TR",
      age: "29 Y.O.",
      gender: "Female",
      room: "Waiting Pod B",
      history: [
        {
          date: "Nov 12, 2025",
          title: "Palpitations Incident",
          desc: "Presented to Urgent Care with brief sinus tachycardia episodes.",
        },
      ],
      activeMeds: [],
    },
    {
      id: "Q-1230",
      name: "Marcus Thorne",
      type: "UPCOMING",
      time: "12:30 PM",
      reason: "BP Medication Adjust.",
      pid: "3319-PL",
      age: "61 Y.O.",
      gender: "Male",
      room: "Triage Desk 1",
      history: [
        {
          date: "Aug 24, 2022",
          title: "Type 2 Diabetes Mellitus",
          desc: "Managed via dietary tracking and oral hypoglycemics.",
          tags: ["CHRONIC"],
        },
      ],
      activeMeds: [
        {
          id: "am5",
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice Daily",
        },
      ],
    },
  ]);

  const [activeQueueId, setActiveQueueId] = useState("Q-8829");
  const activeCase = queue.find((q) => q.id === activeQueueId) || queue[0];

  const [soapNotes, setSoapNotes] = useState({
    subjective:
      "Patient reports persistent fatigue and shortness of breath during light exercise...",
    objective:
      "BP: 142/88. Heart rate regular at 72 bpm. Minimal edema in lower extremities...",
    assessment:
      "Possible mild congestive heart failure. Rule out pulmonary hypertension.",
    plan: "Increase Lisinopril to 20mg. Schedule Echo. Follow up in 2 weeks.",
  });

  const [symptoms, setSymptoms] = useState([
    { id: "s1", label: "Chest Pain", checked: true },
    { id: "s2", label: "Palpitations", checked: true },
    { id: "s3", label: "Dizziness", checked: false },
    { id: "s4", label: "Nausea", checked: false },
  ]);

  const handleSoapChange = (field, value) => {
    setSoapNotes((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleSymptom = (id) => {
    setSymptoms((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    );
  };

  const handleAddMedication = (newMed) => {
    setQueue((prevQueue) =>
      prevQueue.map((p) => {
        if (p.id === activeCase.id) {
          return {
            ...p,
            activeMeds: [
              ...p.activeMeds,
              { id: `am-${Date.now()}`, ...newMed },
            ],
          };
        }
        return p;
      }),
    );
  };

  const handleFinishSession = () => {
    alert(`Consultation finalized for ${activeCase.name}.`);
    setQueue((prev) => prev.filter((q) => q.id !== activeCase.id));
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] ">
      {/* Top Bar Navigation Area */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
        <div className="relative w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Global search..."
            className="w-full bg-gray-100 text-xs pl-9 pr-4 py-2 rounded border-none outline-none focus:ring-1 focus:ring-teal-600 text-left"
          />
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-black transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="hover:text-black transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>


      <ActiveConsultationHeader className="shrink-0 my-4" caseData={activeCase} onFinish={handleFinishSession} />
      {/* Main Container Core Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch h-full px-4 pb-4"> 

        
        {/* COLUMN 1: LEFT PANEL (Queue & Timeline side-by-side) */}
        <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Left Sub-Col: Patient Queue */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
            <PatientVisitQueue
              queue={queue}
              selectedId={activeQueueId}
              onSelect={setActiveQueueId}
            />
          </div>

          {/* Right Sub-Col: Patient History Timeline */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full p-4">
            <ClinicalHistoryTimeline
              history={activeCase.history || []}
              activeMeds={activeCase.activeMeds || []}
            />
          </div>
        </div>

        {/* COLUMN 2: RIGHT PANEL (Master Workstation Data Desk) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <SoapNotesForm data={soapNotes} onChange={handleSoapChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div className="bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex flex-col justify-between">
              <SymptomsAndActions
                symptoms={symptoms}
                onToggle={handleToggleSymptom}
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex flex-col justify-between">
              <PrescriptionOrderEntry onAdd={handleAddMedication} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDash;
