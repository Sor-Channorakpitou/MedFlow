// components/nurse/StationLogs.tsx
import React from 'react';
import { History } from 'lucide-react';

const logs = [
  { time: '09:12 AM', text: 'Patient Santos, C. moved to Dr. Aris [Room 4]', color: 'bg-emerald-500' },
  { time: '09:05 AM', text: 'Triage alert: Critical vitals for Marcus, E.', color: 'bg-red-500' },
  { time: '08:58 AM', text: 'Patient Lee, K. discharged by Dr. Aris', color: 'bg-blue-500' },
];

export default function StationLogs() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" /> Station Logs
        </h4>
      </div>
      <div className="space-y-3">
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-3 text-xs">
            <span className="font-bold text-slate-500 shrink-0 mt-0.5">{log.time}:</span>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${log.color} shrink-0`} />
              <p className="text-slate-700 font-medium">{log.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}