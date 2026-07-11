import { useMemo } from 'react';

function PatientVolumeChart({ appointments = [] }) {
  const intervals = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

  const { areaPath, strokePath } = useMemo(() => {
    const baseVolume = appointments.length;
    // Generate simple dynamic heights based on total volume
    const points = [
      Math.max(130 - (baseVolume * 2), 20),
      Math.max(100 - (baseVolume * 5), 20),
      Math.max(60 - (baseVolume * 8), 20), 
      Math.max(85 - (baseVolume * 4), 20),
      Math.max(110 - (baseVolume * 2), 20),
      120,
      140 
    ];

    const sPath = `M 0 ${points[0]} L 100 ${points[1]} L 200 ${points[2]} L 300 ${points[3]} L 400 ${points[4]} L 500 ${points[5]} L 600 ${points[6]}`;
    const aPath = `${sPath} L 600 150 L 0 150 Z`;

    return { areaPath: aPath, strokePath: sPath };
  }, [appointments]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900">Daily Patient Volume</h3>
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
          Live Trend ({appointments.length} Total)
        </div>
      </div>

      <div className="relative w-full h-48 mt-4">
        <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          <line x1="0" y1="30" x2="600" y2="30" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="75" x2="600" y2="75" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="600" y2="120" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />

          <path d={areaPath} fill="url(#chartGrad)" className="transition-all duration-700 ease-in-out" />
          <path d={strokePath} fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700 ease-in-out" />
        </svg>
      </div>

      <div className="flex justify-between border-t border-gray-100 pt-3 mt-4 text-[11px] font-medium text-gray-400 px-1">
        {intervals.map((time, i) => <span key={i}>{time}</span>)}
      </div>
    </div>
  );
}

export default PatientVolumeChart;