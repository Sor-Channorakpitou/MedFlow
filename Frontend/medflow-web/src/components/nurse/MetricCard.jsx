// components/nurse/MetricCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function MetricCard({ title, value, subtext, icon: Icon, iconBg, iconColor }: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm w-full">
      <div className={`p-3 rounded-lg ${iconBg} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</h3>
        {subtext && <span className="text-xs text-slate-400 font-medium">{subtext}</span>}
      </div>
    </div>
  );
}