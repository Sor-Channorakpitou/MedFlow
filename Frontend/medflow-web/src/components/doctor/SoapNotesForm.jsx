import React from 'react';
import { FileText } from 'lucide-react';

function SoapNotesForm({ data, onChange }) {
  const fields = [
    { id: 'subjective', label: 'Subjective', placeholder: 'Symptom descriptions, chief complaints...' },
    { id: 'objective', label: 'Objective', placeholder: 'Vital stats, physical observations, labs...' },
    { id: 'assessment', label: 'Assessment', placeholder: 'Differential diagnostics, clinical determinations...' },
    { id: 'plan', label: 'Plan', placeholder: 'Therapeutic actions, future labs, management plans...' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-left">
      <div className="flex items-center gap-2 border-b border-gray-50 pb-3 mb-4">
        <FileText className="w-4 h-4 text-gray-400" />
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Clinical SOAP Notes</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.id} className="space-y-1.5">
            <label className="text-xs font-bold text-teal-800 tracking-wide uppercase">{f.label}</label>
            <textarea
              value={data[f.id]}
              onChange={(e) => onChange(f.id, e.target.value)}
              placeholder={f.placeholder}
              rows={3}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all font-medium leading-relaxed resize-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SoapNotesForm;