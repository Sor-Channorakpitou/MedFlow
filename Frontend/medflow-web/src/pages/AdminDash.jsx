// pages/AdminDash.jsx
import React, { useState, useMemo } from "react";
import AnalyticsMetrics from "../components/admin/AnalyticsMetrics";
import PatientVolumeChart from "../components/admin/PatientVolumeChart";
import WorkloadBreakdown from "../components/admin/WorkloadBreakdown";
import StaffOrchestrationTable from "../components/admin/StaffOrchestrationTable";
import Header from "../components/Header";

// Import your custom workflow tracking engine context
import { useWorkflow } from "../hooks/useWorkflow"; // Updated import path to match your project structure
import { Calendar, FileText } from "lucide-react";

function AdminDash() {
  // 1. Pull the live global tracking arrays
  const { appointments = [], patients = [] } = useWorkflow();

  const [timeframe, setTimeframe] = useState("Last 24 Hours");
  const [selectedDept, setSelectedDept] = useState("All Departments");

  // ==========================================================================
  // METRICS PIPELINE: Calculate live real-time clinical statistics
  // ==========================================================================
  const liveMetrics = useMemo(() => {
    const safeAppointments = Array.isArray(appointments) ? appointments : [];

    const totalCount = safeAppointments.length;
    const criticalCount = safeAppointments.filter(
      (app) => app.urgency_level === "CRITICAL",
    ).length;
    const waitingTriage = safeAppointments.filter(
      (app) => app.workflow_step === "AWAITING_TRIAGE",
    ).length;
    const withDoctor = safeAppointments.filter(
      (app) => app.workflow_step === "AWAITING_CONSULTATION",
    ).length;

    return {
      totalPatients: totalCount,
      criticalAlerts: criticalCount,
      triageBacklog: waitingTriage,
      activeConsultations: withDoctor,
    };
  }, [appointments]);

  const handleExportPDF = () => {
    console.log(
      "Generating production analytical summary manifest... target context:",
      timeframe,
    );
    alert("Generating PDF Report Download...");
  };

  return (
    <div className="flex h-full flex-1 min-w-0 flex-col bg-[#f4f6f8] text-left text-gray-900 overflow-y-auto">
      <Header />

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
          <div className="flex items-center gap-3">
            {/* Buttons remain row-aligned on all screen sizes */}
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs md:text-sm font-medium">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="hidden sm:inline">{timeframe}</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg text-xs md:text-sm font-medium"
            >
              <FileText className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* 2. Top Analytics Metrics Grid */}

        <div >
          <AnalyticsMetrics liveStats={liveMetrics} />
        </div>

        {/* 3. Core Graphical Mid-Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 min-h-[300px]">
            <PatientVolumeChart appointments={appointments} />
          </div>
          <div className="min-h-[300px]">
            <WorkloadBreakdown appointments={appointments} />
          </div>
        </div>

        {/* 4. Staff Orchestration Management Data Grid */}
        <div className="w-full overflow-x-auto">
          <StaffOrchestrationTable
            selectedDept={selectedDept}
            onDeptChange={setSelectedDept}
            appointments={appointments}
          />
        </div>
      </main>
    </div>
  );
}

export default AdminDash;
