import React from 'react';
import { uploadProfileImage } from '../../services/userAPI';
import { User, Lock, Upload } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function ProfileForm({ user, onUpload, onUpdateUser }) {
  

  const { updateCurrentUser } = useAuth();
  const infoFields = [
    { label: "Full Name", value: user?.username },
    { label: "Email Address", value: user?.email },
    { label: "Contact Number", value: user?.phone },
    { label: "Date of Birth", value: user?.dob },
    { label: "Staff ID", value: user?.id },
    { label: "Priviledge", value: user?.role },
  ];

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
        const res = await uploadProfileImage(file);

        console.log("UPLOAD RESPONSE:", res);

        updateCurrentUser({
            profileImage: res.data.profileImage,
            profilePublicId: res.data.profileIPublicId,
        });

    } catch (err) {
        console.error(err);
    }
  };


  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
      <p className="text-sm text-gray-500 mb-6">Official clinical profile details. Contact administration to modify system credentials.</p>
      
      <div className="space-y-6">
        {/* Avatar Layout */}
        <div className="flex items-center space-x-6 pb-4 border-b border-gray-100">
          <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
          {user?.profile? 
            ( <img src={user?.profile + "?t=" + Date.now() } alt="profile"/> )
            : 
            (
              <User size={40} strokeWidth={1.5} />
            )}
          </div>
          <div className="space-y-1">
            <button 
              type="button" 
              onClick={() => document.getElementById('profileUpload').click()}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Upload size={16} />
              Change photo
            </button>
            <input
              type="file"
              id="profileUpload"
              className="hidden"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
            <p className="text-xs text-gray-400">Recommended: 400×400px. JPG or PNG.</p>
          </div>
        </div>

        {/* Read-Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {infoFields.map((field, idx) => (
            <div key={idx} className="bg-gray-50/50 border border-gray-150 rounded-lg p-3 transition-all">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-450 mb-1">
                {field.label}
              </label>
              <div className="text-sm font-medium text-gray-500">
                {field.value || 'NA'}
              </div>
            </div>
          ))}
        </div>

        {/* Read-Only Privileged Role Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2">
          <Lock size={16} className="text-gray-400 " />
          <p className="text-xs text-gray-400 mt-2">Account roles and system-wide configurations are managed strictly by the Central Admin in IT team.</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;