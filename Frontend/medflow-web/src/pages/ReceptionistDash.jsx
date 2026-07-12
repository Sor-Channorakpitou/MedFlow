import { useState, useMemo, useEffect, useCallback } from "react";
import AppointmentsTable from "../components/receptionist/AppointmentsTable";
import NewPatientRegistration from "../components/receptionist/NewPatientRegistration";
import PatientCheckout from "../components/receptionist/PatientCheckout";
import ReceptionSidePanel from "../components/receptionist/ReceptionSidePanel";
import Header from "../components/Header";
import { getAllAppointments } from "../services/appointmentAPI";
import { getAllQueues } from "../services/queueAPI";
import { useSocket } from "../hooks/useSocket";
import { SOCKET_EVENTS } from "../sockets/socketEvents";

function ReceptionistDash() {
  const socket = useSocket();

  const [appointmentList, setAppointmentList] = useState([]);
  const [billingQueue, setBillingQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subView, setSubView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCheckoutQueueId, setSelectedCheckoutQueueId] = useState("");

  // ─── Data fetchers ──────────────────────────────────────────────────────────
  const fetchAppointments = useCallback(async () => {
    try {
      const data = await getAllAppointments();
      setAppointmentList(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to load appointments");
    }
  }, []);

  const fetchBillingQueue = useCallback(async () => {
    try {
      const data = await getAllQueues();
      const queues = Array.isArray(data) ? data : [];
      setBillingQueue(
        queues.filter((q) => q.stage === "BILLING" && q.status === "WAITING"),
      );
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
        setError("Failed to load some dashboard data");
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
        patientName: app.patient?.fullName ?? "Unknown",
        doctor: app.user?.name ?? "Unassigned",
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
      .filter((apt) =>
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
  }, [appointmentList, searchQuery]);

  const financialMetrics = useMemo(() => {
    const latestTransaction = [...appointmentList]
      .filter((a) => a.invoice?.paymentStatus === "PAID")
      .sort(
        (a, b) =>
          new Date(b.invoice?.issuedDate || b.appointmentDate) -
          new Date(a.invoice?.issuedDate || a.appointmentDate),
      )[0];

    const total = appointmentList
      .filter(
        (a) =>
          isToday(a.appointmentDate) && a.invoice?.paymentStatus === "PAID",
      )
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

  // ─── Tabs Configuration ──────────────────────────────────────────────────────
  const tabs = [
    {
      id: "list",
      label: "Arrival",
      badge: null,
    },
    {
      id: "register",
      label: "New Registration",
      badge: null,
    },
    {
      id: "checkout",
      label: "Billing Cashier",
      badge: billingQueue.length > 0 ? billingQueue.length : null,
    },
    {
      id: "billingReport",
      label: "Billing Report",
      badge: null,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header
          searchPlaceholder="Search patients..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header
          searchPlaceholder="Search patients..."
          searchValue={searchQuery}
          onSearchChange={setSearchChange}
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <span className="text-xl text-red-600">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to load dashboard
            </h3>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <Header
        searchPlaceholder="Search patients..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 2xl:px-10">
            <div className="flex items-center gap-1 sm:gap-2 -mb-px overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSubView(tab.id)}
                  className={`
                    px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap
                    border-b-2 transition-all duration-200 flex items-center gap-2
                    ${
                      subView === tab.id
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }
                  `}
                >
                  {tab.label}
                  {tab.badge !== null && (
                    <span className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-red-600 text-white text-xs font-bold leading-none">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 flex min-h-0 overflow-auto">
            {/* Arrival List View */}
            {subView === "list" && (
              <div className="w-full">
                <AppointmentsTable
                  appointments={activeAppointmentsList}
                  onRefresh={fetchAppointments}
                />
              </div>
            )}

            {/* New Patient Registration View */}
            {subView === "register" && (
              <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-10 py-6 sm:py-8">
                <NewPatientRegistration
                  onCompleteRegistration={() => {
                    fetchBillingQueue();
                    setSubView("list");
                  }}
                />
              </div>
            )}

            {/* Billing Checkout View */}
            {subView === "checkout" && (
              <div className="w-full">
                <PatientCheckout
                  billingQueue={billingQueue}
                  selectedQueueId={selectedCheckoutQueueId}
                  onSelectQueueId={setSelectedCheckoutQueueId}
                  onPaymentComplete={() => {
                    fetchBillingQueue();
                    fetchAppointments();
                    setSelectedCheckoutQueueId("");
                  }}
                />
              </div>
            )}

            {/* Billing Report View */}
            {subView === "billingReport" && (
              <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-10 py-6 sm:py-8">
                <ReceptionSidePanel
                  pendingInvoices={financialMetrics.pendingInvoices}
                  collectionsToday={financialMetrics.collectionsToday}
                  transactions={financialMetrics.transactions}
                  setSubView={setSubView}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDash;