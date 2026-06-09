// components/nurse/StationLogs.jsx
import React from 'react';
import { Clock3 } from 'lucide-react';

export default function StationLogs({ logs }) {
  return (
    <div className="shrink-0 rounded border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Station Logs</h4>
        <Clock3 className="h-3.5 w-3.5 text-gray-400" />
      </div>
      <ul className="space-y-1.5 text-[11px] leading-tight text-gray-600">
        {logs.map((log) => (
          <li key={log.id} className="flex gap-2">
            <span
              className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                log.tone === 'danger' ? 'bg-rose-500' : log.tone === 'success' ? 'bg-teal-600' : 'bg-sky-500'
              }`}
            />
            <span>
              <span className="font-mono font-bold text-gray-400">{log.time}:</span> {log.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}