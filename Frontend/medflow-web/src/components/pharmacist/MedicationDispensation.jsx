import { CheckCircle } from "lucide-react";

function MedicationDispensation({ patient, onFinalize }) {
  const filledCount = patient.medications.filter((m) => m.isDispensed).length;
  const allFilled = filledCount === patient.medications.length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden justify-between">
      {/* 1. Header Metadata Section */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="text-left">
          <h3 className="text-sm font-bold text-gray-900">
            Medication Dispensation
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Patient:{" "}
            <span className="font-bold text-gray-700">{patient.name}</span> |
            DOB: {patient.dob}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] tracking-wider uppercase text-gray-400 font-bold block">
            STATUS
          </span>
          <span className="text-xs font-bold text-gray-900 block mt-0.5">
            {filledCount}/{patient.medications.length} Filled
          </span>
        </div>
      </div>

      {/* 2. Core Medication Loop Framework */}
      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
        {patient.medications.map((med) => (
          <div
            key={med.id}
            className="border border-gray-200 rounded-xl p-4 bg-white hover:border-gray-300 transition-colors flex justify-between items-center text-left shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <div className="space-y-2 flex-1 pr-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900">{med.name}</h4>
                {med.type && (
                  <span className="bg-gray-100 text-gray-600 font-semibold border border-gray-200 text-[9px] px-2 py-0.5 rounded-full">
                    {med.type}
                  </span>
                )}
              </div>

              {/* Clinical usage guide message wrapper */}
              <div className="bg-gray-50 border border-gray-150 rounded-lg p-2.5 max-w-xl">
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  {med.instruction}
                </p>
              </div>

              {/* Quantity metrics trackers */}
              <div className="flex gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-wide pt-1">
                <span>
                  Qty:{" "}
                  <span className="text-gray-700 font-black">
                    {med.qty} Tablets
                  </span>
                </span>
              
              
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Operational Dispatch Action Tray Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={onFinalize}
          className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-lg text-xs tracking-wide shadow-sm transition-all ${"bg-gray-700 hover:bg-gray-800 text-white cursor-pointer"}`}
        >
          <CheckCircle className="w-4 h-4" />
          Finalize & Discharge Patient
        </button>
      </div>
    </div>
  );
}

export default MedicationDispensation;
