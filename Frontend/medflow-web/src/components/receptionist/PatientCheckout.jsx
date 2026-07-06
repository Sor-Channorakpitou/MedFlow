// components/receptionist/PatientCheckout.jsx
import React, { useMemo } from 'react';
import { 
  ListOrdered, User, DollarSign, Activity, CreditCard, 
  FileText, Printer, ChevronDown, CheckCircle2, Clock 
} from 'lucide-react';
import { useWorkflow } from '../../hooks/useWorkFlow';

export default function PatientCheckout({ selectedAppId, onSelectAppId, onFinalizeCheckout }) {
  const { appointments = [], patients = [], prescriptions = [] } = useWorkflow();

  // Filter out patients who are currently waiting at checkout counter line
  const liveCheckoutQueue = useMemo(() => {
    return appointments
      .filter((app) => app.workflow_step === "AWAITING_CHECKOUT")
      .map((app) => {
        const patientInfo = patients.find((p) => p.patient_id === app.patient_id);
        return {
          id: app.appointment_id,
          name: patientInfo ? patientInfo.full_name : "Unknown Patient",
          patientId: app.patient_id,
          time: new Date(app.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          doc: "Ready for Settlement"
        };
      });
  }, [appointments, patients]);

  // Handle active targeted ledger profile computed rows
  const activeInvoice = useMemo(() => {
    const targetId = selectedAppId || liveCheckoutQueue[0]?.id;
    if (!targetId) return null;

    const app = appointments.find(a => a.appointment_id === targetId);
    const patientInfo = patients.find(p => p.patient_id === app?.patient_id);
    const rxInfo = prescriptions.find(p => p.appointment_id === targetId);

    return {
      appointmentId: targetId,
      name: patientInfo ? patientInfo.full_name : "Patient Profile",
      patientId: app?.patient_id || "N/A",
      diagnosis: rxInfo ? rxInfo.diagnosis : "Routine medical evaluation checkup.",
      consultFee: 150.00,
      pharmacyFee: rxInfo ? 35.00 : 0.00,
      total: rxInfo ? 185.00 : 150.00
    };
  }, [selectedAppId, liveCheckoutQueue, appointments, patients, prescriptions]);

  const processPaymentSubmission = () => {
    if (!activeInvoice) return;
    onFinalizeCheckout(activeInvoice.appointmentId);
    alert(`Transaction completed successfully for ${activeInvoice.name}. Receipt printed.`);
    onSelectAppId(''); // Reset selection tracking clear
  };

  return (
    <div className="flex flex-1 gap-5 min-h-0 items-start text-left w-full h-full">
      
      {/* COLUMN 1: Active Queue Stack */}
      <div className="w-64 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col h-full shrink-0 overflow-hidden">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ListOrdered className="w-3.5 h-3.5 text-slate-400" /> Billing Queue ({liveCheckoutQueue.length})
        </h4>
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {liveCheckoutQueue.map((p) => (
            <div 
              key={p.id} 
              onClick={() => onSelectAppId(p.id)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                (selectedAppId === p.id || (!selectedAppId && liveCheckoutQueue[0]?.id === p.id))
                  ? 'bg-teal-400/10 border-teal-300 text-teal-900 font-bold' 
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start font-bold">
                <p className="truncate max-w-[120px]">{p.name}</p>
                <span className="text-[10px] text-slate-400 font-mono font-medium">{p.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">ID: {p.patientId}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-white/80 border border-teal-200 text-teal-700">
                <CheckCircle2 className="w-2.5 h-2.5" /> Ready for Payment
              </span>
            </div>
          ))}
          {liveCheckoutQueue.length === 0 && (
            <p className="text-slate-400 text-xs text-center mt-8">No patients waiting at cashier.</p>
          )}
        </div>
      </div>

      {activeInvoice ? (
        <>
          {/* COLUMN 2: Central Invoice Ledger */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/40 text-xs grid grid-cols-2 gap-4 shrink-0">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Patient Name</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{activeInvoice.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">ID: {activeInvoice.patientId}</p>
              </div>
            </div>

            <div className="px-4 py-2.5 border-b border-slate-100 bg-emerald-50/30 text-xs flex gap-3">
              <Activity className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Diagnosis Track Summary</span>
                <p className="text-slate-600 leading-normal mt-0.5">{activeInvoice.diagnosis}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/60 sticky top-0">
                    <th className="px-6 py-2.5">Description</th>
                    <th className="px-6 py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="px-6 py-3.5">Consultation Outpatient Clinical Fee</td>
                    <td className="px-6 py-3.5 text-right font-mono font-semibold text-slate-800">${activeInvoice.consultFee.toFixed(2)}</td>
                  </tr>
                  {activeInvoice.pharmacyFee > 0 && (
                    <tr>
                      <td className="px-6 py-3.5">Pharmacy Medication Dispensation Charge</td>
                      <td className="px-6 py-3.5 text-right font-mono font-semibold text-slate-800">${activeInvoice.pharmacyFee.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Balance Due</span>
              <span className="text-xl font-black text-slate-900 font-mono">${activeInvoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* COLUMN 3: POS Payment Processing Card */}
          <div className="w-80 bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs space-y-4 shrink-0 h-full">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Payment Processing
              </h4>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Payment Method</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 text-slate-700 font-medium focus:outline-none focus:border-slate-300 appearance-none">
                  <option>Credit Card</option>
                  <option>Cash</option>
                  <option>Insurance Panel</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600">Amount Received ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={activeInvoice.total} disabled className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 text-slate-500 font-mono text-base font-bold" />
              </div>
            </div>

            <button   
              onClick={processPaymentSubmission}
              className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-lg transition shadow-sm uppercase tracking-wide"
            >
              <CreditCard className="w-4 h-4" /> Complete Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 font-medium shadow-sm">
          No transactions pending settlement at this time.
        </div>
      )}
    </div>
  );
}