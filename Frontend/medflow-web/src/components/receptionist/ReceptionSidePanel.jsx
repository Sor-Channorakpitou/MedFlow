// components/receptionist/ReceptionSidePanel.jsx
import { useState } from 'react';
import { UserPlus, TrendingUp, CalendarDays, Flame, X } from 'lucide-react';

export default function ReceptionSidePanel({ setSubView, stats = {} }) {
  const { pendingInvoices = 0, collectionsToday = '$0.00', transactions = [] } = stats;
  const [showRevenue, setShowRevenue] = useState(false);

  return (
    <div className="w-80 flex flex-col gap-4 shrink-0">

      {/* Billing Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> Billing Summary
        </h4>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Pending Invoices</span>
            <span className="font-bold text-slate-900 font-mono text-sm">{pendingInvoices}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Collections (Today)</span>
            <span className="font-black text-slate-900 font-mono text-sm">{collectionsToday}</span>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Recent Transactions
          </p>
          <div className="space-y-2">
            {transactions.length > 0 ? (
              transactions.map((t, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 rounded bg-slate-50 font-mono text-[11px]"
                >
                  <div className="text-left">
                    <p className="font-medium text-slate-800 truncate max-w-[140px]">{t.name ?? '—'}</p>
                    <p className="text-[12px] text-slate-400">{t.type ?? '—'}</p>
                  </div>
                  <span className="font-bold text-emerald-600">
                    {t.amount != null ? `+$${Number(t.amount).toFixed(2)}` : '—'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-400 text-center py-2">No recent transactions.</p>
            )}
          </div>
          <button
            onClick={() => setShowRevenue(true)}
            className="w-full mt-3 bg-black text-white font-bold py-2 rounded-lg text-xs transition hover:bg-slate-900 tracking-wide uppercase"
          >
            View Full Revenue Report
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2 text-left">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h4>

        <button
          onClick={() => setSubView('register')}
          className="w-full flex items-center justify-center gap-2 bg-teal-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition hover:bg-teal-800 shadow-sm"
        >
          <UserPlus className="w-4 h-4" /> Add New Patient
        </button>

        <button
          onClick={() => setSubView('list')}
          className="w-full flex items-center justify-center gap-2 border border-teal-200 bg-white text-teal-700 font-bold py-2.5 px-4 rounded-lg text-xs transition hover:bg-teal-50"
        >
          <CalendarDays className="w-4 h-4" /> Appointment List
        </button>

        <button
          onClick={() => {
            setSubView('register');
            // Emergency walk-in: registration form auto-populates urgency
          }}
          className="w-full flex items-center justify-center gap-2 border border-rose-200 text-rose-600 font-bold py-2.5 px-4 rounded-lg text-xs transition bg-white hover:bg-rose-50"
        >
          <Flame className="w-4 h-4 text-rose-500" /> Emergency Walk-in
        </button>
      </div>

        {showRevenue && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900">Revenue Report</h3>
                <button onClick={() => setShowRevenue(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
                  <p className="text-xl font-black text-slate-900 mt-1">{pendingInvoices}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collected Today</p>
                  <p className="text-xl font-black text-emerald-700 mt-1">{collectionsToday}</p>
                </div>
              </div>

              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Recent Transactions</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions.length > 0 ? (
                  transactions.map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded bg-slate-50 text-xs">
                      <span className="font-medium text-slate-800">{t.name || '—'}</span>
                      <span className="font-bold text-emerald-600">+{t.amount != null ? `$${Number(t.amount).toFixed(2)}` : '—'}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No transactions yet today.</p>
                )}
              </div>

              <button
                onClick={() => setShowRevenue(false)}
                className="w-full mt-4 bg-black text-white font-bold py-2 rounded-lg text-xs transition hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        )}

    </div>
  );
}
