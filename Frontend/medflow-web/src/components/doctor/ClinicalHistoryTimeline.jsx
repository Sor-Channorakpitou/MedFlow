
import { History, CheckCircle } from 'lucide-react';

function ClinicalHistoryTimeline({ history = [], activeMeds = [] }) {
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
            {history.map((ev, i) => {
              // Safe stable calculation identifier string key
              const uniqueEventKey = ev.id || ev.consultationId || `history-node-${i}`;
              return (
                <div key={uniqueEventKey} className="relative space-y-1 text-left">
                  <div className="absolute -left-[18.5px] top-1 w-2 h-2 rounded-full bg-gray-400 border border-white" />
                  <span className="text-[10px] text-gray-400 font-bold block">
                    {ev.visitDate ? new Date(ev.visitDate).toLocaleDateString() : ''}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 block">{ev.diagnosis}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed block">{ev.notes || ev.clinicalNotes}</p>
                </div>
              );
            })}
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
            {activeMeds.map((m, idx) => {
              // FIX: Generate a safe unique key combination to ensure rendering updates function smoothly
              const medicationKey = m.id || `med-row-${m.name}-${idx}`;
              
              return (
                <div key={medicationKey} className="border border-gray-150 rounded-lg p-2.5 flex justify-between items-center bg-white hover:border-gray-300 transition-colors">
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-gray-800">{m.name}</h4>

                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                      {m.dosage ? `${m.dosage}mg` : ''}
                      {m.frequency ? ` x${m.frequency}/day` : ''}
                      {m.duration ? ` for ${m.duration}` : ''}
                    </p>
                  </div>
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default ClinicalHistoryTimeline;