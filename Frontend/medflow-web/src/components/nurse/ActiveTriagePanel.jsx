// components/nurse/ActiveTriagePanel.jsx
import React from 'react';
import { Send, ArrowUp, Zap, Thermometer, CheckCircle2, ShieldAlert } from 'lucide-react';

function VitalCard({ label, value, suffix, status, icon: Icon, className = '' }) {
  const statusBadgeClass = (statusStr) => {
    switch (statusStr) {
      case 'HYPERTENSIVE': return 'text-rose-700 bg-rose-50 border-rose-100';
      case 'ELEVATED': return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'NORMAL': return 'text-teal-700 bg-teal-50 border-teal-100';
      case 'TACHYCARDIA': return 'text-rose-700 bg-rose-50 border-rose-100';
      case 'FEVER': return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'LOW': return 'text-rose-700 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className={`relative border border-slate-200 rounded-xl bg-white p-2.5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">{label}</span>
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
      </div>
      <div className="mt-1 flex items-end gap-0.5 font-mono">
        <span className="text-base font-black text-slate-900">{value || '--'}</span>
        {suffix && <span className="pb-0.5 text-[10px] text-slate-400 font-medium">{suffix}</span>}
      </div>
      {status && (
        <span className={`absolute bottom-2 right-2 rounded border px-1.5 py-0.5 text-[8px] font-bold tracking-wide uppercase ${statusBadgeClass(status)}`}>
          {status}
        </span>
      )}
    </div>
  );
}

export default function ActiveTriagePanel({
  selectedPatient,
  urgencyLevel,
  setUrgencyLevel,
  vitals,
  bpStatus,
  notes,
  setNotes,
  onMoveToDoctor,
  isSubmitting,
  urgencyMeta
}) {
  return (
    // FIX: Forced absolute height bounds with h-full and completely disabled overflow leaks
    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      
      {/* Panel Header */}
      <div className="shrink-0 flex items-center justify-between bg-teal-700 px-4 py-2.5 text-white">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-200" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Active Clinical Triage: {selectedPatient?.name || 'No Case Loaded'}
          </h3>
        </div>
        <span className="rounded-lg bg-teal-800/80 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wide text-teal-100 border border-teal-600">
          {selectedPatient?.id ? `APT-${selectedPatient.id}` : 'STATION 01'}
        </span>
      </div>

      {/* Main Body Layout Engine */}
      <div className="flex-1 flex flex-col p-4 space-y-3.5 min-h-0 text-left">
        
        {/* Section 1: Urgency Matrix */}
        <div className="shrink-0 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assign Urgency Priority Level</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(urgencyMeta).map((lvl) => {
              const meta = urgencyMeta[lvl];
              const Icon = meta.icon;
              const active = urgencyLevel === lvl;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgencyLevel(lvl)}
                  className={`flex items-center justify-center gap-1 rounded-lg border py-1.5 text-[10px] font-black uppercase transition-all tracking-wide ${
                    active
                      ? lvl === 'CRITICAL' ? 'border-rose-600 bg-rose-600 text-white shadow-sm'
                      : lvl === 'HIGH' ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                      : lvl === 'MEDIUM' ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-teal-600 bg-teal-600 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-100/80 hover:text-slate-700'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Vitals Layer */}
        <div className="shrink-0 space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Vitals Verification Input</label>
          <div className="grid grid-cols-2 gap-2">
            <VitalCard
              label="BP (mmHg)"
              value={vitals.bpSys}
              suffix={`/ ${vitals.bpDia}`}
              status={bpStatus}
              icon={ArrowUp}
            />
            <VitalCard
              label="HR (bpm)"
              value={vitals.hr}
              status={vitals.hr ? (Number(vitals.hr) >= 100 ? 'TACHYCARDIA' : 'NORMAL') : null}
              icon={Zap}
            />
            <VitalCard
              label="Temp (°C)"
              value={vitals.temp}
              status={vitals.temp ? (Number(vitals.temp) >= 37.8 ? 'FEVER' : 'NORMAL') : null}
              icon={Thermometer}
            />
            <VitalCard
              label="SpO2 (%)"
              value={vitals.spo2}
              status={vitals.spo2 ? (Number(vitals.spo2) < 95 ? 'LOW' : 'NORMAL') : null}
              icon={CheckCircle2}
            />
          </div>
        </div>

        {/* Section 3: Observation Field (Calculates exact remaining height dynamically) */}
        <div className="flex-1 flex flex-col space-y-1 min-h-0">
          <label className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">Chief Complaint & Observations</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document presentation notes, allergen alerts, and triage findings..."
            className="w-full flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs outline-none transition font-medium text-slate-800 focus:bg-white focus:border-teal-600"
          />
        </div>
      </div>

      {/* Primary Actions Form Footer */}
      <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-3">
        <button
          type="button"
          onClick={onMoveToDoctor}
          disabled={!selectedPatient || isSubmitting}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 text-xs uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
        >
          <Send className="h-3.5 w-3.5" />
          Commit & Handover Case
        </button>
      </div>

    </div>
  );
}