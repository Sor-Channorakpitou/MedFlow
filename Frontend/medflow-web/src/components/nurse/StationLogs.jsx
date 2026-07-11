import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function StationLogs({ logs = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    /* Floating action container anchored to the bottom right corner of the dashboard screen */
    <div 
      className={`fixed bottom-4 right-4 z-50 flex flex-col rounded-xl border bg-white shadow-xl transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'w-80 h-72 border-slate-300 p-4' 
          : 'w-48 h-10 border-slate-200 p-2 hover:border-teal-500 hover:shadow-md'
      }`}
    >
      {/* Clickable Header Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer select-none w-full h-full ${
          isOpen ? 'h-auto border-b border-slate-100 pb-2 mb-2' : ''
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Clock className={`h-3.5 w-3.5 shrink-0 ${isOpen ? 'text-teal-600' : 'text-slate-400'}`} />
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 truncate">
            {isOpen ? 'Station Event Audit' : 'Logs & History'}
          </h4>
          {logs.length > 0 && (
            <span className="rounded-full border border-teal-200 bg-teal-50 px-1.5 py-0.5 font-mono text-[9px] font-black text-teal-600 shrink-0">
              {logs.length}
            </span>
          )}
        </div>

        {/* Action Toggle Icon */}
        <span className="text-slate-400 hover:text-slate-600 p-0.5 transition-colors">
          {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </span>
      </div>
      
      {/* Hidden Scrollable Audit Feed Content */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto pr-1 mt-1 architecture-scroll min-h-0">
          {logs.length === 0 ? (
            <p className="text-[10px] text-slate-400 italic text-center pt-12">
              No events audited in this shift.
            </p>
          ) : (
            <ul className="space-y-2.5 text-[11px] font-medium text-slate-600">
              {logs.map((log) => (
                <li key={log.id} className="flex gap-2 items-start leading-normal animate-fadeIn">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                      log.tone === 'danger' 
                        ? 'bg-rose-500 animate-pulse' 
                        : log.tone === 'success' 
                          ? 'bg-teal-600' 
                          : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0 break-words">
                    <span className="font-mono font-bold text-slate-400 mr-1">{log.time}</span> 
                    <span className="text-slate-700">{log.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}