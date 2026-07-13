import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import AnalyticsMetrics from "../components/admin/AnalyticsMetrics";
import PatientVolumeChart from "../components/admin/PatientVolumeChart";
import WorkloadBreakdown from "../components/admin/WorkloadBreakdown";
import StaffOrchestrationTable from "../components/admin/StaffOrchestrationTable";
import Header from "../components/Header";
import { Calendar, FileText, Check, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import MonthlyProfitChart from "../components/admin/MonthlyFinanceChart";
import { getAdminAnalytics } from "../services/adminAnalyticsAPI";
import { getAllUsers } from "../services/userAPI";
import { getAllQueues } from "../services/queueAPI";
import { useSocket } from "../hooks/useSocket";
import { SOCKET_EVENTS } from "../sockets/socketEvents";
import { useAuth } from "../hooks/useAuth";

const TIMEFRAME_OPTIONS = ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "All Time"];

const getDateRange = (timeframe) => {
  if (timeframe === "All Time") return { startDate: undefined, endDate: undefined };

  const now = new Date();
  const start = new Date(now);

  if (timeframe === "Last 24 Hours") start.setHours(now.getHours() - 24);
  else if (timeframe === "Last 7 Days") start.setDate(now.getDate() - 7);
  else if (timeframe === "Last 30 Days") start.setDate(now.getDate() - 30);

  return { startDate: start.toISOString(), endDate: now.toISOString() };
};

function AdminDash() {
  const socket = useSocket();
  const { user } = useAuth();

  const [timeframe, setTimeframe] = useState("Last 24 Hours");
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [queues, setQueues] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Roles");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const timeframeRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await getAllUsers();
      const list = Array.isArray(res) ? res : res?.users ?? [];
      setUsers(list);
    } catch {
      setUsers([]);
    }
  }, []);

  const fetchQueues = useCallback(async () => {
    try {
      const res = await getAllQueues();
      setQueues(Array.isArray(res) ? res : []);
    } catch {
      setQueues([]);
    }
  }, []);

  const fetchAnalytics = useCallback(async (tf) => {
    const { startDate, endDate } = getDateRange(tf);
    const data = await getAdminAnalytics(startDate, endDate);
    setAnalytics(data);
  }, []);

  // Initial load 
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        await Promise.allSettled([
          fetchAnalytics(timeframe),
          fetchUsers(),
          fetchQueues(),
        ]);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
        setAnalyticsLoading(false);
      }
    };
    load();
  }, []); 

  // Re-fetch analytics when timeframe changes (optimistic) 
  useEffect(() => {
    if (!analytics) return;
    let cancelled = false;
    setAnalyticsLoading(true);
    const { startDate, endDate } = getDateRange(timeframe);
    getAdminAnalytics(startDate, endDate).then((data) => {
      if (!cancelled) {
        setAnalytics(data);
        setAnalyticsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setAnalyticsLoading(false);
    });
    return () => { cancelled = true; };
  }, [timeframe]); // eslint-disable-line react-hooks/exhaustive-deps

  // Socket: refresh queues 
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

  // Close timeframe dropdown on outside click 
  useEffect(() => {
    const handler = (e) => {
      if (timeframeRef.current && !timeframeRef.current.contains(e.target)) {
        setIsTimeframeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search 
  useEffect(() => {
    const h = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(h);
  }, [search]);

  // Derived data from analytics 
  const appointmentVolume = analytics?.appointmentVolume ?? {};
  const revenueTrend = analytics?.revenueTrend ?? {};
  const liveMetrics = analytics?.liveMetrics ?? {};
  const stageBreakdown = analytics?.stageBreakdown ?? [];
  const serviceBreakdown = analytics?.serviceBreakdown ?? [];

  const appointmentVolumeBins = useMemo(() => {
    const bins = Array(7).fill(0);
    const entries = Object.entries(appointmentVolume).sort(([a], [b]) => a.localeCompare(b));
    entries.slice(-7).forEach(([, count], i) => {
      bins[i] = count;
    });
    return bins;
  }, [appointmentVolume]);

  const revenueTrendData = useMemo(() => {
    return Object.entries(revenueTrend)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({ date, total }));
  }, [revenueTrend]);

  // Filtered staff list (client-side search)
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

  // PDF Export 
  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();

      doc.setFillColor(17, 24, 39);
      doc.rect(0, 0, 210, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text("MedFlow Admin Analytics Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Timeframe: ${timeframe}`, 14, 23);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 120, 23);

      autoTable(doc, {
        startY: 40,
        head: [["Metric", "Value"]],
        body: [
          ["Total Active Patients", liveMetrics.totalPatients ?? 0],
          ["Triage Backlog", liveMetrics.triageBacklog ?? 0],
          ["Active Consultations", liveMetrics.activeConsultations ?? 0],
          ["Critical Alerts", liveMetrics.criticalAlerts ?? 0],
          ["Pending Billing", liveMetrics.pendingBilling ?? 0],
          ["Total Revenue (Paid)", `$${Number(liveMetrics.totalRevenue ?? 0).toFixed(2)}`],
        ],
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [17, 24, 39], textColor: 255 },
      });

      const insightsY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Key Insights", 14, insightsY);
      doc.setFontSize(10);
      doc.setTextColor(80);
      const insights = [
        `• Active patients in system: ${liveMetrics.totalPatients ?? 0}`,
        `• Triage waiting: ${liveMetrics.triageBacklog ?? 0} patients`,
        `• Doctors currently consulting: ${liveMetrics.activeConsultations ?? 0}`,
        `• Critical priority cases: ${liveMetrics.criticalAlerts ?? 0}`,
        `• Revenue collected: $${Number(liveMetrics.totalRevenue ?? 0).toFixed(2)}`,
      ];
      insights.forEach((text, i) =>
        doc.text(text, 14, insightsY + 8 + i * 6)
      );

      const totalServices = serviceBreakdown.reduce((s, x) => s + x.count, 0);
      const serviceRows = serviceBreakdown.map((item) => {
        const avg = item.count > 0 ? item.revenue / item.count : 0;
        return [
          item.service,
          item.count,
          `$${item.revenue.toFixed(2)}`,
          `$${avg.toFixed(2)}`,
          totalServices > 0
            ? `${Math.round((item.count / totalServices) * 100)}%`
            : "0%",
        ];
      });

      autoTable(doc, {
        startY: insightsY + 40,
        head: [["Service", "Qty", "Revenue", "Avg Price", "Share"]],
        body: serviceRows.length > 0 ? serviceRows : [["No data", "-", "-", "-", "-"]],
        theme: "striped",
        headStyles: { fillColor: [20, 184, 166] },
      });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        "MedFlow Confidential • Generated automatically by Admin Analytics System",
        14,
        pageHeight - 10
      );

      doc.save(`medflow-report-${Date.now()}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  // Loading State (only on initial load)
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header
          searchPlaceholder="Search staff..."
          searchValue={search}
          onSearchChange={setSearch}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header
          searchPlaceholder="Search staff..."
          searchValue={search}
          onSearchChange={setSearch}
        />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error loading dashboard
          </h3>
          <p className="text-sm text-gray-600 text-center max-w-md mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header
        searchPlaceholder="Search staff..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 2xl:px-10 py-4 sm:py-5 lg:py-6 space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Admin Header Section */}
        <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Admin Analytics
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Real-time clinical performance and staff orchestration dashboard.
            </p>
          </div>

          {/* Controls - Responsive Layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Timeframe Dropdown */}
            <div className="relative flex-1 sm:flex-none" ref={timeframeRef}>
              <button
                onClick={() => setIsTimeframeOpen((p) => !p)}
                className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="flex-1 sm:flex-none text-left">{timeframe}</span>
                {analyticsLoading && (
                  <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                )}
              </button>

              {isTimeframeOpen && (
                <div className="absolute left-0 sm:right-0 mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                  {TIMEFRAME_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setTimeframe(opt);
                        setIsTimeframeOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      {opt}
                      {opt === timeframe && (
                        <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              {isExporting ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <section>
          <AnalyticsMetrics liveStats={liveMetrics} />
        </section>

        {/* Charts - Responsive Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          <div className="lg:col-span-2">
            <PatientVolumeChart dailyCounts={appointmentVolumeBins} total={Object.values(appointmentVolume).reduce((a, b) => a + b, 0)} />
          </div>
          <div className="lg:col-span-1">
            <MonthlyProfitChart revenueTrend={revenueTrendData} totalRevenue={liveMetrics.totalRevenue ?? 0} />
          </div>
        </section>

        {/* Queue Stage Workload */}
        <section className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-100">
            Live Queue Workload by Stage
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stageBreakdown.length > 0
              ? stageBreakdown.map(({ stage, count, pct }) => {
                  const stageColors = {
                    TRIAGE: { bar: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
                    DOCTOR: { bar: "bg-teal-500", text: "text-teal-700", bg: "bg-teal-50" },
                    PHARMACY: { bar: "bg-indigo-500", text: "text-indigo-700", bg: "bg-indigo-50" },
                    BILLING: { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
                  };
                  const c = stageColors[stage] ?? { bar: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50" };
                  return (
                    <div key={stage} className={`rounded-lg sm:rounded-xl p-3 sm:p-4 ${c.bg} border border-opacity-30`}>
                      <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-wide ${c.text}`}>{stage}</p>
                      <p className="text-xl sm:text-2xl font-black text-gray-900 mt-2">{count}</p>
                      <div className="w-full bg-white/60 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full ${c.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 font-medium">{pct}% of active queue</p>
                    </div>
                  );
                })
              : ["TRIAGE", "DOCTOR", "PHARMACY", "BILLING"].map((stage) => (
                  <div key={stage} className="rounded-lg sm:rounded-xl p-3 sm:p-4 bg-gray-50 border border-gray-100">
                    <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-gray-400">{stage}</p>
                    <p className="text-xl sm:text-2xl font-black text-gray-300 mt-2">0</p>
                    <div className="w-full bg-white h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gray-200 rounded-full" style={{ width: "0%" }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">0% of active queue</p>
                  </div>
                ))}
          </div>
        </section>

        {/* Staff Orchestration Table */}
        <section>
          <StaffOrchestrationTable
            selectedDept={selectedDept}
            onDeptChange={setSelectedDept}
            staffList={filteredStaff}
            loading={loading}
            fetchStaff={fetchUsers}
            setStaffList={setUsers}
            error={error}
            isSuperAdmin={user?.isSuperAdmin}
          />
        </section>
      </main>
    </div>
  );
}

export default AdminDash;
