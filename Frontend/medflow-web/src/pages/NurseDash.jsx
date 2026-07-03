// pages/NurseDash.jsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  TimerReset,
  TriangleAlert,
  Users,
  Minus,
  CircleDot,
} from 'lucide-react';

// Components imports
import MetricCard from '../components/nurse/MetricCard';
import LiveQueue from '../components/nurse/LiveQueue';
import ActiveTriagePanel from '../components/nurse/ActiveTriagePanel';
import StationLogs from '../components/nurse/StationLogs'; 
import Header from '../components/Header';

import { useWorkflow } from '../context/WorkflowContext';

const URGENCY_META = {
  4: { label: 'CRITICAL', badge: 'bg-rose-100 text-rose-700 border-rose-300', panel: 'bg-rose-600 text-white', icon: AlertTriangle },
  3: { label: 'HIGH', badge: 'bg-amber-100 text-amber-700 border-amber-300', panel: 'bg-amber-500 text-white', icon: TriangleAlert },
  2: { label: 'MEDIUM', badge: 'bg-blue-100 text-blue-700 border-blue-300', panel: 'bg-blue-600 text-white', icon: Minus },
  1: { label: 'LOW', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', panel: 'bg-emerald-600 text-white', icon: CircleDot },
};

const logsSeed = [
  { id: 1, time: '09:12 AM', text: 'Patient Santos, C. moved to Dr. Aris [Room 4]', tone: 'success' },
  { id: 2, time: '09:05 AM', text: 'Triage alert: Critical vitals logged', tone: 'danger' },
];

function getBpStatus(bpString) {
  if (!bpString || !bpString.includes('/')) return 'UNKNOWN';
  const [sys, dia] = bpString.split('/').map(Number);
  if (!Number.isFinite(sys) || !Number.isFinite(dia)) return 'UNKNOWN';
  if (sys >= 140 || dia >= 90) return 'HYPERTENSIVE';
  if (sys >= 120 || dia >= 80) return 'ELEVATED';
  return 'NORMAL';
}

function NurseDash() {
  const { appointments, patients, triages, submitNurseTriage } = useWorkflow();
  
  const [selectedId, setSelectedId] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState(3); // Default to Level 3 (High/Medium boundary)
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState(logsSeed);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form input fields for vitals state management
  const [bp, setBp] = useState('120/80');
  const [hr, setHr] = useState('80');
  const [temp, setTemp] = useState('37.0');
  const [weight, setWeight] = useState('70');

  const currentUser = {
    name: "Sarah J.",
    role: "Head of Triage",
    initials: "SJ"
  };

  // ==========================================================================
  // RELATIONAL DATA JOIN: Extract and format all triage-pending workflows
  // ==========================================================================
  const reactiveQueue = useMemo(() => {
    return appointments
      .filter(app => app.workflow_step === 'AWAITING_TRIAGE')
      .map(app => {
        const patientInfo = patients.find(p => p.patient_id === app.patient_id);
        
        // Calculate age mock natively
        const birthYear = patientInfo?.date_of_birth ? new Date(patientInfo.date_of_birth).getFullYear() : 1990;
        const currentYear = new Date().getFullYear();

        return {
          id: app.appointment_id, // Map appointment context key
          patientId: app.patient_id,
          name: patientInfo ? patientInfo.full_name.toUpperCase() : "UNKNOWN",
          age: currentYear - birthYear,
          gender: patientInfo?.gender === "Male" ? "M" : "F",
          arrival: new Date(app.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          wait: 'WAITING',
          urgency: urgencyLevel, 
          vitals: { bpSys: '120', bpDia: '80', hr: '80', temp: '37.0', spo2: '98' }, // Form fields override this
          notes: ''
        };
      });
  }, [appointments, patients]);

  // Handle auto-selecting the first item in the incoming data pipe
  useEffect(() => {
    if (reactiveQueue.length > 0 && !selectedId) {
      setSelectedId(reactiveQueue[0].id);
    }
  }, [reactiveQueue, selectedId]);

  const selectedPatient = useMemo(
    () => reactiveQueue.find((p) => p.id === selectedId) || reactiveQueue[0] || null,
    [reactiveQueue, selectedId],
  );

  const filteredQueue = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reactiveQueue;
    return reactiveQueue.filter((p) => (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    ));
  }, [reactiveQueue, search]);

  const criticalCount = triages.filter((t) => t.urgency_level === 4).length;
  const activeBpStatus = getBpStatus(bp);

  const handleSelectPatient = (patient) => {
    setSelectedId(patient.id);
    setNotes('');
  };

  // ==========================================================================
  // METADATA MUTATION SUBMIT: Push valid payload down the line to Doctors
  // ==========================================================================
  const handleMoveToDoctor = async () => {
    if (!selectedPatient) return;
    setIsSubmitting(true);
    
    try {
      // Package payload fields matching context parameters
      const vitalsPayload = {
        blood_pressure: bp,
        temperature: temp,
        heart_rate: hr,
        weight: weight,
        urgency_level: urgencyLevel,
        note: notes
      };

      // Call central workflow mutator
      submitNurseTriage(selectedPatient.id, selectedPatient.patientId, vitalsPayload);

      setLogs((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `${selectedPatient.name} transferred down pipeline to medical evaluation staff.`,
          tone: 'success',
        },
        ...prev,
      ]);

      // Clear the current selections out to reset layout index tracking
      setSelectedId('');
    } catch (err) {
      console.error("Pipeline breakdown pushing data forward:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col  bg-[#f4f6f8] text-left text-gray-900">
      <Header 
        user={currentUser}
        searchPlaceholder="Search..."
        searchValue={search}
        onSearchChange={setSearch}
        hasNotifications={true}
      />

      <main className="flex  flex-1 flex-col gap-4 p-4  ">
        {/* Metric Cards Layout */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 shrink-0">
          <MetricCard label="Logged Critical Statuses" value={`0${criticalCount}`} icon={AlertTriangle} iconBgColor="bg-rose-50" iconColor="text-rose-600" />
          <MetricCard label="Target Cycle Time" value="14 min" icon={TimerReset} iconBgColor="bg-teal-50" iconColor="text-teal-600" />
          <MetricCard label="Awaiting Triage Buffer" value={String(reactiveQueue.length).padStart(2, '0')} icon={Users} iconBgColor="bg-gray-100" iconColor="text-gray-500" />
          <MetricCard label="Total Tracked Today" value={25 + triages.length} icon={CheckCircle2} iconBgColor="bg-emerald-50" iconColor="text-emerald-600" />
        </section>

        {/* Core Workspace Panels Layout */}
        <section className="grid  flex-1 grid-cols-1 gap-4 xl:grid-cols-12 overflow-hidden">
          <LiveQueue 
            queue={filteredQueue} 
            selectedId={selectedId} 
            onSelectPatient={handleSelectPatient} 
            urgencyMeta={URGENCY_META} 
          />

          <div className="flex  flex-col gap-4 xl:col-span-5 overflow-hidden">
            {/* Added local state hooks inputs variables to capture changing fields elements inside form view */}
            <ActiveTriagePanel
              selectedPatient={selectedPatient}
              urgencyLevel={urgencyLevel}
              setUrgencyLevel={setUrgencyLevel}
              vitals={{ bp, hr, temp, weight }}
              setBp={setBp}
              setHr={setHr}
              setTemp={setTemp}
              setWeight={setWeight}
              bpStatus={activeBpStatus}
              notes={notes}
              setNotes={setNotes}
              onMoveToDoctor={handleMoveToDoctor}
              isSubmitting={isSubmitting}
              urgencyMeta={URGENCY_META}
            />
            
            <StationLogs logs={logs} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default NurseDash;