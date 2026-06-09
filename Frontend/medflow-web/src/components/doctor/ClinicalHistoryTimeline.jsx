// src/components/doctor/ClinicalHistoryTimeline.jsx
import React from 'react';
import { History, CheckCircle } from 'lucide-react';

function ClinicalHistoryTimeline({ history, activeMeds }) {
  return (
    <div className="space-y-3 h-full text-left">
      
      {/* Dynamic Patient History Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-left flex flex-col">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
          <History className="w-4 h-4 text-gray-400" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Patient History</h3>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 italic font-medium">No previous electronic health events logged.</p>
        ) : (
          <div className="space-y-5 relative before:absolute before:bottom-2 before:top-2 before:left-1.5 before:w-0.5 before:bg-gray-100 pl-5 max-h-[35vh] overflow-y-auto">
            {history.map((ev, i) => (
              <div key={i} className="relative space-y-1 text-left">
                <div className="absolute -left-[18.5px] top-1 w-2 h-2 rounded-full bg-gray-400 border border-white" />
                <span className="text-[10px] text-gray-400 font-bold block">{ev.date}</span>
                <h4 className="text-xs font-bold text-gray-900 block">{ev.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed block">{ev.desc}</p>
                
                {ev.tags && (
                  <div className="flex gap-1 pt-1">
                    {ev.tags.map((t, idx) => (
                      <span key={idx} className={`text-[8px] font-black px-1 py-0.5 rounded tracking-wide ${
                        t === 'CHRONIC' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'
                      }`}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Active Medications Sub-Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-left">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
          Active Medications
        </h3>
        
        {activeMeds.length === 0 ? (
          <p className="text-xs text-gray-400 py-2 italic font-medium">No active prescription vectors baseline.</p>
        ) : (
          <div className="space-y-2 max-h-[25vh] overflow-y-auto">
            {activeMeds.map((m) => (
              <div key={m.id} className="border border-gray-150 rounded-lg p-2.5 flex justify-between items-center bg-white hover:border-gray-300 transition-colors">
                <div className="text-left">
                  <h4 className="text-xs font-bold text-gray-800">{m.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{m.dosage} | {m.frequency}</p>
                </div>
                <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default ClinicalHistoryTimeline;