// pages/NurseDash.jsx
import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  HelpCircle,
  Search,
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

const URGENCY_META = {
  CRITICAL: { label: 'CRITICAL', badge: 'bg-rose-100 text-rose-700 border-rose-300', panel: 'bg-rose-600 text-white', icon: AlertTriangle },
  HIGH: { label: 'HIGH', badge: 'bg-amber-100 text-amber-700 border-amber-300', panel: 'bg-amber-500 text-white', icon: TriangleAlert },
  MEDIUM: { label: 'MEDIUM', badge: 'bg-blue-100 text-blue-700 border-blue-300', panel: 'bg-blue-600 text-white', icon: Minus },
  LOW: { label: 'LOW', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', panel: 'bg-emerald-600 text-white', icon: CircleDot },
};

const initialQueue = [
  { id: '449201', name: 'MARCUS, ELIAS', age: 62, gender: 'M', arrival: '08:42 AM', wait: '12m OVER', urgency: 'CRITICAL', room: 'EMERGENCY ROOM 2A', vitals: { bpSys: '145', bpDia: '95', hr: '108', temp: '38.4', spo2: '94' }, notes: '' },
  { id: '881203', name: 'WANG, LINDA', age: 31, gender: 'F', arrival: '09:05 AM', wait: 'WAITING 14m', urgency: 'HIGH', room: 'ER WAITING', vitals: { bpSys: '132', bpDia: '86', hr: '101', temp: '37.6', spo2: '97' }, notes: '' },
  { id: '102934', name: 'SANTOS, CARLOS', age: 45, gender: 'M', arrival: '09:12 AM', wait: 'WAITING 7m', urgency: 'MEDIUM', room: 'ER WAITING', vitals: { bpSys: '126', bpDia: '82', hr: '92', temp: '37.2', spo2: '98' }, notes: '' },
  { id: '556701', name: 'BROWN, JESSICA', age: 19, gender: 'F', arrival: '09:15 AM', wait: 'WAITING 4m', urgency: 'LOW', room: 'ER WAITING', vitals: { bpSys: '118', bpDia: '76', hr: '84', temp: '36.9', spo2: '99' }, notes: '' },
];

const logsSeed = [
  { id: 1, time: '09:12 AM', text: 'Patient Santos, C. moved to Dr. Aris [Room 4]', tone: 'success' },
  { id: 2, time: '09:05 AM', text: 'Triage alert: Critical vitals for Marcus, E.', tone: 'danger' },
  { id: 3, time: '08:58 AM', text: 'Patient Lee, K. discharged by Dr. Aris', tone: 'info' },
];

function getBpStatus(sys, dia) {
  const s = Number(sys);
  const d = Number(dia);
  if (!Number.isFinite(s) || !Number.isFinite(d)) return 'UNKNOWN';
  if (s >= 140 || d >= 90) return 'HYPERTENSIVE';
  if (s >= 120 || d >= 80) return 'ELEVATED';
  return 'NORMAL';
}

function NurseDash() {
  const [queue, setQueue] = useState(initialQueue);
  const [selectedId, setSelectedId] = useState(initialQueue[0].id);
  const [urgencyLevel, setUrgencyLevel] = useState(initialQueue[0].urgency);
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [vitals, setVitals] = useState(initialQueue[0].vitals);
  const [logs, setLogs] = useState(logsSeed);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPatient = useMemo(
    () => queue.find((p) => p.id === selectedId) || queue[0] || null,
    [queue, selectedId],
  );

  const filteredQueue = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return queue;
    return queue.filter((p) => (
      p.name.toLowerCase().includes(q) ||
      p.id.includes(q) ||
      p.urgency.toLowerCase().includes(q)
    ));
  }, [queue, search]);

  const criticalCount = queue.filter((p) => p.urgency === 'CRITICAL').length;
  const activeBpStatus = getBpStatus(vitals.bpSys, vitals.bpDia);

  const handleSelectPatient = (patient) => {
    setSelectedId(patient.id);
    setUrgencyLevel(patient.urgency);
    setVitals(patient.vitals);
    setNotes(patient.notes || '');
  };

  const handleMoveToDoctor = async () => {
    if (!selectedPatient) return;
    setIsSubmitting(true);
    try {
      const patientSnapshot = selectedPatient;
      const updatedQueue = queue.filter((p) => p.id !== patientSnapshot.id);
      setQueue(updatedQueue);
      
      setLogs((prev) => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `${patientSnapshot.name} moved to doctor with ${urgencyLevel} priority`,
          tone: 'success',
        },
        ...prev,
      ]);

      const next = updatedQueue[0] || null;
      if (next) {
        setSelectedId(next.id);
        setUrgencyLevel(next.urgency);
        setVitals(next.vitals);
        setNotes(next.notes || '');
      } else {
        setSelectedId('');
        setVitals({ bpSys: '', bpDia: '', hr: '', temp: '', spo2: '' });
        setNotes('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f4f6f8] text-left text-gray-900">
      {/* <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="relative w-full max-w-4xl pr-4">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name, ID, or triage level..."
            className="w-full rounded border border-gray-200 bg-gray-100 py-2 pl-9 pr-4 text-xs outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-5">
          <button className="text-gray-500 transition hover:text-gray-900" type="button"><Bell className="h-4 w-4" /></button>
          <button className="text-gray-500 transition hover:text-gray-900" type="button"><HelpCircle className="h-4 w-4" /></button>
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">SJ</div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold leading-none text-gray-800">Nurse Sarah J.</p>
              <p className="mt-0.5 text-[10px] text-gray-400">Head of Triage</p>
            </div>
          </div>
        </div>
      </header> */} 

      <Header />

      <main className="flex min-h-0 flex-1 flex-col gap-4 p-4">
        {/* Metric Cards Grid Layout */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Critical Patients" value={`0${criticalCount}`} icon={AlertTriangle} iconBgColor="bg-rose-50" iconColor="text-rose-600" />
          <MetricCard label="Avg. Wait Time" value="14 min" icon={TimerReset} iconBgColor="bg-teal-50" iconColor="text-teal-600" />
          <MetricCard label="Awaiting Triage" value={String(queue.length).padStart(2, '0')} icon={Users} iconBgColor="bg-gray-100" iconColor="text-gray-500" />
          <MetricCard label="Total Managed Today" value={124} icon={CheckCircle2} iconBgColor="bg-emerald-50" iconColor="text-emerald-600" />
        </section>

        {/* Workspace Panels Section Split */}
        <section className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-12">
          <LiveQueue 
            queue={filteredQueue} 
            selectedId={selectedId} 
            onSelectPatient={handleSelectPatient} 
            urgencyMeta={URGENCY_META} 
          />

          <div className="flex min-h-0 flex-col gap-4 xl:col-span-5">
            <ActiveTriagePanel
              selectedPatient={selectedPatient}
              urgencyLevel={urgencyLevel}
              setUrgencyLevel={setUrgencyLevel}
              vitals={vitals}
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