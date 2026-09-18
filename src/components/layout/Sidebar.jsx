import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  FileText,
  Award,
  ShieldCheck,
  LayoutGrid,
  HelpCircle,
  Phone,
  Settings,
  Scale,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { label: 'Home', path: '/business/dashboard', icon: Home },
    { label: 'My Applications', path: '/business/applications', icon: FileText },
    { label: 'Certificates', path: '/business/certificates', icon: Award },
    { label: 'Inspections', path: '/business/instruments', icon: ShieldCheck },
    { label: 'Services', path: '/business/applications/new', icon: LayoutGrid },
    { label: 'FAQs', path: '/how-it-works', icon: HelpCircle },
    { label: 'Contact Us', path: '/how-it-works#contact', icon: Phone },
    { label: 'Settings', path: '/business/dashboard#settings', icon: Settings },
  ];

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

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1E40AF] text-white shadow-sm font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
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
