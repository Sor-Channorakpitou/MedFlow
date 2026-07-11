import { useState, useMemo, useEffect, useCallback } from 'react';
import AppointmentsTable from '../components/receptionist/AppointmentsTable';
import NewPatientRegistration from '../components/receptionist/NewPatientRegistration';
import PatientCheckout from '../components/receptionist/PatientCheckout';
import ReceptionSidePanel from '../components/receptionist/ReceptionSidePanel';
import Header from '../components/Header';
import { getAllAppointments } from '../services/appointmentAPI';
import { getAllQueues } from '../services/queueAPI';
import { useSocket } from '../hooks/useSocket';
import { SOCKET_EVENTS } from '../sockets/socketEvents';

function ReceptionistDash() {
  const socket = useSocket();

  const [appointmentList, setAppointmentList] = useState([]);
  const [billingQueue, setBillingQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subView, setSubView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCheckoutQueueId, setSelectedCheckoutQueueId] = useState('');

  // ─── Data fetchers ──────────────────────────────────────────────────────────
  const fetchAppointments = useCallback(async () => {
    try {
      const data = await getAllAppointments();
      setAppointmentList(Array.isArray(data) ? data : []);
    } catch {
      console.error('Failed to load appointments');
    }
  }, []);

  const fetchBillingQueue = useCallback(async () => {
    try {
      const data = await getAllQueues();
      const queues = Array.isArray(data) ? data : [];
      setBillingQueue(queues.filter((q) => q.stage === 'BILLING' && q.status === 'WAITING'));
    } catch {
      setBillingQueue([]);
    }
  }, []);

  // ─── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await Promise.allSettled([fetchAppointments(), fetchBillingQueue()]);
      } catch {
        setError('Failed to load some dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchAppointments, fetchBillingQueue]);

  // ─── Socket-driven updates ──────────────────────────────────────────────────
  // PATIENT_MOVED_STAGE fires when a patient arrives at BILLING
  // (from consultation with no meds, or after pharmacy dispense)
  useEffect(() => {
    if (!socket) return;

    const handleMovedStage = () => {
      fetchBillingQueue();
    };

    const handleQueueUpdated = () => {
      fetchBillingQueue();
    };

    socket.on(SOCKET_EVENTS.PATIENT_MOVED_STAGE, handleMovedStage);
    socket.on(SOCKET_EVENTS.MEDICATION_DISPENSED, handleMovedStage);
    socket.on(SOCKET_EVENTS.QUEUE_UPDATED, handleQueueUpdated);
    socket.on(SOCKET_EVENTS.BILL_GENERATED, handleMovedStage);

    return () => {
      socket.off(SOCKET_EVENTS.PATIENT_MOVED_STAGE, handleMovedStage);
      socket.off(SOCKET_EVENTS.MEDICATION_DISPENSED, handleMovedStage);
      socket.off(SOCKET_EVENTS.QUEUE_UPDATED, handleQueueUpdated);
      socket.off(SOCKET_EVENTS.BILL_GENERATED, handleMovedStage);
    };
  }, [socket, fetchBillingQueue]);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const isToday = (date) => {
    const d = new Date(date);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  };

  // ─── Derived lists ──────────────────────────────────────────────────────────
  const activeAppointmentsList = useMemo(() => {
    return appointmentList
      .filter((a) => isToday(a.appointmentDate))
      .map((app) => ({
        id: app.id,
        patientName: app.patient?.fullName ?? 'Unknown',
        doctor: app.user?.name ?? 'Unassigned',
        doctorSpecialtyId: app.user?.specialtyId ?? null,
        reason: app.reason,
        startTime: app.startTime,
        endTime: app.endTime,
        patientId: app.patientId,
        invoice: app.invoice,
        queue: app.queue ?? null,
        status: app.status,
        date: app.appointmentDate,
      }))
      .filter((apt) => apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [appointmentList, searchQuery]);

  const financialMetrics = useMemo(() => {
    const latestTransaction = [...appointmentList]
      .filter((a) => a.invoice?.paymentStatus === 'PAID')
      .sort((a, b) => new Date(b.invoice?.issuedDate || b.appointmentDate) - new Date(a.invoice?.issuedDate || a.appointmentDate))[0];

    const total = appointmentList
      .filter((a) => isToday(a.appointmentDate) && a.invoice?.paymentStatus === 'PAID')
      .reduce((sum, app) => sum + Number(app.invoice?.totalAmount ?? 0), 0)
      .toFixed(2);

    return {
      pendingInvoices: billingQueue.length,
      collectionsToday: `$${total}`,
      transactions: latestTransaction
        ? [
            {
              name: latestTransaction.patient?.fullName,
              type: latestTransaction.invoice?.paymentMethod,
              amount: latestTransaction.invoice?.totalAmount,
            },
          ]
        : [],
    };
  }, [appointmentList, billingQueue]);

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden">
      <Header
        searchPlaceholder="Search patients..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex p-6 gap-5 min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col h-full overflow-hidden">

          {/* Subview Nav Tabs */}
          <div className="flex items-center gap-8 mb-4 text-sm font-semibold">
            <button
              onClick={() => setSubView('list')}
              className={`pb-1 border-b-2 transition-all ${
                subView === 'list'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Arrival
            </button>
            <button
              onClick={() => setSubView('register')}
              className={`pb-1 border-b-2 transition-all ${
                subView === 'register'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-400'
              }`}
            >
              New Registration
            </button>
            <button
              onClick={() => setSubView('checkout')}
              className={`pb-1 border-b-2 transition-all ${
                subView === 'checkout'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Billing Cashier
              {billingQueue.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                  {billingQueue.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 flex min-h-0">
            {subView === 'list' && (
              <AppointmentsTable
                appointments={activeAppointmentsList}
                onRefresh={fetchAppointments}
              />
            )}
            {subView === 'register' && (
              <NewPatientRegistration
                onCompleteRegistration={() => {
                  fetchBillingQueue();
                  setSubView('list');
                }}
              />
            )}
            {subView === 'checkout' && (
              <>
                <PatientCheckout
                  billingQueue={billingQueue}
                  selectedQueueId={selectedCheckoutQueueId}
                  onSelectQueueId={setSelectedCheckoutQueueId}
                  onPaymentComplete={() => {
                    fetchBillingQueue();
                    fetchAppointments();
                    setSelectedCheckoutQueueId('');
                  }}
                />
                <div className="pl-10 shrink-0">
                  <ReceptionSidePanel
                    setSubView={setSubView}
                    stats={financialMetrics}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDash;
