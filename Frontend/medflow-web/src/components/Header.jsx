import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 w-full">
      {/* Universal Search */}
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search patient name, ID, or triage level..."
          className="w-full bg-slate-100 text-sm pl-10 pr-4 py-2 rounded-lg border border-transparent focus:outline-none focus:border-slate-300 transition-all text-slate-800"
        />
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-6">
        <button className="relative text-slate-600 hover:text-slate-900">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="text-slate-600 hover:text-slate-900">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-sm">
            SJ
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900 leading-none">Nurse Sarah J.</p>
            <span className="text-xs text-slate-500 font-medium">Head of Triage</span>
          </div>
        </div>
      </div>
    </header>
  );
}