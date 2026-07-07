// pages/AdminDash.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
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

const TIMEFRAME_OPTIONS = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'All Time'];

const getAppointmentDate = (appointment) => {
  return appointment.createdAt ? new Date(appointment.createdAt) : null;
};

function AdminDash() {

  const [timeframe, setTimeframe] = useState('Last 24 Hours');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Roles');
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [users, setUsers] = useState([]);

  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const timeframeRef = useRef(null);

  const fetchInvoice = async () => {
    const res = await getAllInvoices();
    setInvoices(res);
  };

  const fetchAppointment = async () => {
    const res = await getAllAppointments();
    setAppointments(res);
  };

  const fetchUsers = async () => {
    const res = await getAllUsers();
    setUsers(res);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const results = await Promise.allSettled([
          fetchInvoice(),
          fetchAppointment(),
          fetchUsers(),
        ]);

        results.forEach((result, index) => {
          if (result.status === "rejected") {
            console.error(`Request ${index} failed:`, result.reason);
          }
        });

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Close the timeframe dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (timeframeRef.current && !timeframeRef.current.contains(e.target)) {
        setIsTimeframeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // TIMEFRAME FILTER
  const filteredAppointments = useMemo(() => {
    if (timeframe === 'All Time') return appointments;

    const now = new Date();
    const cutoff = new Date(now);

    if (timeframe === 'Last 24 Hours') cutoff.setHours(now.getHours() - 24);
    else if (timeframe === 'Last 7 Days') cutoff.setDate(now.getDate() - 7);
    else if (timeframe === 'Last 30 Days') cutoff.setDate(now.getDate() - 30);

    return appointments.filter((app) => {
      const apptDate = getAppointmentDate(app);
      return apptDate ? apptDate >= cutoff : true;
    });
  }, [appointments, timeframe]);

  const liveMetrics = useMemo(() => {
    const totalCount = filteredAppointments.length;
    const criticalCount = filteredAppointments.filter(app => app.urgencyLevel === 'CRITICAL').length;
    const waitingTriage = filteredAppointments.filter(app => app.status === 'PENDING').length;
    const withDoctor = filteredAppointments.filter(app => app.status === 'CONFIRMED').length;
    const sum = [...invoices].filter(i => new Date(i.issuedDate) >= new Date()).reduce((acc, num) => acc + num.totalAmount, 0);

    return {
      totalPatients: totalCount,
      criticalAlerts: criticalCount,
      triageBacklog: waitingTriage,
      activeConsultations: withDoctor,
      totalRevenue: sum
    };

  }, [filteredAppointments]);

  // grouped by the assigned staff member's role,
  const departmentCounts = useMemo(() => {
    const counts = {};
    filteredAppointments.forEach((app) => {
      const dept = app.user?.role || 'Unassigned';
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return counts;
  }, [filteredAppointments]);

  const filteredStaff = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    console.log(keyword);

    if (!keyword) return users;

    return users.filter(user => 
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.role.name.toLowerCase().includes(keyword)
    );
  }, [users, debouncedSearch]);


  // PDF export
  const handleExportPDF = () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF();

      // HEADER
      doc.setFillColor(17, 24, 39);
      doc.rect(0, 0, 210, 30, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text("MedFlow Admin Analytics Report", 14, 15);

      doc.setFontSize(10);
      doc.text(`Timeframe: ${timeframe}`, 14, 23);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 120, 23);

      // KPI SECTION
      autoTable(doc, {
        startY: 40,
        head: [["Metric", "Value"]],
        body: [
          ["Total Patients", liveMetrics.totalPatients],
          ["Triage Backlog", liveMetrics.triageBacklog],
          ["Active Consultations", liveMetrics.activeConsultations],
          ["Critical Alerts", liveMetrics.criticalAlerts],
          ["Total Revenue", `$${liveMetrics.totalRevenue || 0}`],
        ],
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [17, 24, 39],
          textColor: 255,
        },
      });

      // INSIGHTS 
      const insightsY = doc.lastAutoTable.finalY + 10;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Key Insights", 14, insightsY);

      doc.setFontSize(10);
      doc.setTextColor(80);

      const insights = [
        `• Total patient load: ${liveMetrics.totalPatients} patients`,
        `• Critical attention cases: ${liveMetrics.criticalAlerts}`,
        `• Active consultations running smoothly`,
        `• Revenue performance: $${liveMetrics.totalRevenue || 0}`,
      ];

      insights.forEach((text, i) => {
        doc.text(text, 14, insightsY + 8 + i * 6);
      });

      // SERVICE ANALYTICS TABLE
      const serviceMap = {};
      console.log(invoices);

      invoices.forEach((invoice) => {
        invoice.invoiceItem.forEach((item) => {
          const name = item.description || "Unknown Service";
          const price = Number(item.unitPrice) || 0;


          if (!serviceMap[name]) {
            serviceMap[name] = {
              count: 0,
              revenue: 0,
            };
          }

          serviceMap[name].count += 1;
          serviceMap[name].revenue += price;
        });
      });

      const totalServices = Object.values(serviceMap).reduce(
        (sum, s) => sum + s.count,
        0
      );

      const serviceRows = Object.entries(serviceMap).map(([service, data]) => {
        const avg = data.count > 0 ? data.revenue / data.count : 0;

        return [
          service,
          data.count,
          `$${data.revenue.toFixed(2)}`,
          `$${avg.toFixed(2)}`,
          totalServices > 0
            ? `${Math.round((data.count / totalServices) * 100)}%`
            : "0%",
        ];
      });

      autoTable(doc, {
        startY: insightsY + 40,
        head: [["Service", "Qty", "Revenue", "Avg Price", "Share"]],
        body: serviceRows.length > 0 ? serviceRows : [["No data", "-", "-", "-", "-"]],
        theme: "striped",
        headStyles: {
          fillColor: [20, 184, 166],
        },
      });

      // FOOTER
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

  return (
  <div className="flex h-full flex-1 min-w-0 flex-col bg-[#f4f6f8] text-left text-gray-900 overflow-y-auto">
      <Header 
        searchPlaceholder='Search staff...'
        searchValue={search}
        onSearchChange={setSearch}
      />
      {/* Container wrapper adjusting consistent spacing layout defaults */}
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* 1. Admin Header Panel */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Admin Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time clinical performance and staff orchestration dashboard.
            </p>
          </div>

          {/* Workspace controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="relative" ref={timeframeRef}>
              <button
                onClick={() => setIsTimeframeOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                {timeframe}
              </button>

              {isTimeframeOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                  {TIMEFRAME_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setTimeframe(option);
                        setIsTimeframeOpen(false);
                      }}
                      className="w-full flex items-center justify-between text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {option}
                      {option === timeframe && <Check className="w-4 h-4 text-gray-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleExportPDF}
              disabled={isExporting || loading}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium tracking-wide shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              {isExporting ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
            Loading appointments...
          </div>
        ) : (
          <>
            {/* 2. Top Analytics Metrics Grid */}
            <AnalyticsMetrics liveStats={liveMetrics} />

            {/* 3. Core Graphical Mid-Section Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PatientVolumeChart appointments={filteredAppointments} />
              </div>
              <div>
                {/* <WorkloadBreakdown appointments={filteredAppointments} /> */}
                <MonthlyProfitChart invoices={invoices} />
              </div>
            </div>

            {/* 4. Staff Orchestration Management Data Grid */}
            <StaffOrchestrationTable 
              selectedDept={selectedDept} 
              onDeptChange={setSelectedDept} 
              appointments={filteredAppointments}
              staffList={filteredStaff}
              loading={loading}
              fetchStaff={fetchUsers}
              setStaffList={setUsers}
              error={error}
            />
          </>
        )}
        
      </main>
    </div>
  );
}


export default AdminDash;
