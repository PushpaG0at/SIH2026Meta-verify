import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { getStoredUserByEmail, formatNameFromEmail } from '../../services/authService';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Shield,
  Check,
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('ramesh@kirana.in');
  const [fullName, setFullName] = useState('Ramesh Kumar');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('business');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailText, setShowEmailText] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Stakeholder role presets
  const rolePresets = [
    {
      id: 'business',
      label: 'Business',
      subtitle: 'Trader / Enterprise',
      email: 'ramesh@kirana.in',
      name: 'Ramesh Kumar',
      icon: Shield,
      target: '/business/dashboard'
    },
    {
      id: 'inspector',
      label: 'Inspector',
      subtitle: 'Field Calibration Desk',
      email: 'inspector.sharma@delhi.gov.in',
      name: 'Insp. Vikram Sharma',
      icon: Camera,
      target: '/inspector/dashboard'
    },
    {
      id: 'officer',
      label: 'Officer',
      subtitle: 'Statutory Regulatory Desk',
      email: 'officer.sen@legalmetrology.gov.in',
      name: 'Shri R. Sen',
      icon: Shield,
      target: '/officer/dashboard'
    }
  ];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    const found = rolePresets.find((p) => p.id === selectedRole);
    if (found) {
      setEmail(found.email);
      setFullName(found.name || '');
      setPassword('password123');
    }
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: '' }));
    }
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));

    // Check if email already exists in persistent storage
    const stored = getStoredUserByEmail(val);
    if (stored?.name) {
      setFullName(stored.name);
      return;
    }

    // Otherwise intelligently derive display name from email
    const derived = formatNameFromEmail(val, role);
    if (derived) {
      if (role === 'inspector' && !derived.toLowerCase().startsWith('insp')) {
        setFullName(`Insp. ${derived}`);
      } else {
        setFullName(derived);
      }
    }
  };

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['business', 'inspector', 'officer'].includes(roleParam.toLowerCase())) {
      handleRoleSelect(roleParam.toLowerCase());
    }
  }, [searchParams]);

  const validate = () => {
    const errs = {};
    if (!role) {
      errs.role = 'Please select a role';
    }

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await login(email.trim(), password, role, fullName.trim());

      toast?.success?.(
        `Welcome, ${res.user?.name || fullName.trim()}! Accessing ${role.toUpperCase()} portal...`
      );

      const normalizedRole = role.toLowerCase();
      if (normalizedRole === 'business') {
        navigate('/business/dashboard');
      } else if (normalizedRole === 'inspector') {
        navigate('/inspector/dashboard');
      } else if (normalizedRole === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthError(err.message || 'Authentication failed. Please verify your credentials and selected role.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentRoleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="space-y-5">
      {/* Title & Subtitle */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
          Sign In to Portal
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-normal">
          Enter your credentials and select your stakeholder role
        </p>
      </div>

      {/* Auth Error Banner */}
      {authError && (
        <div
          id="login-error-banner"
          className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs flex items-start gap-2.5 backdrop-blur-md animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-1 flex-1">
            <span className="font-medium block">{authError}</span>
            {authError.toLowerCase().includes('backend unavailable') && (
              <p className="text-[11px] text-rose-300 leading-relaxed font-normal">
                Tip: Start the backend server using <code className="bg-rose-950/60 px-1 py-0.5 rounded font-mono text-[10px]">npm run server</code> or <code className="bg-rose-950/60 px-1 py-0.5 rounded font-mono text-[10px]">node backend/src/index.js</code>.
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Stakeholder Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-200">
              Select Stakeholder Role <span className="text-sky-400">*</span>
            </label>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 bg-slate-800/80 border border-slate-600/60 px-2.5 py-1 rounded-md font-semibold">
              CURRENT: {role.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {rolePresets.map((preset) => {
              const Icon = preset.icon;
              const isSelected = role === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleRoleSelect(preset.id)}
                  className={`p-3 rounded-2xl text-left transition-all duration-200 flex flex-col items-start gap-1 relative cursor-pointer select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0284c7] via-[#0284c7] to-[#0ea5e9] border border-sky-300/40 shadow-[0_4px_16px_rgba(14,165,233,0.35)] scale-[1.01]'
                      : 'bg-[#dce3ec] hover:bg-[#e4ebf4] border border-transparent text-slate-800'
                  }`}
                >
                  {/* Top-right checkmark on selected card */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center mb-0.5 ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-transparent text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Labels */}
                  <div>
                    <span
                      className={`text-xs sm:text-sm font-bold block leading-tight ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {preset.label}
                    </span>
                    <span
                      className={`text-[10px] block leading-tight mt-0.5 ${
                        isSelected ? 'text-white/85' : 'text-slate-600'
                      }`}
                    >
                      {preset.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.role && (
            <p className="mt-1.5 text-[11px] text-rose-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.role}</span>
            </p>
          )}
        </div>

        {/* Full Name / Stakeholder Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-fullname"
              className="block text-xs font-semibold text-slate-200"
            >
              {role === 'inspector'
                ? 'Inspector Name'
                : role === 'officer'
                ? 'Verification Officer Name'
                : 'Full Name / Enterprise Rep'} <span className="text-sky-400">*</span>
            </label>
            <span className="text-[10px] text-sky-300 font-mono">
              Auto-adapts to email or editable
            </span>
          </div>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              id="login-fullname"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              placeholder={
                role === 'inspector'
                  ? 'e.g. Insp. Vikram Sharma'
                  : role === 'officer'
                  ? 'e.g. Shri R. Sen'
                  : 'e.g. Ramesh Kumar'
              }
              className={`w-full h-11 sm:h-12 pl-10 pr-4 text-sm font-medium bg-[#dce3ec] text-slate-900 rounded-xl sm:rounded-2xl border border-white/20 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? 'border-rose-500 focus:ring-rose-400/40'
                  : 'focus:ring-sky-400/50 hover:bg-[#e4ebf4]'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-[11px] text-rose-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold text-slate-200 mb-1.5"
          >
            Email Address <span className="text-sky-400">*</span>
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              id="login-email"
              type={showEmailText ? 'text' : 'email'}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="e.g. ramesh@kirana.in"
              className={`w-full h-11 sm:h-12 pl-10 pr-10 text-sm font-medium bg-[#dce3ec] text-slate-900 rounded-xl sm:rounded-2xl border border-white/20 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-500 focus:ring-rose-400/40'
                  : 'focus:ring-sky-400/50 hover:bg-[#e4ebf4]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowEmailText(!showEmailText)}
              className="absolute right-3.5 p-1 text-slate-500 hover:text-slate-800 transition-colors"
              title={showEmailText ? 'Hide email' : 'Show email'}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] text-rose-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-slate-200"
            >
              Password <span className="text-sky-400">*</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-sky-400 hover:text-sky-300 hover:underline font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="••••••••"
              className={`w-full h-11 sm:h-12 pl-10 pr-10 text-sm font-medium bg-[#dce3ec] text-slate-900 rounded-xl sm:rounded-2xl border border-white/20 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-rose-500 focus:ring-rose-400/40'
                  : 'focus:ring-sky-400/50 hover:bg-[#e4ebf4]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-slate-500 hover:text-slate-800 transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] text-rose-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Large Gradient Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-12 rounded-xl sm:rounded-2xl mt-2 font-bold text-sm tracking-wide text-white bg-gradient-to-r from-[#0062ff] via-[#0091ff] to-[#00d4ff] shadow-[0_8px_22px_rgba(0,145,255,0.45)] hover:shadow-[0_12px_28px_rgba(0,145,255,0.65)] hover:scale-[1.008] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In as {currentRoleLabel}</span>
              <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Footer Links (Inside the Panel, directly flowing from button with no demonstration box) */}
      <div className="pt-3 space-y-2 text-center text-xs">
        <p className="text-white/90">
          New commercial trader or scale owner?{' '}
          <Link
            to="/register"
            className="font-semibold text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            Register Organization
          </Link>
        </p>

        <p className="text-white/90">
          Just need to verify a certificate?{' '}
          <Link
            to="/verify"
            className="font-semibold text-sky-400 hover:text-sky-300 hover:underline transition-colors"
          >
            Public Verification →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
