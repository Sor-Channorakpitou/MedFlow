// components/receptionist/AppointmentsTable.jsx
import React from 'react';
import { SlidersHorizontal, Download } from 'lucide-react';

export default function AppointmentsTable({ appointments = [], onCheckIn }) {

  const handleExport = () => {
    if (!appointments.length) return;

    const headers = [
      "Date",
      "Patient Name",
      "Patient ID",
      "Interval",
      "Doctor",
      "Status",
    ];

    const rows = appointments.map((apt) => [
      apt.date,
      apt.patientName,
      apt.patientId,
      `${apt.startTime} - ${apt.endTime}`,
      apt.doctor,
      apt.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((val) => `"${val ?? ""}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `appointments_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1 sm:flex-2">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Today's Appointment List</h3>
        <div className="flex gap-2">
          <button onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50">
            <Download className="w-5 h-5" /> Export
          </button>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 ">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[12px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/30">
              <th className="px-6 py-3 font-semibold">Appointment Id</th>
              <th className="px-6 py-3 font-semibold">Reason</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Patient Name</th>
              <th className="px-6 py-3 font-semibold">Interval</th>
              <th className="px-6 py-3 font-semibold">Doctor</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {appointments.map((apt, index) => (
              <tr key={apt.id || index} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-slate-700">{apt.id}</td>
                <td className="px-6 py-4 font-mono font-bold text-slate-700">{apt.reason}</td>
                <td className="px-6 py-4 font-mono font-bold text-slate-700">{apt.date}</td>
                <td className="px-6 py-4">
                  <p className="text-slate-700 font-medium">{apt.patientName}</p>
                  <p className="text-[14px] text-slate-400 text-slate-700 font-mono mt-0.5">ID: {apt.patientId}</p>
                </td>
                <td className="px-6 py-4 text-slate-700 font-medium">{apt.startTime} - {apt.endTime}</td>
                <td className="px-6 py-4 text-slate-700 font-medium">{apt.doctor}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-2 rounded text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-600 border border-amber-400">
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onCheckIn?.(apt)}
                    className="bg-teal-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition hover:bg-teal-800 shadow-sm"
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