// components/nurse/StationLogs.jsx
import React from 'react';
import { Clock } from 'lucide-react';

export default function StationLogs({ logs = [] }) {
  return (
    // Clean, responsive layout configuration mapping directly to your panel design constraints
    <div className="w-full h-[180px] max-h-[180px] flex flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm text-left overflow-hidden">
      {/* Header - Fixed top */}
      <div className="shrink-0 mb-2.5 flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Station Event Audit</h4>
        <Clock className="h-3.5 w-3.5 text-slate-400" />
      </div>
      
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
        {logs.length === 0 ? (
          <p className="text-[10px] text-slate-400 italic text-center pt-6">No events audited in this shift.</p>
        ) : (
          <ul className="space-y-2 text-[11px] font-medium text-slate-600">
            {logs.map((log) => (
              <li key={log.id} className="flex gap-2 items-start leading-normal">
                <span
                  className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                    log.tone === 'danger' ? 'bg-rose-500 animate-pulse' : log.tone === 'success' ? 'bg-teal-600' : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 min-w-0 break-words">
                  <span className="font-mono font-bold text-slate-400 mr-1.5">{log.time}</span> 
                  <span className="text-slate-700">{log.text}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}