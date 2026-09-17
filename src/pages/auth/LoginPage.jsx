import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Camera,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('ramesh@kirana.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('business');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Predefined role profiles for quick hackathon evaluation matching backend seed
  const rolePresets = [
    {
      id: 'business',
      label: 'Business',
      subtitle: 'Trader / Enterprise',
      email: 'ramesh@kirana.in',
      icon: Building2,
      target: '/business/dashboard',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      id: 'inspector',
      label: 'Inspector',
      subtitle: 'Field Calibration Desk',
      email: 'inspector.sharma@delhi.gov.in',
      icon: Camera,
      target: '/inspector/dashboard',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'officer',
      label: 'Officer',
      subtitle: 'Statutory Regulatory Desk',
      email: 'officer.sen@legalmetrology.gov.in',
      icon: ShieldCheck,
      target: '/officer/dashboard',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200'
    }
  ];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    const found = rolePresets.find((p) => p.id === selectedRole);
    if (found) {
      setEmail(found.email);
      setPassword('password123');
    }
    // Clear role error if set
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: '' }));
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

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address (e.g. name@example.com)';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
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
      const res = await login(email.trim(), password, role);

      toast?.success?.(
        `Welcome, ${res.user?.name || 'User'}! Accessing ${role.toUpperCase()} portal...`
      );

      // Explicit role-based redirection as per specification
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 font-heading tracking-tight">
          Sign In to Portal
        </h2>
        <p className="text-xs text-slate-500">
          Enter your credentials and select your stakeholder role
        </p>
      </div>

      {/* Auth Error Banner */}
      {authError && (
        <div
          id="login-error-banner"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1 flex-1">
            <span className="font-medium block">{authError}</span>
            {authError.toLowerCase().includes('backend unavailable') && (
              <p className="text-[11px] text-rose-700 leading-relaxed font-normal">
                Tip: Start the backend server using <code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-[10px]">npm run server</code> or <code className="bg-rose-100 px-1 py-0.5 rounded font-mono text-[10px]">node backend/src/index.js</code>.
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
        {/* Role Selection Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Select Stakeholder Role <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono uppercase">
              Current: {role}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {rolePresets.map((preset) => {
              const Icon = preset.icon;
              const isSelected = role === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleRoleSelect(preset.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center sm:items-start gap-1 relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-2xs ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold block leading-tight ${
                        isSelected ? 'text-blue-900' : 'text-slate-800'
                      }`}
                    >
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-slate-500 hidden sm:block">
                      {preset.subtitle}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
          {errors.role && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.role}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="e.g. rajesh@sharmatraders.com"
              className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-lg shadow-2xs placeholder-slate-400 text-slate-900 transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-slate-700"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="••••••••"
              className={`w-full pl-9 pr-10 py-2 text-sm bg-white border rounded-lg shadow-2xs placeholder-slate-400 text-slate-900 transition-all focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          isLoading={isLoading}
          rightIcon={ArrowRight}
        >
          Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
        </Button>
      </form>

      {/* Quick Evaluation Helper */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>SIH Quick Demonstration Mode</span>
        </div>
        <p className="text-slate-500 leading-normal">
          Click any role above to instantly autofill test credentials:
        </p>
        <div className="grid grid-cols-1 gap-1 text-[10px] font-mono text-slate-600 pt-0.5">
          <span className="truncate">• Business: business@metra-demo.in (or ramesh@kirana.in)</span>
          <span className="truncate">• Inspector: inspector@metra-demo.in (or inspector.sharma@delhi.gov.in)</span>
          <span className="truncate">• Officer: officer@metra-demo.in (or officer.sen@legalmetrology.gov.in)</span>
        </div>
      </div>

      {/* Register Footer */}
      <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
        New commercial trader or scale owner?{' '}
        <Link to="/register" className="font-bold text-blue-600 hover:underline">
          Register Organization
        </Link>
      </div>

      {/* Public Verification Option */}
      <div className="text-center pt-1 text-xs text-slate-500">
        Just need to verify a certificate?{' '}
        <Link to="/verify" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">
          Public Verification →
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
