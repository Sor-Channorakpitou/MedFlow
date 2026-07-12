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
    { label: "Privilege", value: user?.role },
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
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      {/* Card Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Personal Information
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Official clinical profile details. Contact administration to modify system credentials.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-gray-100">
          {/* Avatar Container - Responsive sizing */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 border border-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-400 overflow-hidden">
              {user?.profile ? (
                <img
                  src={`${user?.profile}?t=${Date.now()}`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} strokeWidth={1.5} className="sm:w-10 sm:h-10" />
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="flex-1 space-y-2">
            <button
              type="button"
              onClick={() => document.getElementById('profileUpload').click()}
              className="inline-flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Upload size={16} strokeWidth={2} />
              <span>Change photo</span>
            </button>

            <input
              type="file"
              id="profileUpload"
              className="hidden"
              accept="image/*"
              onChange={handleProfileImageChange}
            />

            <p className="text-xs text-gray-500">
              Recommended: 400×400px. JPG or PNG.
            </p>
          </div>
        </div>

        {/* Info Fields Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {infoFields.map((field, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 transition-colors"
            >
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                {field.label}
              </label>
              <p className="text-sm sm:text-base font-medium text-gray-900">
                {field.value || 'N/A'}
              </p>
            </div>
          ))}
        </div>

        {/* Read-Only Privilege Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-5 flex gap-3">
          <Lock size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-blue-900">
            Account roles and system-wide configurations are managed strictly by the Central Admin in IT team.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;