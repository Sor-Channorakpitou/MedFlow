import React from 'react';

function PatientVolumeChart() {
  const intervals = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900">Daily Patient Volume</h3>
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
          Volume Trend
        </div>
      </div>

      {/* SVG Vector Area Grid Frame */}
      <div className="relative w-full h-48 mt-4">
        <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Baseline Guides */}
          <line x1="0" y1="30" x2="600" y2="30" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="75" x2="600" y2="75" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="600" y2="120" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />

          {/* Area Path */}
          <path
            d="M 0 110 L 100 100 L 200 60 L 300 65 L 400 95 L 500 110 L 600 110 L 600 150 L 0 150 Z"
            fill="url(#chartGrad)"
          />
          
          {/* Main Stroke Path */}
          <path
            d="M 0 110 L 100 100 L 200 60 L 300 65 L 400 95 L 500 110 L 600 110"
            fill="none"
            stroke="#0f766e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Time axis layout labels */}
      <div className="flex justify-between border-t border-gray-100 pt-3 mt-4 text-[11px] font-medium text-gray-400 px-1">
        {intervals.map((time, i) => (
          <span key={i}>{time}</span>
        ))}
      </div>
    </div>
  );
}

export default PatientVolumeChart;