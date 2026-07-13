import { useMemo } from 'react';

const LABELS = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today'];

function PatientVolumeChart({ dailyCounts = [], total = 0 }) {
  const { areaPath, strokePath } = useMemo(() => {
    const bins = dailyCounts.length === 7 ? dailyCounts : Array(7).fill(0);
    const maxVal = Math.max(...bins, 1);
    const width = 600;
    const height = 150;
    const stepX = width / (bins.length - 1 || 1);

    const points = bins.map((count, i) => ({
      x: i * stepX,
      y: height - (count / maxVal) * (height - 20),
    }));

    const strokePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    const areaPath = `${strokePath} L ${width} ${height} L 0 ${height} Z`;

    return { areaPath, strokePath };
  }, [dailyCounts]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full flex flex-col justify-between">
      <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900">Daily Patient Volume</h3>
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
          Live Trend ({total} Total)
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
        {LABELS.map((label, i) => (
          <span key={i} className="flex flex-col items-center gap-0.5">
            <span>{label}</span>
            <span className="text-[9px] text-gray-300">{dailyCounts[i] ?? 0}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default PatientVolumeChart;
