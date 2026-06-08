// src/pages/NurseDash.jsx
import React, { useState } from 'react';
import { Search, Bell, HelpCircle, AlertTriangle, Clock, UserPlus, CheckCircle, Activity, MoreVertical } from 'lucide-react';

function NurseDash() {
  // Mock Data matching the state of Nurse.png blueprint layout
  const [triageQueue, setTriageQueue] = useState([
    { id: '449201', name: 'MARCUS, ELIAS', age: 62, gender: 'M', time: '08:42 AM', status: '12m OVER', urgency: 'CRITICAL' },
    { id: '881203', name: 'WANG, LINDA', age: 31, gender: 'F', time: '09:05 AM', status: 'WAITING 14m', urgency: 'HIGH' },
    { id: '102934', name: 'SANTOS, CARLOS', age: 45, gender: 'M', time: '09:12 AM', status: 'WAITING 7m', urgency: 'MEDIUM' },
    { id: '556701', name: 'BROWN, JESSICA', age: 19, gender: 'F', time: '09:15 AM', status: 'WAITING 4m', urgency: 'LOW' }
  ]);

  const [activePatientId, setActivePatientId] = useState('449201');
  const activePatient = triageQueue.find(p => p.id === activePatientId) || triageQueue[0];

  // Active Vitals Intake Form State
  const [vitals, setVitals] = useState({
    bpSys: '145',
    bpDia: '95',
    hr: '108',
    temp: '38.4',
    spo2: '94',
    notes: ''
  });

  const [urgencyLevel, setUrgencyLevel] = useState('CRITICAL');

  const handleInputChange = (field, value) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleMoveToDoctor = () => {
    alert(`Moving ${activePatient.name} to Doctor workstation assignment queue with ${urgencyLevel} priority.`);
    // Remove from active triage pool after transition complete
    setTriageQueue(prev => prev.filter(p => p.id !== activePatient.id));
  };

  return (
    <div className="flex flex-col h-screen bg-[#f4f6f8] overflow-hidden text-left">
      
      {/* Top Header Bar Navigation Utilities */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
        <div className="relative w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search patient name, ID, or triage level..." 
            className="w-full bg-gray-100 text-xs pl-9 pr-4 py-2 rounded border-none outline-none focus:ring-1 focus:ring-teal-600 text-left"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-gray-500">
            <button className="hover:text-black transition-colors"><Bell className="w-4 h-4" /></button>
            <button className="hover:text-black transition-colors"><HelpCircle className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">SJ</div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-gray-800 leading-none">Nurse Sarah J.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Head of Triage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="p-4 flex flex-col flex-1 min-h-0 space-y-4">
        
        {/* Top Operational Metrics Ribbon Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <div className="bg-white border border-gray-200 rounded p-4 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 bg-rose-50 rounded text-rose-600"><AlertTriangle className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Critical Patients</p>
              <p className="text-xl font-black text-rose-600 mt-0.5">03</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 bg-teal-50 rounded text-teal-600"><Clock className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Avg. Wait Time</p>
              <p className="text-xl font-black text-teal-600 mt-0.5">14 min</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 bg-amber-50 rounded text-amber-600"><UserPlus className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Awaiting Triage</p>
              <p className="text-xl font-black text-gray-800 mt-0.5">08</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-4 flex items-center gap-4 shadow-sm">
            <div className="p-2.5 bg-emerald-50 rounded text-emerald-600"><CheckCircle className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Managed Today</p>
              <p className="text-xl font-black text-gray-800 mt-0.5">124</p>
            </div>
          </div>
        </div>

        {/* Master Content Double Split: Left List vs Right Evaluation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1 min-h-0">
          
          {/* LEFT CONTAINER: Live Triage Queue Workspace */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded flex flex-col h-full min-h-0 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Live Triage Queue</h3>
              <div className="flex gap-1">
                <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Active</span>
                <span className="bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">Receptive</span>
              </div>
            </div>

            {/* Core Data Grid Sheet Table */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-4 font-semibold">Patient Details</th>
                    <th className="py-2.5 px-4 font-semibold">Arrival</th>
                    <th className="py-2.5 px-4 font-semibold">Urgency</th>
                    <th className="py-2.5 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {triageQueue.map((patient) => {
                    const isSelected = patient.id === activePatientId;
                    return (
                      <tr 
                        key={patient.id}
                        onClick={() => setActivePatientId(patient.id)}
                        className={`cursor-pointer transition-colors ${isSelected ? 'bg-teal-50/40 font-medium' : 'hover:bg-gray-50/50'}`}
                      >
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900">{patient.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">ID: {patient.id} • {patient.gender}, {patient.age}y</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-800 font-medium">{patient.time}</p>
                          <p className={`text-[10px] font-bold mt-0.5 ${patient.urgency === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`}>{patient.status}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded inline-block ${
                            patient.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                            patient.urgency === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                            patient.urgency === 'MEDIUM' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {patient.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setActivePatientId(patient.id)}
                              className="border border-teal-600 text-teal-600 text-[11px] font-bold px-3 py-1 rounded hover:bg-teal-600 hover:text-white transition-all flex items-center gap-1"
                            >
                              <Activity className="w-3 h-3" /> Triage
                            </button>
                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT CONTAINER: Active Triage Assessment Workspace */}
          <div className="lg:col-span-5 flex flex-col h-full min-h-0 space-y-4">
            
            {/* Vitals & Intake Module Form */}
            <div className="bg-white border border-gray-200 rounded shadow-sm flex flex-col flex-1 min-h-0 overflow-y-auto">
              <div className="px-4 py-3 bg-[#0f766e] text-white flex justify-between items-center shrink-0">
                <h3 className="text-xs font-bold uppercase tracking-wider">Active Triage: {activePatient.name}</h3>
                <span className="text-[10px] bg-teal-900/60 font-mono tracking-widest px-1.5 py-0.5 rounded font-bold">EMERGENCY ROOM 2A</span>
              </div>

              <div className="p-4 flex-1 space-y-4">
                {/* 1. Urgency Framework Matrix Row */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Assign Urgency Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setUrgencyLevel(lvl)}
                        className={`py-2 px-1 text-[10px] font-black rounded border transition-all ${
                          urgencyLevel === lvl 
                            ? lvl === 'CRITICAL' ? 'bg-rose-600 border-rose-600 text-white shadow-sm' :
                              lvl === 'HIGH' ? 'bg-amber-500 border-amber-500 text-white shadow-sm' :
                              lvl === 'MEDIUM' ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {lvl === 'CRITICAL' && '🚨 '}
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Vitals Recording Dashboard Blocks */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Vitals Recording</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <div className="border border-gray-200 rounded p-2.5 bg-white relative">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">BP (mmHg)</span>
                      <div className="flex items-baseline gap-1 mt-1 font-mono">
                        <input type="text" value={vitals.bpSys} onChange={(e) => handleInputChange('bpSys', e.target.value)} className="w-10 text-sm font-bold text-gray-900 outline-none border-none p-0 focus:ring-0" />
                        <span className="text-gray-300 text-xs">/</span>
                        <input type="text" value={vitals.bpDia} onChange={(e) => handleInputChange('bpDia', e.target.value)} className="w-10 text-sm font-bold text-gray-900 outline-none border-none p-0 focus:ring-0" />
                      </div>
                      <span className="text-[8px] font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded absolute right-2 bottom-2">⚠️ HYPERTENSIVE</span>
                    </div>

                    <div className="border border-gray-200 rounded p-2.5 bg-white relative">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">HR (bpm)</span>
                      <div className="flex items-baseline mt-1 font-mono">
                        <input type="text" value={vitals.hr} onChange={(e) => handleInputChange('hr', e.target.value)} className="w-12 text-sm font-bold text-gray-900 outline-none border-none p-0 focus:ring-0" />
                      </div>
                      <span className="text-[8px] font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded absolute right-2 bottom-2">🫀 TACHYCARDIA</span>
                    </div>

                    <div className="border border-gray-200 rounded p-2.5 bg-white relative">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">TEMP (°C)</span>
                      <div className="flex items-baseline mt-1 font-mono">
                        <input type="text" value={vitals.temp} onChange={(e) => handleInputChange('temp', e.target.value)} className="w-12 text-sm font-bold text-gray-900 outline-none border-none p-0 focus:ring-0" />
                      </div>
                      <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded absolute right-2 bottom-2">🌡️ FEVER</span>
                    </div>

                    <div className="border border-gray-200 rounded p-2.5 bg-white relative sm:col-span-1">
                      <span className="text-[9px] font-bold text-gray-400 uppercase block">SpO2 (%)</span>
                      <div className="flex items-baseline mt-1 font-mono">
                        <input type="text" value={vitals.spo2} onChange={(e) => handleInputChange('spo2', e.target.value)} className="w-12 text-sm font-bold text-gray-900 outline-none border-none p-0 focus:ring-0" />
                      </div>
                      <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded absolute right-2 bottom-2">✅ NORMAL</span>
                    </div>

                  </div>
                </div>

                {/* 3. Clinical Observation Logs Notes */}
                <div className="flex flex-col flex-1 space-y-1.5 pt-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Chief Complaint / Notes</label>
                  <textarea
                    value={vitals.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter acute clinical observation notes..."
                    className="w-full flex-1 min-h-[100px] bg-gray-50 border border-gray-200 rounded p-3 text-xs outline-none resize-none focus:bg-white focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Bottom Sticky Submission Deck */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex gap-3 shrink-0">
                <button 
                  onClick={handleMoveToDoctor}
                  className="flex-1 bg-black text-white hover:bg-gray-900 transition-colors py-2 px-4 rounded text-xs font-bold tracking-wider uppercase text-center"
                >
                  🚀 Move to Doctor
                </button>
                <button className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors py-2 px-4 rounded text-xs font-bold uppercase">
                  Save Draft
                </button>
              </div>
            </div>

            {/* Bottom Station Logs Tracking Sub-card */}
            <div className="bg-white border border-gray-200 rounded p-3 shadow-sm shrink-0">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Station Action Logs</h4>
                <Clock className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <ul className="text-[11px] space-y-1.5 text-gray-600 leading-tight">
                <li>🟢 <span className="font-mono text-gray-400 font-bold">09:12 AM:</span> Patient Santos, C. moved to Dr. Aris <span className="text-gray-400 font-medium">[Room 4]</span></li>
                <li>🔴 <span className="font-mono text-gray-400 font-bold">09:05 AM:</span> Triage alert: Critical vitals trigger for Marcus, E.</li>
                <li>🔵 <span className="font-mono text-gray-400 font-bold">08:58 AM:</span> Patient Lee, K. successfully discharged by triage authority.</li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default NurseDash;