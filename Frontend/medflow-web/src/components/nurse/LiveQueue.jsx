// components/nurse/LiveQueue.tsx
import React from 'react';
import { MoreVertical, Layers } from 'lucide-react';

const patients = [
  { id: '449201', name: 'MARCUS, ELIAS', sex: 'M', age: 62, time: '08:42 AM', delay: '12m OVER', urgency: 'CRITICAL' },
  { id: '881203', name: 'WANG, LINDA', sex: 'F', age: 31, time: '09:05 AM', delay: 'WAITING 14m', urgency: 'HIGH' },
  { id: '102934', name: 'SANTOS, CARLOS', sex: 'M', age: 45, time: '09:12 AM', delay: 'WAITING 7m', urgency: 'MEDIUM' },
  { id: '556701', name: 'BROWN, JESSICA', sex: 'F', age: 19, time: '09:15 AM', delay: 'WAITING 4m', urgency: 'LOW' },
];

const urgencyStyles: Record<string, string> = {
  CRITICAL: 'bg-red-50 text-red-600 border-red-200',
  HIGH: 'bg-orange-50 text-orange-600 border-orange-200',
  MEDIUM: 'bg-blue-50 text-blue-600 border-blue-200',
  LOW: 'bg-green-50 text-green-600 border-green-200',
};

export default function LiveQueue() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-full shadow-sm">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base">Live Triage Queue</h3>
        <div className="flex gap-2 text-xs font-bold">
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded">ACTIVE</span>
          <span className="bg-teal-700 text-white px-2.5 py-1 rounded">RECEPTIVE</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">Patient Details</th>
              <th className="py-3 px-5">Arrival</th>
              <th className="py-3 px-5">Urgency</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-5">
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-500 font-medium">ID: {p.id} • {p.sex}, {p.age}y</div>
                </td>
                <td className="py-4 px-5">
                  <div className="font-semibold text-slate-800">{p.time}</div>
                  <div className={`text-xs font-bold ${p.urgency === 'CRITICAL' ? 'text-red-500' : 'text-teal-600'}`}>
                    {p.delay}
                  </div>
                </td>
                <td className="py-4 px-5">
                  <span className={`px-2.5 py-1 text-xs font-extrabold rounded-full border ${urgencyStyles[p.urgency]}`}>
                    {p.urgency}
                  </span>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-sm">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      TRIAGE
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}