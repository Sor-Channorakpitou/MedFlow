// components/receptionist/AppointmentsTable.jsx
import { useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { createQueue } from '../../services/queueAPI';
import { updateAppointment } from '../../services/appointmentAPI';


export default function AppointmentsTable({ appointments = [], onRefresh }) {
  const [checkingInId, setCheckingInId] = useState(null);
  const [checkedIn, setCheckedIn] = useState(new Set());
  const [error, setError] = useState('');

  const handleExport = () => {
    if (!appointments.length) return;

    const headers = ['Appt ID', 'Date', 'Patient Name', 'Patient ID', 'Interval', 'Doctor', 'Status'];
    const rows = appointments.map((apt) => [
      apt.id,
      apt.date,
      apt.patientName,
      apt.patientId,
      `${apt.startTime} - ${apt.endTime}`,
      apt.doctor,
      apt.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${val ?? ''}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCheckIn = async (apt) => {
    if (
      checkingInId === apt.id ||
      checkedIn.has(apt.id) ||
      apt.status === 'COMPLETED' ||
      apt.status === 'CANCELLED'
    ) return;

    // Already has a live queue entry — don't double-create
    if (apt.queue && apt.queue.stage !== 'COMPLETED' && apt.queue.status !== 'CANCELLED') {
      setCheckedIn((prev) => new Set(prev).add(apt.id));
      return;
    }

    setCheckingInId(apt.id);
    setError('');

    try {
      await createQueue({
        patientId: apt.patientId,
        stage: 'DOCTOR',
        status: 'WAITING',
        appointmentId: apt.id,
        ...(apt.doctorSpecialtyId ? { requiredSpecialtyId: apt.doctorSpecialtyId } : {}),
      });

      await updateAppointment(apt.id, { status: 'CONFIRMED' });

      setCheckedIn((prev) => new Set(prev).add(apt.id));
      onRefresh?.();
    } catch (err) {
      const msg = err?.response?.data?.message ?? '';
      if (msg === 'Patient is already in the queue') {
        await updateAppointment(apt.id, { status: 'CONFIRMED' }).catch(() => {});
        setCheckedIn((prev) => new Set(prev).add(apt.id));
        onRefresh?.();
      } else {
        console.error('Check-in failed:', err);
        setError(`Check-in failed for ${apt.patientName}: ${msg || 'Unknown error'}`);
      }
    } finally {
      setCheckingInId(null);
    }
  };

  const isCheckedIn = (apt) =>
    checkedIn.has(apt.id) ||
    apt.status === 'CONFIRMED' ||
    apt.status === 'COMPLETED' ||
    (apt.queue && apt.queue.stage !== 'COMPLETED' && apt.queue.status !== 'CANCELLED');

  const getStatusBadge = (status) => {
    const map = {
      PENDING:   'bg-amber-50 text-amber-600 border-amber-400',
      CONFIRMED: 'bg-teal-50 text-teal-700 border-teal-400',
      COMPLETED: 'bg-slate-100 text-slate-500 border-slate-300',
      CANCELLED: 'bg-rose-50 text-rose-600 border-rose-400',
    };
    return map[status] ?? 'bg-slate-50 text-slate-500 border-slate-200';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Today's Appointment List
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-6 py-2 bg-rose-50 border-b border-rose-100 text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[12px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/30">
              <th className="px-6 py-3">Appt ID</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Interval</th>
              <th className="px-6 py-3">Doctor</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-400 text-xs">
                  No appointments scheduled for today.
                </td>
              </tr>
            ) : (
              appointments.map((apt, index) => {
                const alreadyIn = isCheckedIn(apt);
                const isLoading = checkingInId === apt.id;

                return (
                  <tr key={apt.id ?? index} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">{apt.id}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-[120px] truncate">{apt.reason ?? '—'}</td>
                    <td className="px-6 py-4 font-mono text-slate-600">{apt.date}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 font-medium">{apt.patientName}</p>
                      <p className="text-[12px] text-slate-400 font-mono mt-0.5">ID: {apt.patientId}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                      {apt.startTime} – {apt.endTime}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{apt.doctor}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase border ${getStatusBadge(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {alreadyIn ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600">
                          <CheckCircle2 className="w-4 h-4" /> Checked In
                        </span>
                      ) : (
                        <div className="inline-flex flex-col items-end gap-0.5">
                          <button
                            type="button"
                            disabled={isLoading || apt.status === 'CANCELLED'}
                            onClick={() => handleCheckIn(apt)}
                            className="bg-teal-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition hover:bg-teal-800 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                          >
                            {isLoading ? (
                              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking in...</>
                            ) : (
                              'Check-in'
                            )}
                          </button>
                          {apt.doctor && apt.status === 'CANCELLED' && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              → Dr. {apt.doctor}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
