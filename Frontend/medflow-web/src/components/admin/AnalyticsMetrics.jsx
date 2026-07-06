import React from 'react';
import { Users, Activity, ShieldAlert, Timer } from 'lucide-react';

function AnalyticsMetrics({ liveStats = {} }) {
  // Use fallback values to prevent undefined errors on initial load
  const metrics = [
    {
      label: 'Total Patients',
      value: liveStats.totalPatients || 0,
      change: 'Live Tracked',
      isPositive: true,
      icon: <Users className="w-5 h-5 text-gray-500" />,
      bgIcon: 'bg-gray-50',
      textColor: 'text-gray-500'
    },
    {
      label: 'Triage Backlog',
      value: liveStats.triageBacklog || 0,
      change: (liveStats.triageBacklog || 0) > 5 ? 'High Load' : 'Manageable',
      isPositive: (liveStats.triageBacklog || 0) <= 5,
      icon: <Timer className={`w-5 h-5 ${(liveStats.triageBacklog || 0) > 5 ? 'text-amber-600' : 'text-emerald-600'}`} />,
      bgIcon: (liveStats.triageBacklog || 0) > 5 ? 'bg-amber-50' : 'bg-emerald-50',
      textColor: (liveStats.triageBacklog || 0) > 5 ? 'text-amber-600' : 'text-emerald-600'
    },
    {
      label: 'Active Consults',
      value: liveStats.activeConsultations || 0,
      change: 'In Progress',
      isPositive: true,
      icon: <Activity className="w-5 h-5 text-teal-600" />,
      bgIcon: 'bg-teal-50',
      textColor: 'text-teal-600'
    },
    {
      label: 'Critical Alerts',
      value: liveStats.criticalAlerts || 0,
      change: (liveStats.criticalAlerts || 0) > 0 ? 'Action Required' : 'All Clear',
      isPositive: (liveStats.criticalAlerts || 0) === 0,
      icon: <ShieldAlert className={`w-5 h-5 ${(liveStats.criticalAlerts || 0) > 0 ? 'text-rose-600' : 'text-gray-400'}`} />,
      bgIcon: (liveStats.criticalAlerts || 0) > 0 ? 'bg-rose-50' : 'bg-gray-50',
      textColor: (liveStats.criticalAlerts || 0) > 0 ? 'text-rose-600' : 'text-gray-400'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((m, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">{m.label}</span>
              <span className="text-2xl font-bold text-gray-900 block mt-1.5">{m.value}</span>
            </div>
            <div className={`${m.bgIcon} p-2.5 rounded-lg`}>
              {m.icon}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className={`text-xs font-bold mt-2 ${m.textColor}`}>
              {m.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnalyticsMetrics;