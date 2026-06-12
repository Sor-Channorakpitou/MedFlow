import React from 'react';
import { User, Lock, Upload } from 'lucide-react';

function ProfileForm({ formData }) {
  // Array of fields mapping directly to your Figma layout fields
  const infoFields = [
    { label: "Full Name", value: formData.fullName },
    { label: "Email Address", value: formData.email },
    { label: "Phone Number", value: formData.phone },
    { label: "Date of Birth", value: formData.dob },
    { label: "Staff ID", value: formData.staffId },
    { label: "Department", value: formData.department }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
      <p className="text-sm text-gray-500 mb-6">Official clinical profile details. Contact administration to modify system credentials.</p>
      
      <div className="space-y-6">
        {/* Avatar Layout - Photo remains changeable by user */}
        <div className="flex items-center space-x-6 pb-4 border-b border-gray-100">
          <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
            <User size={40} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <button 
              type="button" 
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Upload size={16} />
              Change Photo
            </button>
            <p className="text-xs text-gray-400">Recommended: 400×400px. JPG or PNG.</p>
          </div>
        </div>

        {/* Read-Only Grid Framework */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {infoFields.map((field, idx) => (
            <div key={idx} className="bg-gray-50/50 border border-gray-150 rounded-lg p-3 transition-all">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-450 mb-1">
                {field.label}
              </label>
              <div className="text-sm font-medium text-gray-800">
                {field.value || '—'}
              </div>
            </div>
          ))}
        </div>

        {/* Read-Only Privileged Role Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Role & Privileges</label>
          <div className="flex justify-between items-center text-sm text-gray-700">
            <span className="font-medium text-gray-800">Chief Medical Officer (Administrator Privilege)</span>
            <Lock size={16} className="text-gray-400" />
          </div>
          <p className="text-xs text-gray-400 mt-2">Account roles and system-wide configurations are managed strictly by the Central Campus Admin IT team.</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;