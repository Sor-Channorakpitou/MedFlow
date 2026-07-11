// pages/AdminDash.jsx
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import AnalyticsMetrics from '../components/admin/AnalyticsMetrics';
import PatientVolumeChart from '../components/admin/PatientVolumeChart';
import WorkloadBreakdown from '../components/admin/WorkloadBreakdown';
import StaffOrchestrationTable from '../components/admin/StaffOrchestrationTable';
import Header from '../components/Header';
import { Calendar, FileText, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import MonthlyProfitChart from '../components/admin/MonthlyFinanceChart';
import { getAllInvoices } from '../services/billingAPI';
import { getAllAppointments } from '../services/appointmentAPI';
import { getAllUsers } from '../services/userAPI';
import { getAllQueues } from '../services/queueAPI';
import { useSocket } from '../hooks/useSocket';
import { SOCKET_EVENTS } from '../sockets/socketEvents';
import { useAuth } from '../hooks/useAuth';

const TIMEFRAME_OPTIONS = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'All Time'];

const getAppointmentDate = (appointment) =>
  appointment.createdAt ? new Date(appointment.createdAt) : null;

function AdminDash() {
  const socket = useSocket();
  const { user } = useAuth();

  const [timeframe, setTimeframe] = useState('Last 24 Hours');
  const [invoices, setInvoices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Roles');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const timeframeRef = useRef(null);

  // ─── Data fetchers ────────────────────────────────────────────────────────
  const fetchInvoices = useCallback(async () => {
    try {
      const res = await getAllInvoices();
      setInvoices(Array.isArray(res) ? res : []);
    } catch { setInvoices([]); }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await getAllAppointments();
      setAppointments(Array.isArray(res) ? res : []);
    } catch { setAppointments([]); }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUsers();
      setUsers(Array.isArray(res) ? res : []);
    } catch { setUsers([]); }
  }, []);

  const fetchQueues = useCallback(async () => {
    try {
      const res = await getAllQueues();
      setQueues(Array.isArray(res) ? res : []);
    } catch { setQueues([]); }
  }, []);

  // ─── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        await Promise.allSettled([
          fetchInvoices(),
          fetchAppointments(),
          fetchUsers(),
          fetchQueues(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchInvoices, fetchAppointments, fetchUsers, fetchQueues]);

  // ─── Socket: refresh queues on any queue-related event ──────────────────
  useEffect(() => {
    if (!socket) return;
    const refresh = () => fetchQueues();
    socket.on(SOCKET_EVENTS.QUEUE_UPDATED, refresh);
    socket.on(SOCKET_EVENTS.PATIENT_MOVED_STAGE, refresh);
    socket.on(SOCKET_EVENTS.PATIENT_TRIAGED, refresh);
    socket.on(SOCKET_EVENTS.MEDICATION_DISPENSED, refresh);
    socket.on(SOCKET_EVENTS.PATIENT_REGISTERED, refresh);
    return () => {
      socket.off(SOCKET_EVENTS.QUEUE_UPDATED, refresh);
      socket.off(SOCKET_EVENTS.PATIENT_MOVED_STAGE, refresh);
      socket.off(SOCKET_EVENTS.PATIENT_TRIAGED, refresh);
      socket.off(SOCKET_EVENTS.MEDICATION_DISPENSED, refresh);
      socket.off(SOCKET_EVENTS.PATIENT_REGISTERED, refresh);
    };
  }, [socket, fetchQueues]);

  // ─── Close timeframe dropdown on outside click ──────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (timeframeRef.current && !timeframeRef.current.contains(e.target)) {
        setIsTimeframeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── Debounced search ────────────────────────────────────────────────────
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(h);
  }, [search]);

  // ─── Timeframe filter on appointments ───────────────────────────────────
  const filteredAppointments = useMemo(() => {
    if (timeframe === 'All Time') return appointments;
    const now = new Date();
    const cutoff = new Date(now);
    if (timeframe === 'Last 24 Hours') cutoff.setHours(now.getHours() - 24);
    else if (timeframe === 'Last 7 Days') cutoff.setDate(now.getDate() - 7);
    else if (timeframe === 'Last 30 Days') cutoff.setDate(now.getDate() - 30);
    return appointments.filter((app) => {
      const d = getAppointmentDate(app);
      return d ? d >= cutoff : true;
    });
  }, [appointments, timeframe]);

  // ─── Live metrics: derived from real queue data ──────────────────────────
  const liveMetrics = useMemo(() => {
    // Active (non-completed, non-cancelled) queue entries
    const activeQueues = queues.filter(
      (q) => q.status !== 'COMPLETED' && q.status !== 'CANCELLED'
    );

    // Unique patients in the system right now
    const totalPatients = new Set(activeQueues.map((q) => q.patientId)).size;

    // Triage backlog: waiting at TRIAGE
    const triageBacklog = activeQueues.filter(
      (q) => q.stage === 'TRIAGE' && q.status === 'WAITING'
    ).length;

    // Active consultations: DOCTOR/PROCESSING
    const activeConsultations = activeQueues.filter(
      (q) => q.stage === 'DOCTOR' && q.status === 'PROCESSING'
    ).length;

    // Critical alerts: triage urgency CRITICAL from appointment.triage
    // The queue includes appointment.triage.urgencyLevel via the API include
    const criticalAlerts = activeQueues.filter(
      (q) => q.appointment?.triage?.urgencyLevel === 'CRITICAL'
    ).length;

    // Revenue: sum all paid invoices (no timeframe restriction — financial total)
    const totalRevenue = invoices
      .filter((i) => i.paymentStatus === 'PAID')
      .reduce((sum, i) => sum + Number(i.totalAmount ?? 0), 0)
      .toFixed(2);

    // Pending billing
    const pendingBilling = activeQueues.filter((q) => q.stage === 'BILLING').length;

    return {
      totalPatients,
      triageBacklog,
      activeConsultations,
      criticalAlerts,
      totalRevenue: Number(totalRevenue),
      pendingBilling,
    };
  }, [queues, invoices]);

  // ─── Workload by stage (live queue breakdown) ────────────────────────────
  const stageBreakdown = useMemo(() => {
    const active = queues.filter(
      (q) => q.status !== 'COMPLETED' && q.status !== 'CANCELLED'
    );
    const total = active.length || 1;

    const stages = ['TRIAGE', 'DOCTOR', 'PHARMACY', 'BILLING'];
    return stages.map((stage) => {
      const count = active.filter((q) => q.stage === stage).length;
      return { stage, count, pct: Math.round((count / total) * 100) };
    });
  }, [queues]);

  // ─── Filtered staff list ─────────────────────────────────────────────────
  const filteredStaff = useMemo(() => {
    const keyword = debouncedSearch.toLowerCase().trim();
    if (!keyword) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword) ||
        u.role?.name?.toLowerCase().includes(keyword)
    );
  }, [users, debouncedSearch]);

  // ─── PDF Export ──────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();

      doc.setFillColor(17, 24, 39);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('MedFlow Admin Analytics Report', 14, 15);
      doc.setFontSize(10);
      doc.text(`Timeframe: ${timeframe}`, 14, 23);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 120, 23);

      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Value']],
        body: [
          ['Total Active Patients', liveMetrics.totalPatients],
          ['Triage Backlog', liveMetrics.triageBacklog],
          ['Active Consultations', liveMetrics.activeConsultations],
          ['Critical Alerts', liveMetrics.criticalAlerts],
          ['Pending Billing', liveMetrics.pendingBilling],
          ['Total Revenue (Paid)', `$${liveMetrics.totalRevenue}`],
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [17, 24, 39], textColor: 255 },
      });

      const insightsY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Key Insights', 14, insightsY);
      doc.setFontSize(10);
      doc.setTextColor(80);
      const insights = [
        `• Active patients in system: ${liveMetrics.totalPatients}`,
        `• Triage waiting: ${liveMetrics.triageBacklog} patients`,
        `• Doctors currently consulting: ${liveMetrics.activeConsultations}`,
        `• Critical priority cases: ${liveMetrics.criticalAlerts}`,
        `• Revenue collected: $${liveMetrics.totalRevenue}`,
      ];
      insights.forEach((text, i) => doc.text(text, 14, insightsY + 8 + i * 6));

      const serviceMap = {};
      invoices.forEach((invoice) => {
        (invoice.invoiceItem ?? []).forEach((item) => {
          const name = item.description || 'Unknown Service';
          if (!serviceMap[name]) serviceMap[name] = { count: 0, revenue: 0 };
          serviceMap[name].count += 1;
          serviceMap[name].revenue += Number(item.unitPrice) || 0;
        });
      });

      const totalServices = Object.values(serviceMap).reduce((s, x) => s + x.count, 0);
      const serviceRows = Object.entries(serviceMap).map(([service, data]) => {
        const avg = data.count > 0 ? data.revenue / data.count : 0;
        return [
          service,
          data.count,
          `$${data.revenue.toFixed(2)}`,
          `$${avg.toFixed(2)}`,
          totalServices > 0 ? `${Math.round((data.count / totalServices) * 100)}%` : '0%',
        ];
      });

      autoTable(doc, {
        startY: insightsY + 40,
        head: [['Service', 'Qty', 'Revenue', 'Avg Price', 'Share']],
        body: serviceRows.length > 0 ? serviceRows : [['No data', '-', '-', '-', '-']],
        theme: 'striped',
        headStyles: { fillColor: [20, 184, 166] },
      });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('MedFlow Confidential • Generated automatically by Admin Analytics System', 14, pageHeight - 10);

      doc.save(`medflow-report-${Date.now()}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-full flex-1 min-w-0 flex-col bg-[#f4f6f8] text-left text-gray-900 overflow-y-auto">
      <Header
        searchPlaceholder="Search staff..."
        searchValue={search}
        onSearchChange={setSearch}
      />
      <main className="flex-1 p-4 md:p-6 space-y-6">

        {/* 1. Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time clinical performance and staff orchestration dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Timeframe */}
            <div className="relative" ref={timeframeRef}>
              <button
                onClick={() => setIsTimeframeOpen((p) => !p)}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                {timeframe}
              </button>
              {isTimeframeOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {TIMEFRAME_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setTimeframe(opt); setIsTimeframeOpen(false); }}
                      className="w-full flex items-center justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {opt}
                      {opt === timeframe && <Check className="w-4 h-4 text-gray-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleExportPDF}
              disabled={isExporting || loading}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              {isExporting ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
            Loading dashboard data...
          </div>
        ) : (
          <>
            {/* 2. Live Metrics Grid */}
            <AnalyticsMetrics liveStats={liveMetrics} />

            {/* 3. Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PatientVolumeChart appointments={filteredAppointments} />
              </div>
              <div>
                <MonthlyProfitChart invoices={invoices} />
              </div>
            </div>

            {/* 4. Queue Stage Workload */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                Live Queue Workload by Stage
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stageBreakdown.map(({ stage, count, pct }) => {
                  const stageColors = {
                    TRIAGE:   { bar: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50'  },
                    DOCTOR:   { bar: 'bg-teal-500',   text: 'text-teal-700',   bg: 'bg-teal-50'   },
                    PHARMACY: { bar: 'bg-indigo-500', text: 'text-indigo-700', bg: 'bg-indigo-50' },
                    BILLING:  { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
                  };
                  const c = stageColors[stage] ?? { bar: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' };
                  return (
                    <div key={stage} className={`rounded-xl p-4 ${c.bg} border border-opacity-30`}>
                      <p className={`text-[11px] font-bold uppercase tracking-wider ${c.text}`}>{stage}</p>
                      <p className="text-2xl font-black text-gray-900 mt-1">{count}</p>
                      <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full ${c.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 font-medium">{pct}% of active queue</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Staff Orchestration */}
            <StaffOrchestrationTable
              selectedDept={selectedDept}
              onDeptChange={setSelectedDept}
              appointments={filteredAppointments}
              staffList={filteredStaff}
              loading={loading}
              fetchStaff={fetchUsers}
              setStaffList={setUsers}
              error={error}
              isSuperAdmin={user?.isSuperAdmin}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDash;
