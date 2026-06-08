import React from 'react';
import { Users, Activity, ShieldAlert, Timer } from 'lucide-react';

function AnalyticsMetrics() {
  const metrics = [
    {
      label: 'Total Patients',
      value: '12,482',
      change: '+4.2%',
      isPositive: true,
      icon: <Users className="w-5 h-5 text-gray-500" />,
      bgIcon: 'bg-gray-50',
    },
    {
      label: 'Daily Visits',
      value: '342',
      change: '+12%',
      isPositive: true,
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
      bgIcon: 'bg-emerald-50',
    },
    {
      label: 'Active Staff',
      value: '86',
      change: 'Active',
      isPositive: true,
      icon: <Users className="w-5 h-5 text-teal-600" />,
      bgIcon: 'bg-teal-50',
    },
    {
      label: 'Avg. Queue Time',
      value: '18 min',
      change: 'High Load',
      isPositive: false,
      icon: <Timer className="w-5 h-5 text-rose-600" />,
      bgIcon: 'bg-rose-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
            <span className={`text-xs font-bold mt-2 ${
              m.change === 'High Load' ? 'text-rose-600' : m.change === 'Active' ? 'text-teal-600' : 'text-emerald-600'
            }`}>
              {m.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnalyticsMetrics;