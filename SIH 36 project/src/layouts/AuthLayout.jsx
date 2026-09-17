import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Brand Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 text-white mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg ring-2 ring-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-xl font-black tracking-tight font-heading block text-white">
              METRA-VERIFY
            </span>
            <span className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">
              Verify Once. Trust Everywhere.
            </span>
          </div>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          <Outlet />
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Homepage</span>
          </Link>
        </div>

        {/* Security badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Encrypted Session • Smart India Hackathon 2026</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
