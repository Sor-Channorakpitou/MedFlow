import React, { useState } from 'react';
import AnalyticsMetrics from '../components/admin/AnalyticsMetrics';
import PatientVolumeChart from '../components/admin/PatientVolumeChart';
import WorkloadBreakdown from '../components/admin/WorkloadBreakdown';
import StaffOrchestrationTable from '../components/admin/StaffOrchestrationTable'; 
import Header from '../components/Header';

import { Calendar, FileText } from 'lucide-react';

function AdminDash() {
  // System State 1: Mock operational time-filters matching production needs
  const [timeframe, setTimeframe] = useState('Last 24 Hours');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  // Centralized submission logic for reporting engines
  const handleExportPDF = () => {
    console.log('Generating production analytical summary manifest... target context:', timeframe);
    alert('Generating PDF Report Download...');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 text-left">
      <Header/>
      
      {/* 1. Admin Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time clinical performance and staff orchestration dashboard.
          </p>
        </div>
        
        {/* Workspace controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all">
            <Calendar className="w-4 h-4 text-gray-400" />
            {timeframe}
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium tracking-wide shadow-sm transition-all"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* 2. Top Analytics Metrics Grid */}
      <AnalyticsMetrics />

      {/* 3. Core Graphical Mid-Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatientVolumeChart />
        </div>
        <div>
          <WorkloadBreakdown />
        </div>
      </div>

      {/* 4. Staff Orchestration Management Data Grid */}
      <StaffOrchestrationTable 
        selectedDept={selectedDept} 
        onDeptChange={setSelectedDept} 
      />

    </div>
  );
}

export default AdminDash;