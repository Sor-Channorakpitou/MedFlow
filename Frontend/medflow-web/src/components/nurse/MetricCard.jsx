// components/nurse/MetricCard.jsx
import React from 'react';

export default function MetricCard({ label, value, icon: Icon, iconBgColor, iconColor }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-left">
      <div className={`rounded-lg p-2.5 ${iconBgColor} ${iconColor} border border-current/10`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`mt-0.5 text-lg font-black font-mono tracking-tight ${iconColor === 'text-rose-600' ? 'text-rose-600' : 'text-slate-900'}`}>
          {value}
        </p>
      </div>
    </div>
  );
} 