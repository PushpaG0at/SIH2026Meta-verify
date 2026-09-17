import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Scale,
  FileText,
  Award,
  ClipboardCheck,
  ShieldCheck,
  CheckCircle2,
  X,
  LogOut,
  ChevronRight,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { role, user, logout } = useAuth();

  const userRole = (user?.role || role || 'BUSINESS').toUpperCase();

  const businessNav = [
    { label: 'Dashboard', path: '/business/dashboard', icon: LayoutDashboard },
    { label: 'Instruments', path: '/business/instruments', icon: Scale },
    { label: 'Applications', path: '/business/applications', icon: FileText },
    { label: 'Certificates', path: '/business/certificates', icon: Award },
  ];

  const inspectorNav = [
    { label: 'Inspector Dashboard', path: '/inspector/dashboard', icon: LayoutDashboard },
    { label: 'Field Assignments', path: '/inspector/assignments', icon: ClipboardCheck },
    { label: 'Completed Inspections', path: '/inspector/inspections/completed', icon: CheckCircle2 },
  ];

  const officerNav = [
    { label: 'Officer Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Verification Queue', path: '/officer/applications', icon: FileText },
    { label: 'Inspections Review', path: '/officer/inspections', icon: ClipboardCheck },
    { label: 'Issued Certificates', path: '/officer/certificates', icon: Award },
  ];

  const navItems = userRole === 'OFFICER' ? officerNav : userRole === 'INSPECTOR' ? inspectorNav : businessNav;

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white font-heading">
                  METRA-VERIFY
                </span>
                <span className="block text-[10px] text-blue-400 font-mono capitalize">
                  {userRole.toLowerCase()} Portal
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Non-editable Role pill badge */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-medium text-slate-300">
                  Role: <strong className="text-white uppercase tracking-wider">{userRole}</strong>
                </span>
              </div>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Authorized User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.organization || user?.designation || user?.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <Link
              to="/ui-kit"
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>UI Kit</span>
            </Link>
            <Link
              to="/about"
              className="text-[11px] text-slate-400 hover:text-white"
            >
              About
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
