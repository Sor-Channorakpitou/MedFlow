import React from 'react';
import { ClipboardList, Activity } from 'lucide-react';

function SymptomsAndActions({ symptoms, onToggle }) {
  const diagnosticActions = [
    { id: 'a1', text: 'Order EKG/ECG' },
    { id: 'a2', text: 'Comprehensive Metabolic Panel' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-left flex flex-col justify-between space-y-3">
      
      {/* Symptoms Box */}
      <div>
        <div className="flex items-center gap-2 border-b border-gray-50 pb-2.5 mb-3">
          <ClipboardList className="w-4 h-4 text-gray-400" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Symptoms Checklist</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {symptoms.map((s) => (
            <div 
              key={s.id} 
              onClick={() => onToggle(s.id)}
              className="flex items-center gap-2 bg-gray-50/50 border border-gray-150 rounded-lg p-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input 
                type="checkbox" 
                checked={s.checked} 
                readOnly
                className="w-3.5 h-3.5 rounded accent-teal-700 pointer-events-none"
              />
              <span className="text-xs font-semibold text-gray-700 select-none">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions Execution Box */}
      <div>
        <div className="flex items-center gap-2 border-b border-gray-50 pb-2.5 mb-3">
          <Activity className="w-4 h-4 text-gray-400" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Treatment Actions</h3>
        </div>
        <div className="space-y-2">
          {diagnosticActions.map((act) => (
            <div key={act.id} className="border border-gray-200 rounded-lg p-2.5 flex justify-between items-center bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-gray-300 transition-all">
              <span className="text-xs font-medium text-gray-700">📋 {act.text}</span>
              <button className="text-[10px] font-black text-teal-700 tracking-wider hover:text-teal-900 uppercase">
                ADD
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default SymptomsAndActions;