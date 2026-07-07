// components/receptionist/NewPatientRegistration.jsx
import React, { use, useState } from 'react';
import { UserPlus, ShieldCheck, HeartPulse, Terminal, User, Phone, MapPin, CheckCircle2, AlertCircle, X, CalendarDays, Flame } from 'lucide-react';
import { createPatient } from '../../services/patientAPI';
import { createAppointment } from '../../services/appointmentAPI';
import { useAuth } from '../../hooks/useAuth';

export default function NewPatientRegistration({ onCompleteRegistration }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [nurses, setNurses] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dob: '',
    gender: 'MALE',
    address: '',
    reason: 'General Consultation'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please enter the patient's full name and phone number.");
      return;
    }

    if (!user?.id) {
      alert("User session missing (required for appointment)");
      return;
    }

    setLoading(true);

    try {
      // 1. Always create patient first
      const patient = await createPatient({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dob ? new Date(formData.dob) : null,
        gender: formData.gender,
        address: formData.address?.trim() || null
      });

      setSuccess("Patient registered successfully.");
      setTimeout(() => setSuccess(""), 3000);

      setFormData({
        fullName: '',
        phone: '',
        dob: '',
        gender: 'MALE',
        address: '',
        reason: 'General Consultation'
      });

      onCompleteRegistration?.();

    } catch (err) {
        setError(err.response?.data?.message || "Failed to register patient.");
        setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergency = () => {
    if (triggerEmergencyAdmission) {
      triggerEmergencyAdmission();
      alert("Emergency Admission walk-in bypass injected directly into clinical triage!");
      setSubView('list'); // Take them to the list to see system updates
    } else {
      alert("Emergency Admission clicked! (In production, this injects an ESI-1 critical status patient directly into the triage queue).");
    }
  };

  return (
    <div className="flex-1 flex gap-5 min-h-0 text-left w-full h-full items-start">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {/* FORM FILL DATA MODULE */}
      <form onSubmit={handleSubmit} className="flex-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 h-full overflow-y-auto">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-teal-700" /> Intake Questionnaire
        </h3>
        <p className="text-[13px] text-slate-400 mt-0.5">
          Register a patient directly
        </p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Success</p>
            <p className="text-sm">{success}</p>
          </div>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="text-green-500 hover:text-green-700"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Registration Failed. Try again</p>
            <p className="text-sm">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>
        </div>
      )} 

      <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 col-span-2">
            <label className="font-semibold text-slate-600">Full Name</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Sor Channorakpitou" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-600">Phone Number</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+855 12 345 698" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-600">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium" />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-600">Gender Identity</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-700 font-medium">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
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
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="12 Sen Sok, Phnom Penh" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium resize-none"></textarea>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-lg text-xs transition shadow-sm uppercase tracking-wider flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> Submit
        </button>
      </form>

      {/* THEMED RIGHT HAND SIDE PREVIEW CARD STACK */}
      <div className="w-80 flex flex-col gap-4 h-full shrink-0 overflow-hidden">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs flex flex-col overflow-hidden">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" /> Item Preview
            </h4>
          </div>
          
          <div className="space-y-2.5 font-mono text-[11px] text-slate-600 flex-1 overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">Full name:</span>
              <span className="font-bold text-slate-900 truncate max-w-[150px] text-right">{formData.fullName || "Unset"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">Gender:</span>
              <span className="font-semibold text-slate-800">'{formData.gender}'</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
              <span className="text-slate-400">Date of Birth:</span>
              <span className="font-semibold text-slate-800">{formData.dob || "YYYY-MM-DD"}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-400">Reason:</span>
              <span className="font-bold text-teal-700 text-right max-w-[150px] truncate">{formData.reason}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">
          Available Nurses
        </h4>

        <div className="space-y-2 max-h-56 overflow-y-auto">
          {nurses.map((nurse) => (
            <button
              key={nurse.id}
              onClick={() => onSelectNurse(nurse)}
              className={`w-full text-left rounded-lg border p-3 transition
                ${
                  selectedNurse?.id === nurse.id
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 hover:border-cyan-300"
                }`}
            >
              <div className="flex justify-between">
                <p className="font-semibold text-sm">{nurse.fullName}</p>

                <span
                  className={`w-2.5 h-2.5 rounded-full mt-1 ${
                    nurse.status === "AVAILABLE"
                      ? "bg-emerald-500"
                      : nurse.status === "BUSY"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {nurse.department}
              </p>

              {selectedNurse?.id === nurse.id && (
                <p className="text-xs font-semibold text-cyan-600 mt-2">
                  Selected
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1 text-left">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h4>
          
          <button 
            onClick={() => setSubView('register')}
            className="w-full flex items-center justify-center gap-2 bg-teal-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition hover:bg-teal-800 shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> ADD NEW PATIENT
          </button>

          <button 
            onClick={() => {
              setSubView('list');
              alert("To schedule an appointment, select an available open time slot from the active manifest grid.");
            }}
            className="w-full flex items-center justify-center gap-2 border bg-teal-600 text-teal-700 font-bold py-2.5 px-4 rounded-lg text-xs transition bg-white hover:bg-teal-50"
          >
            <CalendarDays className="w-4 h-4" /> SCHEDULE APPOINTMENT
          </button>

          <button 
            onClick={handleEmergency}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-lg text-xs transition bg-white hover:bg-rose-50/50 group"
          >
            <Flame className="w-4 h-4 text-rose-500 " /> EMERGENCY ADMISSION
          </button>
        </div>
      </div>

    </div>
  );
}