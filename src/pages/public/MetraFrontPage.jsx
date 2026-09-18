import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  QrCode,
  FileText,
  User,
  ShieldCheck,
  Building,
  Award,
  ArrowRight,
  Target,
  FileCheck,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
  Camera,
  X,
  Phone,
  Mail,
  HelpCircle,
  BookOpen,
  Info,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import EmblemIndia from '../../components/common/EmblemIndia';
import DigitalIndiaLogo from '../../components/common/DigitalIndiaLogo';

export const MetraFrontPage = () => {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  // Hero search tab state
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' | 'qr' | 'track'
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'manual' | 'faqs' | 'contact' | 'services'
  const [fontSize, setFontSize] = useState('normal'); // 'normal' | 'large' | 'small'
  const [language, setLanguage] = useState('English');

  // Handle Verification Search
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();
    if (!cleanQuery) {
      toast?.warning?.('Please enter a Certificate ID, Instrument ID, or Serial Number');
      return;
    }
    navigate(`/verify/${cleanQuery}`);
  };

  // Handle Application Tracking
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const cleanApp = trackingNumber.trim();
    if (!cleanApp) {
      toast?.warning?.('Please enter an Application Number');
      return;
    }
    // If user is business and logged in, take directly to application detail
    if (isAuthenticated && role === 'BUSINESS') {
      navigate(`/business/applications/${cleanApp}`);
    } else {
      // Public verification can also verify application status
      navigate(`/verify/${cleanApp}`);
    }
  };

  // Quick exploration handler with strict role checks and proper login enforcement
  const handleExploreRole = (targetRole) => {
    const normTarget = targetRole.toUpperCase();

    // If user is not authenticated at all
    if (!isAuthenticated || !user) {
      toast?.info?.(
        `${targetRole === 'business' ? 'Business User' : targetRole.toUpperCase()} login is required to access this service.`
      );
      navigate(`/login?role=${targetRole}`);
      return;
    }

    // User is authenticated, check role authority
    const userRole = (role || user.role || '').toUpperCase();
    if (userRole === normTarget) {
      // Authorized! Proceed to respective dashboard
      navigate(`/${targetRole}/dashboard`);
    } else {
      // Role authority mismatch: Prevent access to other dashboards
      toast?.error?.(
        `Access Denied. You are currently authenticated as a ${userRole}. Only ${normTarget} accounts can access this dashboard.`
      );
      // Navigate to trigger protected route / access denied guard
      navigate(`/${targetRole}/dashboard`);
    }
  };

  // Accessibility Font Scaling Classes
  const fontMultiplierClass =
    fontSize === 'large'
      ? 'text-[105%]'
      : fontSize === 'small'
      ? 'text-[95%]'
      : 'text-[100%]';

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans ${fontMultiplierClass}`}>
      {/* =========================================================================
          1. TOP OFFICIAL GOVERNMENT HEADER
          ========================================================================= */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Emblem of India + Department Details */}
          <div className="flex items-center gap-3.5 text-slate-800 text-left">
            <EmblemIndia className="w-10 h-14 shrink-0" variant="dark" />
            <div className="border-l border-slate-300 pl-3.5 leading-tight">
              <div className="text-[13px] font-semibold text-slate-900 tracking-tight font-serif">
                भारत सरकार
              </div>
              <div className="text-[11px] font-medium text-slate-700">
                Government of India
              </div>
              <div className="text-[11px] font-semibold text-slate-900">
                Department of Consumer Affairs
              </div>
              <div className="text-[10.5px] font-bold text-blue-900">
                Legal Metrology
              </div>
            </div>
          </div>

          {/* Center: Metra - Verify Branding */}
          <div className="text-center">
            <Link to="/" className="inline-block group">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                <span className="text-[#0b2540]">Metra - </span>
                <span className="text-blue-600">Verify</span>
              </div>
              <div className="text-[11px] font-medium tracking-wide text-slate-500 mt-0.5">
                Secure &nbsp;|&nbsp; Transparent &nbsp;|&nbsp; Trusted
              </div>
            </Link>
          </div>

          {/* Right: Accessibility, Language, Login/Register */}
          <div className="flex items-center gap-3">
            {/* Font Sizing Accessibility: A+ A A- */}
            <div className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-md px-1.5 py-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  fontSize === 'large' ? 'bg-white shadow-2xs text-blue-700' : 'hover:text-slate-900'
                }`}
                title="Increase Font Size"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  fontSize === 'normal' ? 'bg-white shadow-2xs text-blue-700' : 'hover:text-slate-900'
                }`}
                title="Default Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('small')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  fontSize === 'small' ? 'bg-white shadow-2xs text-blue-700' : 'hover:text-slate-900'
                }`}
                title="Decrease Font Size"
              >
                A-
              </button>
            </div>

            {/* Language Dropdown */}
            <div className="relative inline-block text-xs">
              <button
                type="button"
                onClick={() => setLanguage(language === 'English' ? 'हिन्दी' : 'English')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors font-medium shadow-2xs"
              >
                <span>{language}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Login / Register or Active Session Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/${role?.toLowerCase()}/dashboard`)}
                  className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>{role?.toUpperCase()} Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    toast?.info?.('Signed out successfully');
                  }}
                  className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold shadow-2xs transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. NAVY BLUE NAVIGATION BAR
          ========================================================================= */}
      <nav className="bg-[#0b3b60] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs sm:text-[13px] font-medium">
            <div className="flex items-center space-x-1 sm:space-x-6 overflow-x-auto py-1">
              {/* Home (Active Indicator with cyan bottom border) */}
              <Link
                to="/"
                className="relative py-2.5 px-2 text-white font-semibold border-b-2 border-sky-400 flex items-center gap-1"
              >
                <span>Home</span>
              </Link>

              {/* About Us */}
              <button
                type="button"
                onClick={() => setActiveModal('about')}
                className="py-2.5 px-2 text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                About Us
              </button>

              {/* Services Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setActiveModal('services')}
                  className="py-2.5 px-2 text-slate-200 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Services</span>
                  <ChevronDown className="w-3 h-3 text-slate-300" />
                </button>
              </div>

              {/* User Manual */}
              <button
                type="button"
                onClick={() => setActiveModal('manual')}
                className="py-2.5 px-2 text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                User Manual
              </button>

              {/* FAQs */}
              <button
                type="button"
                onClick={() => setActiveModal('faqs')}
                className="py-2.5 px-2 text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                FAQs
              </button>

              {/* Contact Us */}
              <button
                type="button"
                onClick={() => setActiveModal('contact')}
                className="py-2.5 px-2 text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                Contact Us
              </button>
            </div>

            {/* Quick Demo Pill */}
            <div className="hidden lg:flex items-center gap-2 text-[11px] text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SIH 2026 Legal Metrology Portal</span>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          3. HERO SECTION (Split background with Inspector on right & Verification Box)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-200">
        {/* Background Image: Inspector inspecting scale */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity md:mix-blend-normal md:opacity-100"
          style={{
            backgroundImage: "url('/images/hero-inspector.jpg')",
            backgroundPosition: 'right 20% center'
          }}
        />

        {/* Gradient Overlay ensuring text and card are sharp and readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 md:via-slate-900/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 z-10">
          <div className="max-w-2xl text-left space-y-6">
            {/* Main Headline matching reference */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Verify. Inspect.{' '}
              <span className="text-sky-400">Trust.</span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal max-w-xl">
              Ensure the accuracy and reliability of weighing and measuring instruments.
              Check the verification status, apply for services and access digital
              certificates — all in one place.
            </p>

            {/* Floating Interactive 3-Tab Card */}
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-900 mt-6">
              {/* Tab Headers */}
              <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs sm:text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('verify')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'verify'
                      ? 'border-blue-600 text-blue-600 bg-white shadow-2xs font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>Verify Instrument</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'qr'
                      ? 'border-blue-600 text-blue-600 bg-white shadow-2xs font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>Scan QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('track')}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'track'
                      ? 'border-blue-600 text-blue-600 bg-white shadow-2xs font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Track Application</span>
                </button>
              </div>

              {/* Tab 1: Verify Instrument */}
              {activeTab === 'verify' && (
                <div className="p-5 sm:p-6 space-y-3">
                  <form onSubmit={handleVerifySubmit} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Enter Certificate ID / Instrument ID / Registration Number"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg shadow-2xs placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg bg-[#0066cc] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                      >
                        <span>Verify</span>
                      </button>
                    </div>

                    <p className="text-[11.5px] text-slate-500 leading-normal text-left">
                      You can also scan the QR code on the instrument or certificate for quick verification.
                    </p>

                    {/* Quick Demo Shortcuts */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-600">Sample Records:</span>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('MV-2026-000123')}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono hover:bg-emerald-100 transition-colors"
                      >
                        MV-2026-000123 (Valid)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('MV-2025-000089')}
                        className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono hover:bg-amber-100 transition-colors"
                      >
                        MV-2025-000089 (Expired)
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 2: Scan QR Code */}
              {activeTab === 'qr' && (
                <div className="p-5 sm:p-6 text-center space-y-4">
                  <div className="max-w-md mx-auto p-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">QR Code Camera Scanner</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Point your device camera at the tamper-evident QR stamp on the scale or certificate
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/verify/MV-2026-000123')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Simulate QR Scan (MV-2026-000123)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Track Application */}
              {activeTab === 'track' && (
                <div className="p-5 sm:p-6 space-y-3">
                  <form onSubmit={handleTrackSubmit} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter Application ID / Ack No. (e.g. APP-2026-001)"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg shadow-2xs placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg bg-[#0066cc] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors shrink-0 cursor-pointer"
                      >
                        Track Status
                      </button>
                    </div>
                    <p className="text-[11.5px] text-slate-500">
                      Check real-time statutory review status, inspector field assignment, and decision timeline.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. QUICK SERVICES SECTION (Replacing Public User with Business User)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Section Heading with Blue Underline Accent */}
        <div className="text-left mb-10">
          <div className="inline-block relative pb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Quick Services
            </h2>
            {/* Blue underline accent */}
            <div className="absolute bottom-0 left-0 w-12 h-1 bg-blue-600 rounded-full" />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Choose how you want to access our services
          </p>
        </div>

        {/* 3 Quick Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: BUSINESS USER (User instruction: instead of public user write business user . and for that proper login required .) */}
          <div className="bg-[#f0f7ff] border border-[#d0e5ff] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              {/* Circular Avatar Icon in Blue Circle */}
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <User className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Business User
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  Verify instruments, apply for verification, access digital certificates, track applications.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleExploreRole('business')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group-hover:gap-2 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: INSPECTOR */}
          <div className="bg-[#f0fdf4] border border-[#d1fae5] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              {/* Circular Icon in Green Circle: Peaked Officer Cap / Shield */}
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <UserCheck className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Inspector
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  Conduct field verification, record inspections, update status.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleExploreRole('inspector')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition-colors group-hover:gap-2 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: OFFICER */}
          <div className="bg-[#faf5ff] border border-[#e9d5ff] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              {/* Circular Icon in Purple Circle: Government Pillars */}
              <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Building className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Officer
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  Monitor applications, manage certificates, view reports and analytics.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => handleExploreRole('officer')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors group-hover:gap-2 cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. HOW METRA VERIFY WORKS (6 Steps Workflow)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full border-t border-slate-200">
        {/* Section Heading */}
        <div className="text-left mb-12">
          <div className="inline-block relative pb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How Metra Verify Works
            </h2>
            <div className="absolute bottom-0 left-0 w-12 h-1 bg-blue-600 rounded-full" />
          </div>
          <p className="text-sm text-slate-500 mt-2">
            A simple and transparent process for a safer and more accurate tomorrow.
          </p>
        </div>

        {/* 6 Connected Steps */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative">
          {/* Step 1: Application Submitted */}
          <div className="flex flex-col items-center text-center space-y-3 group">
            <div className="relative">
              <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                1
              </span>
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FileText className="w-7 h-7" />
              </div>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 max-w-[130px]">
              Application Submitted
            </h4>
          </div>

          {/* Step 2: Inspector Assigned */}
          <div className="flex flex-col items-center text-center space-y-3 group">
            <div className="relative">
              <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                2
              </span>
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                <UserCheck className="w-7 h-7" />
              </div>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 max-w-[130px]">
              Inspector Assigned
            </h4>
          </div>

          {/* Step 3: Inspection Conducted */}
          <div className="flex flex-col items-center text-center space-y-3 group">
            <div className="relative">
              <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                3
              </span>
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Search className="w-7 h-7" />
              </div>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 max-w-[130px]">
              Inspection Conducted
            </h4>
          </div>

          {/* Step 4: Verification Completed */}
          <div className="flex flex-col items-center text-center space-y-3 group">
            <div className="relative">
              <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                4
              </span>
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 max-w-[130px]">
              Verification Completed
            </h4>
          </div>

          {/* Step 5: Approved by Officer */}
          <div className="flex flex-col items-center text-center space-y-3 group">
            <div className="relative">
              <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                5
              </span>
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Award className="w-7 h-7" />
              </div>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 max-w-[130px]">
              Approved by Officer
            </h4>
          </div>

          {/* Step 6: Certificate Issued */}
          <div className="flex flex-col items-center text-center space-y-3 group">
            <div className="relative">
              <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                6
              </span>
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FileCheck className="w-7 h-7" />
              </div>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 max-w-[130px]">
              Certificate Issued
            </h4>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. VERIFY BEFORE YOU TRUST SECTION (Scale & Weights Image + 3 Features)
          ========================================================================= */}
      <section className="bg-slate-100/60 border-t border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: High Resolution Photo of Precision Digital Scale & Weights */}
            <div className="overflow-hidden rounded-2xl border border-slate-300 shadow-md bg-white">
              <img
                src="/images/scale-weights.jpg"
                alt="Precision digital weighing scale with calibrated standard test weights"
                className="w-full h-auto object-cover hover:scale-102 transition-transform duration-500"
              />
            </div>

            {/* Right: Feature Description */}
            <div className="text-left space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                REAL INSTRUMENTS. REAL IMPACT.
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Verify Before You Trust
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Check whether a weighing or measuring instrument has a valid government verification record.
              </p>

              {/* 3 Horizontal Feature Badges matching reference image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                {/* Feature 1: Accurate Measurements */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    Accurate Measurements
                  </span>
                </div>

                {/* Feature 2: Fair Trade & Consumer Safety */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    Fair Trade & Consumer Safety
                  </span>
                </div>

                {/* Feature 3: Compliant with Legal Metrology */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    Compliant with Legal Metrology
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. DARK NAVY BLUE OFFICIAL FOOTER
          ========================================================================= */}
      <footer className="bg-[#0b2540] text-slate-300 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-700/80">
            {/* Left: Indian Emblem & Govt Info */}
            <div className="flex items-center gap-3.5 text-left">
              <EmblemIndia className="w-9 h-12 shrink-0" variant="light" />
              <div className="leading-snug text-slate-200 text-xs">
                <div className="font-semibold text-white">Government of India</div>
                <div className="text-slate-300">Department of Consumer Affairs</div>
                <div className="font-bold text-blue-300">Legal Metrology</div>
              </div>
            </div>

            {/* Center: Nav links */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-slate-300">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>|</span>
              <button type="button" onClick={() => setActiveModal('about')} className="hover:text-white transition-colors cursor-pointer">About Us</button>
              <span>|</span>
              <button type="button" onClick={() => setActiveModal('services')} className="hover:text-white transition-colors cursor-pointer">Services</button>
              <span>|</span>
              <button type="button" onClick={() => setActiveModal('manual')} className="hover:text-white transition-colors cursor-pointer">Help</button>
              <span>|</span>
              <button type="button" onClick={() => setActiveModal('contact')} className="hover:text-white transition-colors cursor-pointer">Contact Us</button>
            </div>

            {/* Right: Follow Us & Digital India Logo */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="text-xs text-slate-300 font-semibold">Follow Us</span>
                {/* YouTube */}
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors" title="YouTube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                {/* X / Twitter */}
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors" title="X">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors" title="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.667.417-1.667 1.772v2.208h4.527l-.634 3.667h-3.893v7.98c-1.467.247-2.973.376-4.509.376-1.536 0-3.042-.129-4.508-.376z"/></svg>
                </a>
                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors" title="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.67a1.6 1.6 0 0 0-1.6 1.6c0 .88.72 1.6 1.6 1.6a1.6 1.6 0 0 0 1.6-1.6c0-.88-.72-1.6-1.6-1.6z"/></svg>
                </a>
              </div>

              {/* Digital India Logo */}
              <DigitalIndiaLogo className="h-8" light={true} />
            </div>
          </div>

          {/* Bottom Copyright line matching reference */}
          <div className="pt-6 text-center text-[11px] text-slate-400">
            © 2025 Metra - Verify. All rights reserved. &nbsp;|&nbsp; Powered by Government of India
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INFORMATION & GUIDELINES MODALS
          ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-900 text-left relative animate-in fade-in zoom-in duration-200">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* About Modal */}
            {activeModal === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">About Metra - Verify</h3>
                    <p className="text-xs text-slate-500">Legal Metrology Verification Platform</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Metra - Verify is a unified digital trust system built for the Department of Consumer Affairs, Legal Metrology Division. It modernizes the statutory calibration, stamping, and digital certification of all commercial weighing and measuring instruments across India.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-semibold text-slate-800">Core Objectives:</span>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
                    <li>Complete elimination of paper stamp forgery via SHA-256 cryptographic proofs.</li>
                    <li>GPS geofenced telemetry for field calibration inspections.</li>
                    <li>Universal public QR verification for retail shoppers and businesses.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* User Manual Modal */}
            {activeModal === 'manual' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">User Manual & Guidelines</h3>
                    <p className="text-xs text-slate-500">Operating procedures for all stakeholders</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <p><strong>1. Business User:</strong> Register equipment specifications, attach invoice, and track timeline.</p>
                  <p><strong>2. Field Inspector:</strong> Review mobile checklist, perform standard test weight audits, and lock GPS evidence.</p>
                  <p><strong>3. Authorized Officer:</strong> Review OCR discrepancy matrix, approve verification, and issue QR certificate.</p>
                </div>
              </div>
            )}

            {/* FAQs Modal */}
            {activeModal === 'faqs' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Frequently Asked Questions</h3>
                    <p className="text-xs text-slate-500">Quick answers on metrology verification</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800 block">How long is a verification certificate valid?</strong>
                    <span>Standard commercial certificates are valid for 1 calendar year under the Legal Metrology Act, 2009.</span>
                  </div>
                  <div>
                    <strong className="text-slate-800 block">Can anyone verify a scale QR code?</strong>
                    <span>Yes! Any citizen can scan the physical QR sticker using any smartphone camera without needing an account.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Modal */}
            {activeModal === 'contact' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Contact Legal Metrology</h3>
                    <p className="text-xs text-slate-500">Helpdesk & Grievance Redressal</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>support@metra-verify.gov.in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>National Consumer Toll-Free: 1800-11-4000 (09:30 AM to 05:30 PM)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Services Modal */}
            {activeModal === 'services' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Metrology Services</h3>
                    <p className="text-xs text-slate-500">Departmental Services</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      handleExploreRole('business');
                    }}
                    className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-colors"
                  >
                    <strong className="block text-slate-800">Business Registration & Instrument Stamping</strong>
                    <span className="text-[11px] text-slate-500">File annual verification applications for commercial weighing equipment.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null);
                      navigate('/verify');
                    }}
                    className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-colors"
                  >
                    <strong className="block text-slate-800">Universal Public Certificate Search</strong>
                    <span className="text-[11px] text-slate-500">Check validity of any registered calibration certificate.</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetraFrontPage;
