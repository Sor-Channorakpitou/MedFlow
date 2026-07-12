import { useState } from 'react';
import { Download, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
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
      PENDING: 'bg-amber-50 text-amber-700 border-amber-300',
      CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      COMPLETED: 'bg-gray-100 text-gray-600 border-gray-300',
      CANCELLED: 'bg-red-50 text-red-700 border-red-300',
    };
    return map[status] ?? 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getStatusColor = (status) => {
    const map = {
      PENDING: 'text-amber-600',
      CONFIRMED: 'text-emerald-600',
      COMPLETED: 'text-gray-500',
      CANCELLED: 'text-red-600',
    };
    return map[status] ?? 'text-gray-500';
  };

  // Empty state
  if (appointments.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No appointments today
          </h3>
          <p className="text-sm text-gray-600">
            There are no scheduled appointments for today.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-white min-h-0 overflow-hidden">
      {/* Header Bar */}
      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 2xl:px-10 py-4 sm:py-5 border-b border-gray-200 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide">
              Today's Appointments
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'} scheduled
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="inline sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 2xl:px-10 py-3 sm:py-4 bg-red-50 border-b border-red-200">
          <p className="text-xs sm:text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Table Container - Desktop View */}
      <div className="hidden md:block flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold uppercase tracking-wide text-gray-600">
                Appt ID
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold uppercase tracking-wide text-gray-600">
                Reason
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold uppercase tracking-wide text-gray-600">
                Patient
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold uppercase tracking-wide text-gray-600">
                Time
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold uppercase tracking-wide text-gray-600">
                Doctor
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold uppercase tracking-wide text-gray-600">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((apt, index) => {
              const alreadyIn = isCheckedIn(apt);
              const isLoading = checkingInId === apt.id;

              return (
                <tr key={apt.id ?? index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono font-semibold text-sm text-gray-900">
                    {apt.id}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                    <span className="line-clamp-1">{apt.reason ?? '—'}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium text-gray-900">{apt.patientName}</p>
                      <p className="text-xs text-gray-500 font-mono">ID: {apt.patientId}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                    {apt.startTime} – {apt.endTime}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-700 font-medium">
                    {apt.doctor}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                        apt.status,
                      )}`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                    {alreadyIn ? (
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>Checked In</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isLoading || apt.status === 'CANCELLED'}
                        onClick={() => handleCheckIn(apt)}
                        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            <span className="hidden sm:inline">Checking in...</span>
                            <span className="inline sm:hidden">In...</span>
                          </>
                        ) : (
                          <>
                            <span>Check-in</span>
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
        {appointments.map((apt, index) => {
          const alreadyIn = isCheckedIn(apt);
          const isLoading = checkingInId === apt.id;

          return (
            <div
              key={apt.id ?? index}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 space-y-3 sm:space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                    {apt.patientName}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 font-mono mt-0.5">
                    ID: {apt.patientId}
                  </p>
                </div>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${getStatusBadge(
                    apt.status,
                  )}`}
                >
                  {apt.status}
                </span>
              </div>

              {/* Card Details Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                    Appointment ID
                  </p>
                  <p className="font-mono font-semibold text-gray-900">{apt.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                    Time
                  </p>
                  <p className="font-medium text-gray-900">
                    {apt.startTime} – {apt.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                    Doctor
                  </p>
                  <p className="text-gray-900">{apt.doctor}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                    Date
                  </p>
                  <p className="text-gray-900">{apt.date}</p>
                </div>
              </div>

              {/* Card Description */}
              {apt.reason && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                    Reason
                  </p>
                  <p className="text-sm text-gray-700">{apt.reason}</p>
                </div>
              )}

              {/* Card Action */}
              <div className="border-t border-gray-100 pt-3 sm:pt-4">
                {alreadyIn ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Checked In</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isLoading || apt.status === 'CANCELLED'}
                    onClick={() => handleCheckIn(apt)}
                    className="w-full py-2.5 sm:py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Checking in...
                      </>
                    ) : (
                      <>
                        Check-in Patient
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}