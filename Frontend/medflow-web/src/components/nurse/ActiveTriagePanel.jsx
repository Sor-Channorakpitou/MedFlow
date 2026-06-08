// components/nurse/ActiveTriagePanel.tsx
import React from 'react';
import { ShieldAlert, AlertTriangle, Info, ShieldCheck, ArrowRight, Save, Activity, Heart, Thermometer, Droplet } from 'lucide-react';

export default function ActiveTriagePanel() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* Title Header */}
      <div className="bg-teal-950 text-white p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] bg-teal-800 px-2 py-0.5 rounded font-bold tracking-wider">ACTIVE TRIAGE</span>
          <h3 className="font-extrabold text-base tracking-wide mt-0.5">MARCUS, ELIAS</h3>
        </div>
        <span className="text-xs font-bold bg-teal-900 border border-teal-700 px-2.5 py-1 rounded text-teal-300">
          EMERGENCY ROOM 2A
        </span>
      </div>

      <div className="p-5 flex-1 space-y-5 overflow-y-auto">
        {/* Urgency Selector Controls */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Assign Urgency Level</label>
          <div className="grid grid-cols-4 gap-2">
            <button className="flex flex-col items-center justify-center p-2.5 border-2 border-red-500 bg-red-50 text-red-600 rounded-lg">
              <ShieldAlert className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase">Critical</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2.5 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500 transition-all">
              <AlertTriangle className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase">High</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2.5 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500 transition-all">
              <Info className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase">Medium</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2.5 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg hover:border-green-300 hover:bg-green-50 hover:text-green-500 transition-all">
              <ShieldCheck className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase">Low</span>
            </button>
          </div>
        </div>

        {/* Vitals Capture Field Mapping Matrix */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Vitals Recording</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-slate-400" /> BP <span className="text-[10px] font-normal text-slate-400">(mmHg)</span>
              </div>
              <div className="text-lg font-black text-slate-900 mt-1">145 <span className="text-slate-300 font-light">/</span> 95</div>
              <span className="text-[10px] font-bold text-red-500 tracking-wide uppercase mt-0.5 inline-block">↑ Hypertensive</span>
            </div>
            
            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-slate-400" /> HR <span className="text-[10px] font-normal text-slate-400">(bpm)</span>
              </div>
              <div className="text-lg font-black text-slate-900 mt-1">108</div>
              <span className="text-[10px] font-bold text-red-500 tracking-wide uppercase mt-0.5 inline-block">🫀 Tachycardia</span>
            </div>

            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-slate-400" /> Temp <span className="text-[10px] font-normal text-slate-400">(°C)</span>
              </div>
              <div className="text-lg font-black text-slate-900 mt-1">38.4</div>
              <span className="text-[10px] font-bold text-orange-500 tracking-wide uppercase mt-0.5 inline-block">🌡️ Fever</span>
            </div>

            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-slate-400" /> SpO2 <span className="text-[10px] font-normal text-slate-400">(%)</span>
              </div>
              <div className="text-lg font-black text-slate-900 mt-1">94</div>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase mt-0.5 inline-block">✓ Normal</span>
            </div>
          </div>
        </div>

        {/* Clinical Observations Notes Input Box */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Chief Complaint / Notes</label>
          <textarea 
            placeholder="Enter clinical observations..."
            rows={3}
            className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-slate-400 placeholder-slate-400 text-slate-800"
          ></textarea>
        </div>

        {/* Action Panel Group */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 bg-slate-950 text-white rounded-lg py-3 px-4 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-slate-900 shadow-md">
            <ArrowRight className="w-4 h-4 text-[#64E5D4]" /> Move to Doctor
          </button>
          <button className="border border-slate-200 text-slate-700 rounded-lg py-3 px-4 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 bg-white hover:bg-slate-50 shadow-sm">
            <Save className="w-4 h-4 text-slate-400" /> Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}