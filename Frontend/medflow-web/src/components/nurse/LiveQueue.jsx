// components/nurse/LiveQueue.jsx
import React from 'react';
import { MoreVertical, Activity } from 'lucide-react';

export default function LiveQueue({ queue, selectedId, onSelectPatient, urgencyMeta }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-gray-200 bg-white shadow-sm xl:col-span-7">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Live Triage Queue</h3>
        <div className="flex gap-1">
          <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-700">Active</span>
          <span className="rounded bg-teal-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Receptive</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <th className="px-4 py-2.5 font-semibold">Patient Details</th>
              <th className="px-4 py-2.5 font-semibold">Arrival</th>
              <th className="px-4 py-2.5 font-semibold">Urgency</th>
              <th className="px-4 py-2.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {queue.map((patient) => {
              const isSelected = patient.id === selectedId;
              const meta = urgencyMeta[patient.urgency];
              const BadgeIcon = meta.icon;

              return (
                <tr
                  key={patient.id}
                  onClick={() => onSelectPatient(patient)}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-teal-50/40' : 'hover:bg-gray-50/70'}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900">{patient.name}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      ID: {patient.id} • {patient.gender}, {patient.age}y
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{patient.arrival}</p>
                    <p className={`mt-0.5 text-[10px] font-bold ${patient.urgency === 'CRITICAL' ? 'text-rose-600' : 'text-teal-600'}`}>
                      {patient.wait}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[9px] font-black tracking-wider ${meta.badge}`}>
                      <BadgeIcon className="h-3 w-3" />
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectPatient(patient)}
                        className="flex items-center gap-1 rounded border border-teal-600 px-3 py-1 text-[11px] font-bold text-teal-600 transition hover:bg-teal-600 hover:text-white"
                      >
                        <Activity className="h-3 w-3" />
                        Triage
                      </button>
                      <button type="button" className="text-gray-400 transition hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}