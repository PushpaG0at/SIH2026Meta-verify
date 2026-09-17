import React from 'react';
import { ShieldCheck, Lock, ExternalLink, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight font-heading">
                METRA-VERIFY
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Verify Once. Trust Everywhere.
            </p>
            <p className="text-[11px] text-slate-500 leading-normal">
              Digital Verification & Compliance Platform for Weighing and Measuring Instruments.
            </p>
          </div>

          {/* Col 2: Digital Verification Lifecycle */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Verification Lifecycle
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/business/instruments/new" className="hover:text-blue-400">1. Instrument Registration</Link></li>
              <li><Link to="/business/applications/new" className="hover:text-blue-400">2. Statutory Application Filing</Link></li>
              <li><span className="text-slate-500">3. Automated AI Pre-check</span></li>
              <li><Link to="/inspector/dashboard" className="hover:text-blue-400">4. Physical Field Inspection</Link></li>
              <li><Link to="/officer/dashboard" className="hover:text-blue-400">5. Officer Final Adjudication</Link></li>
              <li><Link to="/verify/MV-2026-000123" className="hover:text-blue-400">6. Public QR Verification</Link></li>
            </ul>
          </div>

          {/* Col 3: Portal Roles */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              System Portals
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/business/dashboard" className="hover:text-blue-400">Business & Trader Portal</Link></li>
              <li><Link to="/inspector/dashboard" className="hover:text-blue-400">Field Inspector Telematics</Link></li>
              <li><Link to="/officer/dashboard" className="hover:text-blue-400">Authorized Officer Desk</Link></li>
              <li><Link to="/verify/MV-2026-000123" className="hover:text-blue-400">Public Citizen Search</Link></li>
            </ul>
          </div>

          {/* Col 4: Statutory Compliance Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              Compliance Notice
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              METRA-VERIFY is an academic and hackathon prototype submitted under Smart India Hackathon 2026.
              It is not an official portal of any legal metrology department.
            </p>
            <p className="text-[10px] text-slate-500">
              AI pre-check delivers advisory decision support; legal verification is strictly performed by authorized officers.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 METRA-VERIFY. Built for Smart India Hackathon 2026.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400">About System</Link>
            <span>•</span>
            <Link to="/verify/MV-2026-000123" className="hover:text-slate-400">Registry Search</Link>
            <span>•</span>
            <span className="text-slate-500">SIH Team 36</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
