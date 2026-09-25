import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Award,
  ShieldCheck,
  LayoutGrid,
  HelpCircle,
  Scale,
  LogOut,
  X,
  LayoutDashboard,
  ClipboardCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Role and domain-specific navigation configurations
// Only options accessible by the respective domain user are included
const DOMAIN_CONFIG = {
  INSPECTOR: {
    title: 'Inspector Telematics',
    tag: 'Field Unit',
    accentDot: 'bg-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    items: [
      { label: 'Dashboard', path: '/inspector/dashboard', icon: LayoutDashboard },
      { label: 'Assignments Queue', path: '/inspector/assignments', icon: ClipboardCheck },
      { label: 'Completed Audits', path: '/inspector/inspections/completed', icon: CheckCircle2 }
    ]
  },
  OFFICER: {
    title: 'Statutory Officer',
    tag: 'Adjudication',
    accentDot: 'bg-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    items: [
      { label: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
      { label: 'Applications Review', path: '/officer/applications', icon: FileText },
      { label: 'Inspections Oversight', path: '/officer/inspections', icon: ShieldCheck },
      { label: 'Certificates', path: '/officer/certificates', icon: Award }
    ]
  },
  BUSINESS: {
    title: 'Applicant Portal',
    tag: 'Trader Desk',
    accentDot: 'bg-blue-400',
    badgeClass: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    items: [
      { label: 'Dashboard', path: '/business/dashboard', icon: Home },
      { label: 'My Applications', path: '/business/applications', icon: FileText },
      { label: 'New Application', path: '/business/applications/new', icon: LayoutGrid },
      { label: 'Instruments', path: '/business/instruments', icon: Scale },
      { label: 'Certificates', path: '/business/certificates', icon: Award },
      { label: 'Help & FAQs', path: '/how-it-works', icon: HelpCircle }
    ]
  }
};

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, role } = useAuth();

  // Determine active domain: prioritize URL path, then fallback to authenticated role
  const getDomain = () => {
    if (location.pathname.startsWith('/inspector')) return 'INSPECTOR';
    if (location.pathname.startsWith('/officer')) return 'OFFICER';
    if (location.pathname.startsWith('/business')) return 'BUSINESS';

    const effectiveRole = (user?.role || role || '').toUpperCase();
    if (effectiveRole === 'INSPECTOR') return 'INSPECTOR';
    if (effectiveRole === 'OFFICER') return 'OFFICER';
    return 'BUSINESS';
  };

  const domain = getDomain();
  const currentConfig = DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.BUSINESS;
  const navItems = currentConfig.items;

  // Accurate active state matching tailored to domain sub-routes
  const isItemActive = (item) => {
    const currentPath = location.pathname;

    // Exact matches for dashboards
    if (
      item.path === '/inspector/dashboard' ||
      item.path === '/officer/dashboard' ||
      item.path === '/business/dashboard'
    ) {
      return currentPath === item.path;
    }

    // Inspector completed audits vs general assignments queue
    if (item.path === '/inspector/inspections/completed') {
      return currentPath.includes('/completed');
    }
    if (item.path === '/inspector/assignments') {
      return (
        (currentPath.startsWith('/inspector/assignments') ||
          currentPath.startsWith('/inspector/inspections')) &&
        !currentPath.includes('/completed')
      );
    }

    // Business applications: avoid highlighting "My Applications" when on "New Application"
    if (item.path === '/business/applications') {
      return (
        currentPath.startsWith('/business/applications') &&
        currentPath !== '/business/applications/new'
      );
    }
    if (item.path === '/business/applications/new') {
      return currentPath === '/business/applications/new';
    }

    // General prefix match for other routes
    return currentPath.startsWith(item.path);
  };

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
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-60 bg-[#07132B] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800/80 select-none`}
      >
        <div className="py-4">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-end px-4 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Domain Category Pill Badge */}
          <div className="px-4 pb-3 mb-2 border-b border-slate-800/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${currentConfig.accentDot}`} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                {currentConfig.title}
              </span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight ${currentConfig.badgeClass}`}>
              {currentConfig.tag}
            </span>
          </div>

          {/* Navigation Items (strictly domain-accessible only) */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#1E40AF] text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Statutory Emblem & Sign Out */}
        <div className="p-4 text-center flex flex-col items-center justify-center border-t border-slate-800/60 space-y-3">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-sky-400 mb-1.5 border border-slate-700/60 shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 block leading-tight">
              Ensuring Accuracy
            </span>
            <span className="text-xs font-bold text-slate-200 block leading-tight mt-0.5">
              Building Trust
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
