import React from 'react';
import { Menu, Bell, Shield, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export const Topbar = ({ onOpenSidebar, title = 'Portal Dashboard' }) => {
  const { role, user, switchRole } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {title}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            METRA-VERIFY • Legal Metrology Digital Verification System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role switcher selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 hidden md:inline">
            Role:
          </span>
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value)}
            className="bg-white text-slate-800 text-xs font-semibold py-1 px-2 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="business">Business (Trader)</option>
            <option value="inspector">Inspector (Field)</option>
            <option value="officer">Officer (Authority)</option>
          </select>
        </div>

        {/* Quick Public Registry Link */}
        <Link
          to="/verify/MV-2026-000123"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Public Registry</span>
        </Link>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={user?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover border border-slate-300"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
