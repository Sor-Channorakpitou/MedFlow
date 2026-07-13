import { useMemo } from "react";

function MonthlyProfitChart({ revenueTrend = [], totalRevenue = 0 }) {
  const { areaPath, strokePath, labels } = useMemo(() => {
    const values = revenueTrend.map((d) => d.total);
    const dayLabels = revenueTrend.map((d) => {
      const parts = d.date.split("-");
      return parseInt(parts[2], 10);
    });

    if (values.length === 0) {
      return { areaPath: "", strokePath: "", labels: [] };
    }

    const maxVal = Math.max(...values, 1);
    const width = 600;
    const height = 150;
    const count = values.length;
    const stepX = count > 1 ? width / (count - 1) : width / 2;

    const points = values.map((v, i) => ({
      x: i * stepX,
      y: height - (v / maxVal) * (height - 20),
    }));

    const strokePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    const areaPath = `${strokePath} L ${width} ${height} L 0 ${height} Z`;

    return { areaPath, strokePath, labels: dayLabels };
  }, [revenueTrend]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900">Revenue Trend</h3>
        <div className="text-xs font-medium text-green-600">
          ${Number(totalRevenue).toFixed(2)}
        </div>
      </div>

      <div className="relative w-full h-48">
        <svg viewBox="0 0 600 150" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line x1="0" y1="30" x2="600" y2="30" stroke="#f3f4f6" strokeDasharray="4 4" />
          <line x1="0" y1="75" x2="600" y2="75" stroke="#f3f4f6" strokeDasharray="4 4" />
          <line x1="0" y1="120" x2="600" y2="120" stroke="#f3f4f6" strokeDasharray="4 4" />

          {areaPath && <path d={areaPath} fill="url(#profitGradient)" className="transition-all duration-700" />}
          {strokePath && <path d={strokePath} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-700" />}
        </svg>
      </div>

      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-400">
        {labels.map((day, i) => (
          <span key={i}>
            {labels.length > 15 ? (i % 5 === 0 || i === 0 ? day : "") : day}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MonthlyProfitChart;
