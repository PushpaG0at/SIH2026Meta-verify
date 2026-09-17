import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, LogOut, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getRoleDashboardPath } from '../../utils/permissions';

export const AccessDeniedPage = ({ attemptedRole }) => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const userDashboard = getRoleDashboardPath(role);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 text-slate-900 selection:bg-rose-600 selection:text-white">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
              METRA-VERIFY
            </span>
          </div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Statutory Legal Metrology Portal
          </p>
        </div>

        {/* Security Card */}
        <div className="bg-white border border-rose-200 rounded-xl shadow-sm p-6 sm:p-8">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="text-center mb-6">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 mb-2">
              403 • Access Denied
            </span>
            <h1 className="text-xl font-bold text-slate-900 font-heading">
              Restricted Portal Area
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              You do not have authorization to access the{' '}
              <strong className="text-rose-700 uppercase font-semibold">
                {attemptedRole || 'requested'}
              </strong>{' '}
              portal.
            </p>
          </div>

          {/* User Session Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-6 text-xs space-y-1.5">
            <div className="flex justify-between items-center text-slate-500 pb-1.5 border-b border-slate-200/80">
              <span>Current Authenticated Session</span>
              <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                ACTIVE
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">User Account:</span>
              <span className="font-semibold text-slate-800">{user?.name || 'Authenticated User'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="font-mono text-slate-700">{user?.email || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Role:</span>
              <span className="font-bold text-blue-700 uppercase">
                {role || user?.role || 'BUSINESS'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <Link
              to={userDashboard}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Return to {role ? role.toUpperCase() : 'Your'} Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out & Switch Account</span>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-[11px] text-center">
          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Intercepted by METRA-VERIFY Strict Role-Isolation Architecture</span>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
