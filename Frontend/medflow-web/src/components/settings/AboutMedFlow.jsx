import React from 'react';
import { ShieldCheck, Server, RefreshCw, ExternalLink, HelpCircle, FileText, CheckCircle } from 'lucide-react';

function AboutMedFlow() {
  return (
    <div className="space-y-8 text-left mt-6 animate-fade-in">
      {/* Hero Branding Section */}
      <div className="text-center py-6 flex flex-col items-center">
        <div className="bg-black text-white p-4 rounded-2xl shadow-sm mb-4">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">MedFlow</h2>
        <p className="text-sm text-gray-500 max-w-md mt-1.5 leading-relaxed">
          The authoritative standard for clinical orchestration and patient data integrity.
        </p>
        <div className="flex gap-2 mt-4 justify-center">
          <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-200">
            v4.12.0 Stable
          </span>
          <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200">
            Enterprise Edition
          </span>
        </div>
      </div>

      {/* Core Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Module 1: System Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 md:col-span-2 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4">
              <Server className="w-4 h-4 text-gray-500" />
              <h3>System Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Current Version</span>
                <span className="text-xs font-bold text-gray-900 block mt-0.5">4.12.0-release.b8273</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Build Date</span>
                <span className="text-xs font-bold text-gray-900 block mt-0.5">2023-10-24 14:02 UTC</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Kernel Engine</span>
                <span className="text-xs font-bold text-gray-900 block mt-0.5">MedCore v9.2</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Architecture</span>
                <span className="text-xs font-bold text-gray-900 block mt-0.5">x86_64 Cloud-Native</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-center text-xs">
            <span className="text-gray-400">Last checked for updates: 2 hours ago</span>
            <button className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white font-medium px-3 py-1.5 rounded-md transition-all shadow-sm cursor-pointer">
              <RefreshCw className="w-3 h-3" />
              Check for Update
            </button>
          </div>
        </div>

        {/* Module 2: Environment Tracking */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4">
              <CheckCircle className="w-4 h-4 text-teal-600" />
              <h3>Environment</h3>
            </div>
            
            <div className="space-y-2.5">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-2.5 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-xs font-bold text-teal-950 block">Production</span>
                  <span className="text-[11px] text-teal-700 block mt-0.5">Active Instance</span>
                </div>
                <div className="w-2.5 h-2.5 bg-teal-600 rounded-full" />
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 opacity-60 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-xs font-bold text-gray-700 block">Staging</span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">Standby</span>
                </div>
                <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="text-[11px] font-medium text-gray-500 pt-4 text-left">
            Region: US-EAST-1 (Northern Virginia)
          </div>
        </div>

      </div>

      {/* Supporting Infrastructure Action Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Options */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-3">
            <HelpCircle className="w-4 h-4 text-gray-500" />
            <h3>Technical Support</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { text: 'Documentation Portal', icon: <FileText className="w-4 h-4 text-gray-400" /> },
              { text: 'Report an Issue', icon: <RefreshCw className="w-4 h-4 text-gray-400" /> },
              { text: 'Contact MedFlow Support', icon: <HelpCircle className="w-4 h-4 text-gray-400" /> }
            ].map((item, idx) => (
              <a key={idx} href="#link" className="flex justify-between items-center py-2.5 group text-xs font-medium text-gray-700 hover:text-black">
                <div className="flex items-center gap-2">
                  {item.icon}
                  {item.text}
                </div>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* Legal & Compliance Boxes */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-sm text-gray-900 border-b border-gray-100 pb-3 mb-4">
            <ShieldCheck className="w-4 h-4 text-gray-500" />
            <h3>Legal & Compliance</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Privacy Policy', detail: 'Last updated Aug 2023' },
              { label: 'Terms of Service', detail: 'Enterprise Agreement' },
              { label: 'SLA Commitment', detail: '99.9% Uptime Guarantee' },
              { label: 'Open Source', detail: 'Third-party notices' }
            ].map((legal, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer text-left">
                <span className="text-xs font-bold text-gray-900 block">{legal.label}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">{legal.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Metadata Footer Text */}
      <div className="border-t border-gray-200 pt-6 text-center space-y-2">
        <div className="flex justify-center gap-4 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
          <span>🛡️ HIPAA Compliant</span>
          <span>•</span>
          <span>SOC2 Type II Certified</span>
          <span>•</span>
          <span>GDPR Ready</span>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          © 2024 MedFlow Clinical Systems Inc. All rights reserved. <br />
          Unauthorized access or use of this clinical platform is strictly prohibited and subject to criminal prosecution.
        </p>
      </div>
    </div>
  );
}

export default AboutMedFlow;