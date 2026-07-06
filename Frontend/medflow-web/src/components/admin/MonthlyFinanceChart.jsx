import React, { useMemo } from 'react';

function MonthlyProfitChart({ invoices = [] }) {
  const { areaPath, strokePath, labels, totalProfit } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyProfit = Array(daysInMonth).fill(0);

    invoices.forEach((invoice) => {
      const date = new Date(invoice.issuedDate);

      if (
        date.getFullYear() === year &&
        date.getMonth() === month
      ) {
        dailyProfit[date.getDate() - 1] += Number(invoice.totalAmount || 0);
      }
    });

    const maxProfit = Math.max(...dailyProfit, 1);

    const width = 600;
    const height = 150;
    const stepX = width / (daysInMonth - 1);

    const points = dailyProfit.map((profit, index) => ({
      x: index * stepX,
      y: height - (profit / maxProfit) * (height - 20),
    }));

    const strokePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    const areaPath = `${strokePath} L ${width} ${height} L 0 ${height} Z`;

    return {
      strokePath,
      areaPath,
      labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      totalProfit: dailyProfit.reduce((a, b) => a + b, 0),
    };
  }, [invoices]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
        <h3 className="text-sm font-bold text-gray-900">
          Monthly Profit
        </h3>

        <div className="text-xs font-medium text-green-600">
          ${totalProfit.toFixed(2)}
        </div>
      </div>

      <div className="relative w-full h-48">
        <svg
          viewBox="0 0 600 150"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1="0"
            y1="30"
            x2="600"
            y2="30"
            stroke="#f3f4f6"
            strokeDasharray="4 4"
          />

          <line
            x1="0"
            y1="75"
            x2="600"
            y2="75"
            stroke="#f3f4f6"
            strokeDasharray="4 4"
          />

          <line
            x1="0"
            y1="120"
            x2="600"
            y2="120"
            stroke="#f3f4f6"
            strokeDasharray="4 4"
          />

          <path
            d={areaPath}
            fill="url(#profitGradient)"
            className="transition-all duration-700"
          />

          <path
            d={strokePath}
            fill="none"
            stroke="#16a34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700"
          />
        </svg>
      </div>

      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-400">
        {labels.map((day) => (
          <span key={day}>
            {day % 5 === 0 || day === 1 ? day : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MonthlyProfitChart;