import React from 'react';
import { FileText } from 'lucide-react';

function PendingFulfillmentList({ patients, selectedId, onSelect }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3.5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900">Pending Fulfillment</h3>
        <span className="text-xs bg-gray-200 font-semibold px-2 py-0.5 rounded text-gray-600">
          {patients.length} Awaiting
        </span>
      </div>

      <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
        {patients.map((p) => {
          const isSelected = p.id === selectedId;
          return (
            <div
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`p-4 text-left cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-white border-l-4 border-teal-700 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]' 
                  : 'hover:bg-gray-50/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{p.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    <span>{p.medCount} Medications</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">⚕️ {p.prescriber}</p>
                  <p className="text-[11px] text-gray-400"> Prescribed: {p.prescribedTime}</p>
                </div>

                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  p.isUrgent 
                    ? 'bg-rose-100 text-rose-700 font-extrabold' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {p.waitTime}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PendingFulfillmentList;