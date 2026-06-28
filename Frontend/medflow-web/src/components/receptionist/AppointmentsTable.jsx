// components/receptionist/AppointmentsTable.jsx
import React from 'react';
import { SlidersHorizontal, Download } from 'lucide-react';

export default function AppointmentsTable({ appointments = [], onCheckIn }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Today's Appointment List</h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/30">
              <th className="px-6 py-3 font-semibold">Time</th>
              <th className="px-6 py-3 font-semibold">Patient Name</th>
              <th className="px-6 py-3 font-semibold">Appointment Type</th>
              <th className="px-6 py-3 font-semibold">Doctor</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {appointments.map((apt, index) => (
              <tr key={apt.id || index} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-slate-700">{apt.time}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{apt.patientName}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {apt.patientId}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{apt.type}</td>
                <td className="px-6 py-4 text-slate-700 font-medium">{apt.doctor}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-600 border border-amber-100">
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onCheckIn?.(apt)}
                    className="bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition hover:bg-teal-800 shadow-sm"
                  >
                    Check-in
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}