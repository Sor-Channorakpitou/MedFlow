
import React from 'react';

export default function MetricCard({ label, value, icon: Icon, iconBgColor, iconColor }) {
  return (
    <div className="flex items-center gap-4 rounded border border-gray-200 bg-white p-4 shadow-sm">
      <div className={`rounded p-2.5 ${iconBgColor} ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className={`mt-0.5 text-xl font-black ${iconColor === 'text-rose-600' ? 'text-rose-600' : 'text-gray-900'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}