// components/receptionist/PatientCheckout.jsx
import React from 'react';
import { 
  ListOrdered, User, DollarSign, Activity, CreditCard, 
  FileText, Printer, ChevronDown, CheckCircle2, Clock 
} from 'lucide-react';

export default function PatientCheckout() {
  const queue = [
    { name: 'Sarah Jenkins', time: '10:45 AM', doc: 'Dr. Vance • General Clinic', active: true },
    { name: 'Marcus Thorne', time: '11:15 AM', doc: 'Dr. Vance • Follow-up', active: false },
    { name: 'Elena Rodriguez', time: '11:30 AM', doc: 'Dr. Smith • Cardiology', active: false },
  ];

  return (
    <div className="flex flex-1 gap-5 min-h-0 items-start text-left">
      
      {/* COLUMN 1: Queue Stack */}
      <div className="w-64 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col max-h-full shrink-0">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ListOrdered className="w-3.5 h-3.5 text-slate-400" /> Queue (12)
        </h4>
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {queue.map((p, idx) => (
            <div key={idx} className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
              p.active ? 'bg-teal-400/10 border-teal-300 text-teal-900' : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}>
              <div className="flex justify-between items-start font-bold">
                <p className="truncate max-w-[120px]">{p.name}</p>
                <span className="text-[10px] text-slate-400 font-mono font-medium">{p.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">{p.doc}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-white/80 border border-teal-200 text-teal-700">
                <CheckCircle2 className="w-2.5 h-2.5" /> Ready for Payment
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* COLUMN 2: Central Invoice Ledger */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col max-h-full overflow-hidden">
        {/* Patient Metadata Banner */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/40 text-xs grid grid-cols-2 gap-4 shrink-0">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Patient Name</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">Sarah Jenkins</p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Attending Provider: <span className="font-semibold text-slate-700">Dr. Vance</span></p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">ID: #PX-88219</p>
            <p className="text-slate-500 mt-0.5 font-medium flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Oct 24, 2023 • 10:45 AM
            </p>
          </div>
        </div>

        {/* Diagnosis Row Info Bar */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-emerald-50/30 text-xs flex gap-3">
          <Activity className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Diagnosis Summary</span>
            <p className="text-slate-600 leading-normal mt-0.5">Acute Pharyngitis: Symptoms include sore throat, fever, and difficulty swallowing. Patient advised to rest and stay hydrated.</p>
          </div>
        </div>

        {/* Bill Breakdown Items */}
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
                <td className="px-6 py-3.5">Consultation Fee (Primary Care)</td>
                <td className="px-6 py-3.5 text-right font-mono font-semibold text-slate-800">$150.00</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5">Medicine Fee (Amoxicillin 500mg)</td>
                <td className="px-6 py-3.5 text-right font-mono font-semibold text-slate-800">$45.00</td>
              </tr>
              <tr>
                <td className="px-6 py-3.5">Discount (Early Payment Promo)</td>
                <td className="px-6 py-3.5 text-right font-mono font-semibold text-rose-600">-$10.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Grand Total Area */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Balance Due</span>
          <span className="text-xl font-black text-slate-900 font-mono">$185.00</span>
        </div>
      </div>

      {/* COLUMN 3: POS Payment Processing Card */}
      <div className="w-80 bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs space-y-4 shrink-0">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Payment Processing
          </h4>
          <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Awaiting Payment
          </span>
        </div>

        {/* Method Picker */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-600">Payment Method</label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 text-slate-700 font-medium focus:outline-none focus:border-slate-300 appearance-none">
              <option>Credit Card</option>
              <option>Cash</option>
              <option>Insurance</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Amount Box */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-600">Amount Received ($)</label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" defaultValue="185" className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-white font-mono text-base font-bold text-slate-800 focus:outline-none focus:border-slate-300" />
          </div>
        </div>

        {/* Change Box */}
        <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-lg font-mono">
          <span className="text-slate-500 font-medium">Change Due</span>
          <span className="font-bold text-teal-700">$0.00</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold py-2.5 rounded-lg transition hover:bg-slate-900 shadow-sm uppercase tracking-wide">
            <CreditCard className="w-4 h-4" /> Complete Checkout
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1.5 border border-slate-200 font-semibold py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Invoice
            </button>
            <button className="flex items-center justify-center gap-1.5 border border-slate-200 font-semibold py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
              <Printer className="w-3.5 h-3.5 text-slate-400" /> Receipt
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}