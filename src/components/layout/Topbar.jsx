import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, LogOut, User as UserIcon, Building2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import EmblemIndia from '../common/EmblemIndia';

export const Topbar = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const { role, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const effectiveRole = (user?.role || role || 'BUSINESS').toUpperCase();
  const fallbackName = effectiveRole === 'INSPECTOR'
    ? 'Insp. Vikram Sharma'
    : effectiveRole === 'OFFICER'
    ? 'Shri R. Sen'
    : 'Ramesh Kumar';
  const userName = user?.name || fallbackName;

  const cleanNameForInitials = userName
    .replace(/^(insp\.?|officer|dr\.?|shri|smt\.?|mr\.?|ms\.?|mrs\.?)\s+/i, '')
    .trim();
  const nameParts = cleanNameForInitials.split(/\s+/).filter(Boolean);
  const userInitials = nameParts.length >= 2
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : (cleanNameForInitials.slice(0, 2).toUpperCase() || 'MV');

  const userRoleLabel = effectiveRole === 'BUSINESS'
    ? 'Business Owner'
    : effectiveRole === 'INSPECTOR'
    ? 'Field Inspector'
    : effectiveRole === 'OFFICER'
    ? 'Statutory Officer'
    : 'Business Owner';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#07132B] text-white px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-md border-b border-slate-800">
      {/* Left: Government Emblem & Metra-Verify Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Ashoka Emblem & Government Dept Stack */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <EmblemIndia variant="light" className="w-7 h-9 shrink-0 drop-shadow-sm" />
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold text-white leading-tight tracking-tight">
              Government of India
            </span>
            <span className="text-[9px] text-slate-300 leading-tight hidden sm:block">
              Ministry of Consumer Affairs, Food & Public Distribution
            </span>
            <span className="text-[9px] text-slate-400 leading-tight hidden sm:block">
              Department of Legal Metrology
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-700/80 mx-1 sm:mx-2 hidden sm:block" />

        {/* Brand Title */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight font-heading">
            Metra - Verify
          </span>
          <span className="text-[10px] text-slate-300 leading-tight">
            Legal Metrology Verification Portal
          </span>
        </div>
      </div>

      {/* Right: Notifications, User Profile & Sign Out Option */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell with alert dot */}
        <button
          type="button"
          className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#07132B]" />
        </button>

        {/* User Profile Container with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 select-none rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer group focus:outline-none"
            title="User Profile Menu"
          >
            {/* Avatar Circle with Initials */}
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold border border-slate-700 flex items-center justify-center text-xs tracking-wider ring-1 ring-white/10 group-hover:ring-blue-400 transition-all">
              {userInitials}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight group-hover:text-blue-300 transition-colors">
                {userName}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {userRoleLabel}
              </span>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 ${menuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Interactive Profile Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50 text-slate-200 backdrop-blur-xl animate-fadeIn">
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-xs font-bold text-white leading-tight">{userName}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{user?.email || 'ramesh@kirana.in'}</p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/20">
                  <Building2 className="w-3 h-3" />
                  <span>{userRoleLabel}</span>
                </div>
              </div>

              {user?.organization && (
                <div className="px-4 py-2 text-[11px] text-slate-400 border-b border-slate-800">
                  <span className="block text-slate-500 text-[9px] uppercase font-bold">Organization</span>
                  <span className="text-slate-300 font-medium">{user.organization}</span>
                </div>
              )}

              <div className="p-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sign Out Button Aside User Profile */}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 hover:border-rose-400 text-xs font-bold transition-all cursor-pointer shadow-xs"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
