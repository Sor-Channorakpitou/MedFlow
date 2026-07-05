// components/receptionist/NewPatientRegistration.jsx
import { useState } from 'react';
import { UserPlus, HeartPulse, Terminal, User, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWorkflow } from "../../hooks/useWorkflow";

export default function NewPatientRegistration({ onCompleteRegistration }) {
  const { addPatientWithAppointment, patients = [] } = useWorkflow();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dob: '',
    gender: 'M', // Enforces strict schema type limits: 'M' | 'F'
    address: '',
    insuranceProvider: 'None',
    reason: 'General Consultation' // Tied to schema field naming
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please enter the patient's full identity name and contact sequence line.");
      return;
    }

    if (addPatientWithAppointment) {
      // Maps configuration precisely to your type structures
      addPatientWithAppointment({
        full_name: formData.fullName,
        phone: formData.phone,
        DOB: formData.dob, // Matches uppercase schema notation
        gender: formData.gender,
        address: formData.address,
        reason: formData.reason,
        insurance_provider: formData.insuranceProvider
      });
    }

    if (onCompleteRegistration) onCompleteRegistration(); // Auto-redirect elements straight back to manifest list!
  };

  return (
    <div className="flex-1 flex gap-5 min-h-0 text-left w-full h-full items-start">
      
      {/* FORM FILL DATA MODULE */}
      <form onSubmit={handleSubmit} className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 h-full overflow-y-auto">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-teal-700" /> Intake Questionnaire
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Register a walk-in patient directly into today's active manifest.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 col-span-2">
            <label className="font-semibold text-slate-600">Full Name</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-600">Phone Number</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-600">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium" />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-600">Gender Identity</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-700 font-medium">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-600">Reason for Visit</label>
            <select name="reason" value={formData.reason} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-700 font-medium">
              <option>General Consultation</option>
              <option>Acute Pain / Injury</option>
              <option>Emergency Admission Wing</option>
              <option>Follow-up Review</option>
            </select>
          </div>

          <div className="space-y-1.5 col-span-2">
            <label className="font-semibold text-slate-600">Residential Address</label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="123 Health Ave, Suite 400" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium resize-none"></textarea>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-sm uppercase tracking-wider flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> Commit Record & Route
        </button>
      </form>

      {/* THEMED RIGHT HAND SIDE PREVIEW CARD STACK */}
      <div className="w-80 flex flex-col gap-4 h-full shrink-0 overflow-hidden">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs flex flex-col overflow-hidden">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" /> Manifest Line Item Preview
            </h4>
          </div>
          
          <div className="space-y-2.5 font-mono text-[11px] text-slate-600 flex-1 overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">full_name:</span>
              <span className="font-bold text-slate-900 truncate max-w-[150px] text-right">{formData.fullName || "Unset"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">gender:</span>
              <span className="font-semibold text-slate-800">'{formData.gender}'</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">DOB:</span>
              <span className="font-semibold text-slate-800">{formData.dob || "YYYY-MM-DD"}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-400">reason:</span>
              <span className="font-bold text-teal-700 text-right max-w-[150px] truncate">{formData.reason}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Pre-flight Rule Validation
            </h4>
          </div>
          
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            <div className="flex items-start gap-2.5">
              {formData.fullName.trim().length > 3 ? (
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
              )}
              <div className="text-left">
                <p className="font-bold text-slate-700 text-[11px]">Identity Schema Check</p>
                <p className="text-[10px] text-slate-400 leading-normal">Requires minimal string formatting block to prevent identity generation duplication issues.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-2 text-center">
              <div className="flex justify-center items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                <HeartPulse className="w-3.5 h-3.5 text-teal-700" /> Patient Directory Length
              </div>
              <p className="text-xl font-black font-mono tracking-tight text-slate-900 mt-0.5">{patients.length}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}