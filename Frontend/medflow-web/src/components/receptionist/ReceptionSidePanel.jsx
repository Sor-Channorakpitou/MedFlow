// components/receptionist/ReceptionSidePanel.jsx
import React from 'react';
import { 
  UserPlus, 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

export default function ReceptionSidePanel({ setSubView, stats }) {
  return (
    <div className="w-80 flex flex-col gap-4 shrink-0">
      {/* Financial Operations Metrics Layer */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-slate-400" /> Billing Summary
        </h4>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Pending Invoices</span>
            <span className="font-bold text-slate-900 font-mono text-sm">{stats.pendingInvoices}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Collections (Today)</span>
            <span className="font-black text-slate-900 font-mono text-sm">{stats.collectionsToday}</span>
          </div>
        </div>
        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Recent Transactions</p>
          <div className="space-y-2">
            {stats.transactions?.map((t, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded bg-slate-50 font-mono text-[11px]">
                <div className="text-left">
                  <p className="font-medium text-slate-800 truncate max-w-[140px]">{t.name}</p>
                  <p className="text-[12px] text-slate-400">{t.type}</p>
                </div>
                <span className="font-bold text-emerald-600">+ ${t.amount}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setSubView('checkout')}
            className="w-full mt-3 bg-black text-white font-bold py-2 rounded-lg text-xs transition hover:bg-slate-900 tracking-wide uppercase"
          >
            View Full Revenue Report
          </button>
        </div>
      </div>

      {/* Department Clinic Status Monitoring Panel */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 shadow-sm text-left">
        <div className="flex items-center gap-2 text-cyan-800 mb-2">
          <ShieldAlert className="w-4 h-4 text-cyan-700" />
          <h4 className="text-xs font-bold uppercase tracking-wider">Clinic Status</h4>
        </div>
        <p className="text-xs text-cyan-900/80 leading-relaxed font-medium">
          All departments operational. General surgery wing experiencing minor delays (approx. 20 mins).
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-cyan-700 tracking-wide uppercase">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          Live Updates Active
        </div>
      </div>
    </div>
  );
}