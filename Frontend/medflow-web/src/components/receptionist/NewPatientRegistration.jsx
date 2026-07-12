import { useEffect, useState } from 'react';
import { UserPlus, User, Phone, MapPin, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { createPatient } from '../../services/patientAPI';
import { useAuth } from '../../hooks/useAuth';

export default function NewPatientRegistration({ onCompleteRegistration }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dob: '',
    gender: 'MALE',
    address: '',
    reason: 'General Consultation',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      setError("Please enter the patient's full name and phone number.");
      return;
    }

    if (!user?.id) {
      setError('User session missing (required for appointment)');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createPatient({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dob ? new Date(formData.dob) : null,
        gender: formData.gender,
        address: formData.address?.trim() || null,
      });

      setSuccess('Patient registered successfully!');
      setTimeout(() => setSuccess(''), 3000);

      setFormData({
        fullName: '',
        phone: '',
        dob: '',
        gender: 'MALE',
        address: '',
        reason: 'General Consultation',
      });

      onCompleteRegistration?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-10 py-6 sm:py-8">
      {/* Responsive Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form Section - Takes 2 columns on desktop */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-sm space-y-6 sm:space-y-8"
          >
            {/* Form Header */}
            <div className="space-y-2 pb-4 sm:pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    Patient Registration
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    Register a new patient for intake
                  </p>
                </div>
              </div>
            </div>

            {/* Success Alert */}
            {success && (
              <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 sm:px-5 py-3 sm:py-4 text-emerald-700 animate-in fade-in-50 duration-300">
                <CheckCircle2 size={20} className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Success</p>
                  <p className="text-xs sm:text-sm text-emerald-600 mt-0.5">{success}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccess('')}
                  className="text-emerald-400 hover:text-emerald-600 transition-colors flex-shrink-0 mt-0.5"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 sm:px-5 py-3 sm:py-4 text-red-700 animate-in fade-in-50 duration-300">
                <AlertCircle size={20} className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Registration Failed</p>
                  <p className="text-xs sm:text-sm text-red-600 mt-1">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 mt-0.5"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="space-y-5 sm:space-y-6">
              {/* Full Name - Full Width */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Sor Channorakpitou"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* Phone Number - Full Width */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+855 12 345 698"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all"
                  />
                </div>
              </div>

              {/* Two Column Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Reason for Visit */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Reason for Visit
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option>General Consultation</option>
                  <option>Acute Pain / Injury</option>
                  <option>Emergency Admission Wing</option>
                  <option>Follow-up Review</option>
                </select>
              </div>

              {/* Address - Full Width */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Residential Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="House No., Street, Village, City"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base text-gray-900 placeholder-gray-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Register Patient</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Section - Sidebar on desktop, below form on mobile */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-5 sm:p-6 shadow-sm space-y-5 sm:space-y-6">
            {/* Preview Header */}
            <div className="space-y-1 pb-4 sm:pb-5 border-b border-gray-100">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                Preview
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Patient intake data
              </p>
            </div>

            {/* Preview Fields */}
            <div className="space-y-4 sm:space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Full Name
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                  {formData.fullName || <span className="text-gray-400 font-normal">Not specified</span>}
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Phone
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                  {formData.phone || <span className="text-gray-400 font-normal">Not specified</span>}
                </p>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Gender
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {formData.gender}
                </p>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Date of Birth
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  {formData.dob || <span className="text-gray-400 font-normal">YYYY-MM-DD</span>}
                </p>
              </div>

              {/* Reason */}
              <div className="space-y-1.5 pt-2 sm:pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Reason for Visit
                </p>
                <p className="text-sm sm:text-base font-semibold text-blue-700">
                  {formData.reason}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}