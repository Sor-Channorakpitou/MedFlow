import React, { useState } from 'react';
import { Plus } from 'lucide-react';

function PrescriptionOrderEntry({ onAdd }) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('10mg');
  const [freq, setFreq] = useState('Once Daily (QD)');
  const [duration, setDuration] = useState('30 Days');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, dosage: dose, frequency: freq });
    setName('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-left flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center border-b border-gray-50 pb-2.5 mb-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prescription Entry</h3>
          <span className="text-[10px] font-bold text-teal-700 hover:underline cursor-pointer tracking-wide">View Formulas</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Main Formula Search Field */}
          <div className="space-y-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Search medication (e.g. Lisinopril)..."
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all font-semibold"
            />
          </div>

          {/* Metric Sub-Parameters Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Dose</label>
              <input
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 outline-none font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Frequency</label>
              <input
                type="text"
                value={freq}
                onChange={(e) => setFreq(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 outline-none font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 outline-none font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 rounded-lg text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add to Plan
          </button>
        </form>
      </div>
    </div>
  );
}

export default PrescriptionOrderEntry;