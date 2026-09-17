import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  QrCode,
  ArrowRight
} from 'lucide-react';

export const PortalEntryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Official Top Minimal Header */}
      <header className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-slate-200">
              Government of India • Ministry of Consumer Affairs, Food & Public Distribution
            </span>
          </div>
          <span className="text-slate-400">Legal Metrology Digital Verification System</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-2xl text-center">
          {/* Logo & Tagline */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-heading">
                METRA-VERIFY
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-blue-700 uppercase">
              VERIFY ONCE. TRUST EVERYWHERE.
            </p>
          </div>

          {/* Centered Main Question */}
          <div className="mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading tracking-tight">
              How would you like to continue?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Choose how you want to use METRA-VERIFY.
            </p>
          </div>

          {/* Exactly Two Primary Options of Equal Visual Importance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {/* OPTION A: PORTAL LOGIN */}
            <div className="bg-white border border-slate-200 hover:border-blue-500/80 rounded-xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight mb-1">
                  PORTAL LOGIN
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  For businesses, inspectors and authorized officers
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span>Login to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* OPTION B: PUBLIC VERIFICATION */}
            <div className="bg-white border border-slate-200 hover:border-emerald-500/80 rounded-xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight mb-1">
                  PUBLIC VERIFICATION
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Verify an instrument certificate without an account
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/verify')}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2"
              >
                <span>Verify Certificate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="py-4 px-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p className="text-slate-600 font-medium">
          METRA-VERIFY • Digital verification for weighing & measuring instruments
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Legal Metrology Act, 2009 • Smart India Hackathon 2026 Prototype
        </p>
      </footer>
    </div>
  );
};

export default PortalEntryPage;
