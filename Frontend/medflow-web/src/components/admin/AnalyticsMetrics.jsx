import { Users, Activity, ShieldAlert, Timer, DollarSign, Receipt } from 'lucide-react';

function AnalyticsMetrics({ liveStats = {} }) {
  const {
    totalPatients = 0,
    triageBacklog = 0,
    activeConsultations = 0,
    criticalAlerts = 0,
    totalRevenue = 0,
    pendingBilling = 0,
  } = liveStats;

  const metrics = [
    {
      label: 'Active Patients',
      value: totalPatients,
      change: 'Currently in system',
      isPositive: true,
      icon: <Users className="w-5 h-5 text-gray-500" />,
      bgIcon: 'bg-gray-50',
      textColor: 'text-gray-500',
    },
    {
      label: 'Triage Backlog',
      value: triageBacklog,
      change: triageBacklog > 5 ? 'High Load' : 'Manageable',
      isPositive: triageBacklog <= 5,
      icon: <Timer className={`w-5 h-5 ${triageBacklog > 5 ? 'text-amber-600' : 'text-emerald-600'}`} />,
      bgIcon: triageBacklog > 5 ? 'bg-amber-50' : 'bg-emerald-50',
      textColor: triageBacklog > 5 ? 'text-amber-600' : 'text-emerald-600',
    },
    {
      label: 'Active Consults',
      value: activeConsultations,
      change: 'Doctors consulting',
      isPositive: true,
      icon: <Activity className="w-5 h-5 text-teal-600" />,
      bgIcon: 'bg-teal-50',
      textColor: 'text-teal-600',
    },
    {
      label: 'Critical Alerts',
      value: criticalAlerts,
      change: criticalAlerts > 0 ? 'Action Required' : 'All Clear',
      isPositive: criticalAlerts === 0,
      icon: <ShieldAlert className={`w-5 h-5 ${criticalAlerts > 0 ? 'text-rose-600' : 'text-gray-400'}`} />,
      bgIcon: criticalAlerts > 0 ? 'bg-rose-50' : 'bg-gray-50',
      textColor: criticalAlerts > 0 ? 'text-rose-600' : 'text-gray-400',
    },
    {
      label: 'Pending Billing',
      value: pendingBilling,
      change: 'Awaiting payment',
      isPositive: pendingBilling === 0,
      icon: <Receipt className={`w-5 h-5 ${pendingBilling > 0 ? 'text-indigo-600' : 'text-gray-400'}`} />,
      bgIcon: pendingBilling > 0 ? 'bg-indigo-50' : 'bg-gray-50',
      textColor: pendingBilling > 0 ? 'text-indigo-600' : 'text-gray-400',
    },
    {
      label: 'Revenue Collected',
      value: `$${Number(totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'Paid invoices total',
      isPositive: true,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bgIcon: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
      {metrics.map((m, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">
                {m.label}
              </span>
              <span className="text-2xl font-bold text-gray-900 block mt-1.5">{m.value}</span>
            </div>
            <div className={`${m.bgIcon} p-2.5 rounded-lg`}>{m.icon}</div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center">
            <span className={`text-xs font-bold ${m.textColor}`}>{m.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnalyticsMetrics;
