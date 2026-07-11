import { User, Upload } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function ProfileSummary({ profileMetadata }) {
  const { name, title, status, lastLogin, location, metrics } = profileMetadata;
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Visual Identity Badge */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
        <div className="w-20 h-20 text-white-bold text-2xl rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          {user?.profileImage? 
            ( <img src={user?.profileImage} alt="profile"/> )
            : 
            (
              <User size={40} strokeWidth={1.5} />
            )}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">{title}</p>
        
        <div className="mt-6 border-t border-gray-100 pt-4 text-left text-sm space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span> {status}
            </span>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-left flex items-start gap-3">
          <span className="text-gray-400 text-base mt-0.5">
            <Upload className="w-4 h-4" />
          </span>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your profile information is visible to other staff members within the MedFlow network to facilitate clinical collaboration.
          </p>
        </div>
      </div>

      {/* Production KPIs Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Session Activity</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Patient Reviews (Today)
            </span>
            <span className="font-bold text-gray-900">{metrics.patientReviewsToday}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Approvals Pending
            </span>
            <div>
              { metrics.approvalsPending === 0 ? 
              <span className="font-bold text-teal-600">{metrics.approvalsPending}</span> 
              : 
              <span className="font-bold text-red-600">{metrics.approvalsPending}</span>
              }
            </div>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span> Confirmed Pending
            </span>
            <span className="font-bold text-teal-600">{metrics.totalConfirmed}</span>
          </div>
            
        </div>
      </div>
    </div>
  );
}

export default ProfileSummary;