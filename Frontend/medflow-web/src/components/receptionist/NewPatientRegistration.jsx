// components/receptionist/NewPatientRegistration.jsx
import React from 'react';
import { 
  User, Calendar, Phone, Mail, MapPin, 
  ArrowRight, Sparkles, Search, Building2, Stethoscope, 
  AlertTriangle, Users, Clock 
} from 'lucide-react';

export default function NewPatientRegistration() {
  return (
    <div className="flex flex-1 gap-5 min-h-0 items-start text-left">
      
      {/* LEFT COLUMN: Personal Details */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col max-h-full">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50 shrink-0">
          <User className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Personal Details</h3>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Legal first name" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-slate-300 transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Last Name <span className="text-rose-500">*</span></label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Legal last name" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-slate-300 transition-all" />
              </div>
            </div>
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="date" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 text-slate-600 focus:outline-none focus:border-slate-300 transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                Sex at Birth <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                {/* <VenusMars className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" /> */}
                <select className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 text-slate-600 focus:outline-none focus:border-slate-300 transition-all appearance-none">
                  <option>Select...</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Primary Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="tel" placeholder="(555) 000-0000" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-slate-300 transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="email" placeholder="patient@example.com" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-slate-300 transition-all" />
              </div>
            </div>
          </div>

          {/* Address Elements */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Home Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Street Address" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-slate-300 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="City" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-slate-300 transition-all" />
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 text-slate-500 focus:outline-none focus:border-slate-300 transition-all appearance-none">
                <option>State</option>
              </select>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="ZIP Code" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 focus:outline-none focus:border-slate-300 transition-all" />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/30 shrink-0">
          <button type="button" className="flex items-center gap-2 bg-black text-white font-bold py-2 px-5 rounded-lg text-xs tracking-wide transition hover:bg-slate-900 shadow-sm">
            Next: Insurance <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Check-In Panel */}
      <div className="w-[340px] shrink-0 space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-1.5 text-slate-800">
              <Building2 className="w-4 h-4 text-slate-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Active Check-In</h4>
            </div>
            <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> Triage Pending
            </span>
          </div>

          {/* Encounter Type */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-500">Encounter Type</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold border border-teal-600 bg-teal-50/40 text-teal-700">
                <Sparkles className="w-3.5 h-3.5" /> Walk-In
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Scheduled
              </button>
            </div>
          </div>

          {/* Select Department */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-500">Select Department</p>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs bg-slate-50/50 text-slate-700 focus:outline-none focus:border-slate-300 appearance-none">
                <option>Select destination...</option>
              </select>
            </div>
          </div>

          {/* Assign Doctor */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-500">Assign Doctor (Optional)</p>
            <div className="relative">
              <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Type to search providers..." className="w-full border border-slate-200 rounded-lg pl-9 pr-8 py-2.5 text-xs bg-slate-50/50 focus:outline-none focus:border-slate-300" />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Acuity Level */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 " /> Acuity Level (ESI)
            </p>
            <div className="grid grid-cols-5 gap-1 text-center font-bold text-xs text-slate-600">
              {['1', '2', '3', '4', '5'].map((num) => (
                <button key={num} className="border border-slate-200 rounded-lg py-2 hover:bg-slate-50 transition-colors bg-white">
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-teal-700 text-white font-bold py-2.5 rounded-lg text-xs transition hover:bg-teal-800 shadow-sm uppercase tracking-wider">
             Start Encounter
          </button>
        </div>

        {/* Live Wait Room Metric */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-lg text-slate-500">
              <Users className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Waiting Room</p>
              <p className="text-xl font-bold text-slate-800 leading-tight">14</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Avg Wait</p>
            <p className="text-sm font-bold text-rose-600 flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5" /> 42 min
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}