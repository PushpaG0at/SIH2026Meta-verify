import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import {
  User,
  Mail,
  Phone,
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

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'business'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [regError, setRegError] = useState('');

  const roleOptions = [
    {
      id: 'business',
      label: 'Business',
      subtitle: 'Commercial Trader / Scale Owner',
      icon: Building2,
      target: '/business/dashboard'
    },
    {
      id: 'inspector',
      label: 'Inspector',
      subtitle: 'Field Verification Officer',
      icon: Camera,
      target: '/inspector/dashboard'
    },
    {
      id: 'officer',
      label: 'Officer',
      subtitle: 'Statutory Verification Officer',
      icon: ShieldCheck,
      target: '/officer/dashboard'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^(?:\+91|0)?[6-9]\d{9}$/.test(formData.phone.trim().replace(/[\s-]/g, ''))) {
      errs.phone = 'Enter a valid 10-digit mobile number (e.g. 9876543210)';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      errs.role = 'Please select your stakeholder role';
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });

      toast?.success?.(
        `Account registered successfully! Redirecting to ${formData.role.toUpperCase()} portal...`
      );

      // Explicit role-based redirection as per specification
      const normalizedRole = formData.role.toLowerCase();
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
      console.error('Registration error:', err);
      setRegError('Registration failed. Please review your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 font-heading tracking-tight">
          Create Portal Account
        </h2>
        <p className="text-xs text-slate-500">
          Register your profile for METRA-VERIFY digital verification
        </p>
      </div>

      {/* Registration Error Banner */}
      {regError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{regError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Role Selection Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Select Stakeholder Role <span className="text-rose-500">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono uppercase">
              Role: {formData.role}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {roleOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = formData.role === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleRoleSelect(opt.id)}
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
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-500 hidden sm:block">
                      {opt.id === 'business' ? 'Trader / Owner' : opt.label}
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

        {/* Full Name */}
        <div>
          <label
            htmlFor="reg-name"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Full Name / Authorized Person <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="reg-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rajesh Sharma"
              className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-lg shadow-2xs placeholder-slate-400 text-slate-900 transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                  : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Email */}
          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rajesh@enterprise.com"
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

          {/* Phone */}
          <div>
            <label
              htmlFor="reg-phone"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Contact Phone <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-lg shadow-2xs placeholder-slate-400 text-slate-900 transition-all focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        {/* Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Password */}
          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-9 pr-9 py-2 text-sm bg-white border rounded-lg shadow-2xs placeholder-slate-400 text-slate-900 transition-all focus:outline-none focus:ring-2 ${
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="reg-confirmPassword"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                id="reg-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-9 pr-9 py-2 text-sm bg-white border rounded-lg shadow-2xs placeholder-slate-400 text-slate-900 transition-all focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>
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
          Register as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} & Continue
        </Button>
      </form>

      {/* Login link */}
      <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
