// components/nurse/LiveQueue.jsx
import { useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';

export default function LiveQueue({ queue, selectedId, onSelectPatient, urgencyMeta }) {

  useEffect(() => {
    console.log("Queue updated:", queue);
  }, [queue]);
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-7">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/75 px-4 py-3 text-left">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-700" /> Clinical Assessment Backlog
        </h3>
        <div className="flex gap-1.5 font-mono text-[9px] font-bold uppercase tracking-wider">
          <span className="rounded bg-slate-200 text-slate-700 border border-slate-300 px-2 py-0.5">
            Pending: {queue.length}
          </span>
          <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 animate-pulse">
            Live Stream
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/30 text-[10px] font-bold uppercase tracking-wider text-slate-400 sticky top-0 z-10">
              <th className="px-5 py-3 font-bold">Patient Records</th>
              <th className="px-5 py-3 font-bold">Arrival Track</th>
              <th className="px-5 py-3 font-bold">Urgency Weight</th>
              <th className="px-5 py-3 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {queue.map((patient) => {
              const isSelected = patient.id === selectedId;
              const meta = urgencyMeta[patient.urgency] || urgencyMeta['LOW'];
              const BadgeIcon = meta.icon;

              return (
                <tr
                  key={patient.id}
                  onClick={() => onSelectPatient(patient)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-teal-50/40 hover:bg-teal-50/60' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-900">{patient.name}</p>
                    <p className="mt-0.5 text-[10px] font-mono text-slate-400">
                      ID: {patient.id} • {patient.gender === 'M' ? 'Male' : 'Female'}, {patient.age || '32'}y
                    </p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{patient.arrival}</span>
                    </div>
                    <p className={`mt-0.5 text-[10px] font-bold uppercase ${patient.urgency === 'CRITICAL' ? 'text-rose-600' : 'text-slate-400'}`}>
                      {patient.wait || 'Awaiting Check-in'}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${meta.badge}`}>
                      <BadgeIcon className="h-3 w-3" />
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectPatient(patient)}
                      className={`inline-flex items-center gap-1 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-all ${
                        isSelected 
                          ? 'bg-teal-700 text-white shadow-sm' 
                          : 'border border-teal-600 text-teal-700 bg-white hover:bg-teal-50'
                      }`}
                    >
                      <Activity className="h-3 w-3" />
                      {isSelected ? 'Active Triage' : 'Load Case'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {queue.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-400 font-medium bg-slate-50/10">
                  All triages clear. No active workflow tickets waiting.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}