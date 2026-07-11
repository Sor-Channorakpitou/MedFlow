import { useEffect, useState } from 'react';
import { UserPlus, Terminal, User, Phone, MapPin, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { createPatient } from '../../services/patientAPI';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from "../../hooks/useToast";

export default function NewPatientRegistration({ onCompleteRegistration }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
      await createPatient({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dob ? new Date(formData.dob) : null,
        gender: formData.gender,
        address: formData.address?.trim() || null,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex gap-5 min-h-0 text-left w-full h-full items-start">
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
            <p className="font-semibold">{error}</p>
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
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Sor Channorakpitou" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium" />
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
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="House No., Street, Village, City" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 bg-slate-50/50 focus:outline-none focus:border-teal-600 text-slate-800 font-medium resize-none"></textarea>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-xs transition shadow-sm uppercase tracking-wider flex items-center justify-center gap-1.5"
        >
          {loading ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Submitting...</>
          ) : (
            <><CheckCircle2 className="w-4 h-4" /> Submit</>
          )}
        </button>
      </form>

      {/* Item Preview */}
      <div className="w-80 shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs">
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" /> Item Preview
            </h4>
          </div>

          <div className="space-y-2.5 font-mono text-[11px] text-slate-600">
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
      </div>

    </div>
  );
}