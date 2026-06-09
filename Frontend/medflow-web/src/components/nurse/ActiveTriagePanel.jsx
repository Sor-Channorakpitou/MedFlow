// components/nurse/ActiveTriagePanel.jsx
import React from 'react';
import { Send, ArrowUp, Zap, Thermometer, CheckCircle2 } from 'lucide-react';

function VitalCard({ label, value, suffix, status, icon: Icon, className = '' }) {
  const statusBadgeClass = (statusStr) => {
    switch (statusStr) {
      case 'HYPERTENSIVE': return 'text-rose-600 bg-rose-50';
      case 'ELEVATED': return 'text-amber-600 bg-amber-50';
      case 'NORMAL': return 'text-emerald-600 bg-emerald-50';
      case 'TACHYCARDIA': return 'text-rose-600 bg-rose-50';
      case 'FEVER': return 'text-amber-600 bg-amber-50';
      case 'LOW': return 'text-rose-600 bg-rose-50';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className={`relative border border-gray-200 rounded-lg bg-white p-3 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold tracking-wide uppercase text-gray-400">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
      </div>
      <div className="mt-2 flex items-end gap-1 font-mono">
        <span className="text-lg font-bold text-gray-900">{value}</span>
        {suffix && <span className="pb-0.5 text-xs text-gray-400">{suffix}</span>}
      </div>
      {status && (
        <span className={`absolute bottom-2 right-2 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${statusBadgeClass(status)}`}>
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-[#0f766e] px-4 py-3 text-white">
        <h3 className="text-xs font-bold uppercase tracking-wider">
          Active Triage: {selectedPatient?.name || 'No Patient Selected'}
        </h3>
        <span className="rounded bg-teal-900/60 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-white">
          {selectedPatient?.room || 'ER ROOM'}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {/* Urgency Matrix */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Assign Urgency Level</label>
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
                  className={`flex items-center justify-center gap-1 rounded border px-1 py-2 text-[10px] font-black uppercase transition ${
                    active
                      ? lvl === 'CRITICAL' ? 'border-rose-600 bg-rose-600 text-white shadow-sm'
                      : lvl === 'HIGH' ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                      : lvl === 'MEDIUM' ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vitals Layer */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400">Vitals Recording</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 ">
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
              status={Number(vitals.hr) >= 100 ? 'TACHYCARDIA' : 'NORMAL'}
              icon={Zap}
            />
            <VitalCard
              label="Temp (°C)"
              value={vitals.temp}
              status={Number(vitals.temp) >= 37.8 ? 'FEVER' : 'NORMAL'}
              icon={Thermometer}
            />
            <VitalCard
              label="SpO2 (%)"
              value={vitals.spo2}
              status={Number(vitals.spo2) < 95 ? 'LOW' : 'NORMAL'}
              icon={CheckCircle2}
              className="sm:col-span-1"
            />
          </div>
        </div>

        {/* Observation Field */}
        <div className="flex min-h-[160px] flex-1 flex-col space-y-1.5 pt-1">
          <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Chief Complaint / Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter clinical observations..."
            className="min-h-[140px] w-full flex-1 resize-none rounded border border-gray-200 bg-gray-50 p-3 text-xs outline-none transition focus:bg-white focus:ring-1 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* Primary Actions Form Footer */}
      <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-3">
        <button
          type="button"
          onClick={onMoveToDoctor}
          disabled={!selectedPatient || isSubmitting}
          className="flex flex-1 items-center justify-center gap-2 rounded bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          Move to Doctor
        </button>
        <button
          type="button"
          className="rounded border border-gray-300 bg-white px-4 py-2 text-xs font-bold uppercase text-gray-700 transition hover:bg-gray-50"
        >
          Save Draft
        </button>
      </div>
    </div>
  );
}