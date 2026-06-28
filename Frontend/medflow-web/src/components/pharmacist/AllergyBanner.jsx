import React from 'react';
import { AlertTriangle } from 'lucide-react';

function AllergyBanner({ text }) {
  if (!text || text.includes('NKDA')) return null;

  return (
    <div className="bg-[#eab308] border border-yellow-500 rounded-xl p-4 flex gap-3 text-left shadow-sm">
      <div className="mt-0.5">
        <AlertTriangle className="w-5 h-5 text-black" />
      </div>
      <div>
        <h3 className="text-xs font-black text-black tracking-wide uppercase">VERIFIED DRUG ALLERGIES</h3>
        <p className="text-xs text-black font-semibold mt-0.5 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

export default AllergyBanner;