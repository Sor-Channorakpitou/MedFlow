import { UserCheck } from 'lucide-react';

function ActiveConsultationHeader({ caseData, onFinish }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 my-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm text-left">
      <div className="flex items-center gap-3.5">
        <div className="bg-[#1e293b] text-white p-3 rounded-lg shadow-inner">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900">Active Consultation: {caseData.name}</h2>
          </div>
          <p className="text-[11px] font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">
            PID: {caseData.pid || 'PENDING'} | {caseData.age || 'N/A'} {caseData.gender || ''} | {caseData.room || 'Triage Area'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end sm:self-auto">
        <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm">
          Pause Session
        </button>
        <button 
          onClick={onFinish}
          className="bg-[#0f766e] hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm tracking-wide"
        >
          Finish & Finalize
        </button>
      </div>
    </div>
  );
}

export default ActiveConsultationHeader;