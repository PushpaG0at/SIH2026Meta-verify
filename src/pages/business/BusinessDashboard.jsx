import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  FileText,
  Clock,
  CheckCircle2,
  Award,
  PlusCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Eye,
  QrCode,
  ExternalLink,
  User,
  Search,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { instrumentService } from '../../services/instrumentService';
import { certificateService } from '../../services/certificateService';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import RiskBadge from '../../components/ui/RiskBadge';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';

export const BusinessDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quickVerifyId, setQuickVerifyId] = useState('');
  const [applications, setApplications] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (quickVerifyId.trim()) {
      navigate(`/verify/${quickVerifyId.trim()}`);
    }
  };

  const cleanName = user?.name
    ? user.name.replace(/^(shri|dr\.?|mr\.?|ms\.?|mrs\.?)\s+/i, '').trim()
    : '';
  const welcomeName = cleanName ? cleanName.split(' ')[0] : (user?.name?.split(' ')[0] || 'Trader');

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [apps, insts, certs] = await Promise.all([
          applicationService.getApplications(),
          instrumentService.getInstruments(),
          certificateService.getCertificates()
        ]);
        const appList = apps || [];
        const instList = insts || [];
        const certList = certs || [];

        setApplications(appList);
        setInstruments(instList);
        setCertificates(certList);

        if (appList.length > 0) {
          setSelectedAppId((prev) => (appList.some((a) => a.id === prev) ? prev : appList[0].id));
        } else {
          setSelectedAppId(null);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  // Compute live operational metrics dynamically from user's records (all 0 for new business owners)
  const stats = {
    totalInstruments: instruments.length,
    pendingApplications: applications.filter((app) =>
      ['SUBMITTED', 'AI_REVIEWED', 'PENDING', 'DRAFT', 'PAYMENT_PENDING', 'PAYMENT_DONE'].includes(app.status?.toUpperCase())
    ).length,
    underInspection: applications.filter((app) =>
      ['INSPECTION', 'INSPECTION_ASSIGNED', 'INSPECTION_SCHEDULED', 'INSPECTION_COMPLETED', 'OFFICER_REVIEW', 'PENDING_REVIEW', 'ASSIGNED'].includes(app.status?.toUpperCase())
    ).length,
    approved: applications.filter((app) =>
      ['APPROVED', 'OFFICER_APPROVED', 'VERIFIED'].includes(app.status?.toUpperCase())
    ).length,
    activeCertificates: certificates.length
  };

  // Selected application for live interactive timeline
  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0] || null;
  const activeCert = certificates.length > 0 ? certificates[0] : null;

  // 8-stage statutory legal metrology lifecycle timeline steps
  const timelineStages = activeApp ? [
    {
      num: 1,
      title: 'Digital Instrument Registration',
      actor: activeApp.businessName || user?.name || 'Authorized Owner',
      date: activeApp.submissionDate || 'Recent',
      desc: `Asset registered with ID ${activeApp.instrumentId || activeApp.id}.`,
      status: 'completed'
    },
    {
      num: 2,
      title: 'Document & Invoice Upload',
      actor: 'Business Licensee',
      date: activeApp.submissionDate || 'Recent',
      desc: `${activeApp.documents?.length || 2} statutory document(s) uploaded and verified.`,
      status: 'completed'
    },
    {
      num: 3,
      title: 'AI Pre-check & OCR Scrutiny',
      actor: 'METRA-AI Vision Engine',
      date: activeApp.submissionDate || 'Recent',
      desc: `Automated scrutiny complete. Advisory risk evaluated as ${activeApp.riskLevel || 'Low'} (${activeApp.riskScore || 18}/100).`,
      status: ['AI_REVIEWED', 'INSPECTION_ASSIGNED', 'INSPECTION_SCHEDULED', 'INSPECTION_COMPLETED', 'OFFICER_REVIEW', 'OFFICER_APPROVED', 'APPROVED'].includes(activeApp.status?.toUpperCase()) ? 'completed' : 'pending'
    },
    {
      num: 4,
      title: 'Statutory Fee Clearance',
      actor: 'e-Treasury Gateway',
      date: activeApp.submissionDate || 'Recent',
      desc: 'Government scheduled verification fee received.',
      status: activeApp.status !== 'DRAFT' ? 'completed' : 'pending'
    },
    {
      num: 5,
      title: 'Inspector Assignment',
      actor: 'Legal Metrology Dispatch',
      date: 'Scheduled',
      desc: activeApp.assignedInspector ? `Field Inspector ${activeApp.assignedInspector} dispatched.` : 'Awaiting inspector dispatch.',
      status: ['INSPECTION_ASSIGNED', 'INSPECTION_SCHEDULED', 'INSPECTION_COMPLETED', 'OFFICER_REVIEW', 'OFFICER_APPROVED', 'APPROVED'].includes(activeApp.status?.toUpperCase()) ? 'completed' : 'pending'
    },
    {
      num: 6,
      title: 'On-Site Geofenced Audit',
      actor: activeApp.assignedInspector || 'Field Inspector',
      date: 'Pending',
      desc: activeApp.inspection ? 'Physical verification with standard weights completed.' : 'On-site physical test with standard weights.',
      status: ['INSPECTION_COMPLETED', 'OFFICER_REVIEW', 'OFFICER_APPROVED', 'APPROVED'].includes(activeApp.status?.toUpperCase()) ? 'completed' : 'pending'
    },
    {
      num: 7,
      title: 'Officer Adjudication',
      actor: activeApp.assignedOfficer || 'Dr. Anita Deshmukh (Officer)',
      date: 'Pending',
      desc: ['APPROVED', 'OFFICER_APPROVED'].includes(activeApp.status?.toUpperCase()) ? 'Review completed. Statutory clearance granted.' : 'Officer review & adjudication.',
      status: ['APPROVED', 'OFFICER_APPROVED'].includes(activeApp.status?.toUpperCase()) ? 'completed' : 'pending'
    },
    {
      num: 8,
      title: 'Digital QR Certificate Issued',
      actor: 'State Directorate',
      date: 'Pending',
      desc: activeApp.certificateId ? `Certificate #${activeApp.certificateId} sealed with cryptographic signature.` : 'Digital certificate issued upon officer sign-off.',
      status: (activeApp.status === 'APPROVED' || activeApp.status === 'OFFICER_APPROVED' || activeApp.certificateId) ? 'completed' : 'pending'
    }
  ] : [];

  const appColumns = [
    {
      header: 'Application ID',
      accessor: 'id',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAppId(row.id);
          }}
          className={`font-mono text-xs font-bold px-2 py-1 rounded transition-colors text-left flex items-center gap-1 ${
            row.id === activeApp?.id
              ? 'bg-blue-100 text-blue-800'
              : 'text-blue-600 hover:underline'
          }`}
        >
          {row.id}
          <ChevronRight className="w-3 h-3 opacity-60" />
        </button>
      )
    },
    {
      header: 'Instrument Type',
      accessor: 'instrumentType',
      render: (row) => (
        <div>
          <span className="text-xs font-medium text-slate-800 block">{row.instrumentType}</span>
          <span className="font-mono text-[10px] text-slate-400">{row.instrumentId}</span>
        </div>
      )
    },
    {
      header: 'Submitted',
      accessor: 'submissionDate',
      render: (row) => <span className="text-xs text-slate-500">{row.submissionDate}</span>
    },
    {
      header: 'AI Risk Score',
      accessor: 'riskLevel',
      render: (row) => <RiskBadge level={row.riskLevel} score={row.riskScore} />
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/business/applications/${row.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Dossier</span>
          </Link>
          {row.certificateId && (
            <Link
              to={`/business/certificates/${row.certificateId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </Link>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* 1. Official Hero Banner matching Image 2 */}
      <div className="bg-gradient-to-r from-[#031130] via-[#092257] to-[#041338] rounded-2xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-blue-900/40">
        {/* Ambient glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Legal Metrology Tag, Heading, Description */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400 block font-mono">
              LEGAL METROLOGY
            </span>
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black tracking-tight text-white font-heading leading-tight">
              Accurate Measurements.<br />
              Fair Trade.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Metra Verify helps you check the authenticity and validity of weighing and measuring instruments issued under the Legal Metrology Act, 2009.
            </p>
          </div>

          {/* Center Column: Digital Bench Scale Image */}
          <div className="lg:col-span-3 flex justify-center items-center py-1">
            <div className="relative group">
              <img
                src="/images/banner-scale.jpg"
                alt="Digital Weighing Scale"
                className="w-full max-w-[240px] sm:max-w-[260px] h-auto object-contain rounded-xl drop-shadow-[0_15px_30px_rgba(0,180,255,0.35)] transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-sky-400/20 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Verify a Measuring Instrument Card */}
          <div className="lg:col-span-4">
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-100/80">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Verify a Measuring Instrument
              </h3>

              <form onSubmit={handleQuickVerify} className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={quickVerifyId}
                    onChange={(e) => setQuickVerifyId(e.target.value)}
                    placeholder="Enter Certificate or Instrument ID"
                    className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    className="bg-[#0A2558] hover:bg-[#071a3e] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    Verify
                  </button>
                </div>

                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold tracking-wider">
                    OR
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <Link
                  to="/verify"
                  className="w-full py-2 px-3 bg-[#EBF3FF] hover:bg-[#DCEDFF] text-[#0A2558] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-blue-200/80 shadow-xs"
                >
                  <QrCode className="w-4 h-4 text-blue-700" />
                  <span>Scan QR Code</span>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Welcome Header: "Welcome, [User Name]!" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 pb-0.5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
            Welcome, {welcomeName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Here is a quick overview of your services and latest updates.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium sm:text-right shrink-0">
          {user?.orgName || user?.licenseNo ? (
            <span>Enterprise: <strong className="text-slate-700">{user.orgName || user.licenseNo}</strong></span>
          ) : (
            <span>Commercial Metrology Registry</span>
          )}
        </div>
      </div>

      {/* 3. Four Role / Service Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Public User Card */}
        <Link
          to="/verify"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Public User
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Check instrument details, scan QR code, verify certificates.
            </p>
          </div>
          <div className="mt-4 text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center text-sm font-bold">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Inspector Card */}
        <Link
          to="/inspector/dashboard"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Inspector
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Conduct verification, record inspections, update status.
            </p>
          </div>
          <div className="mt-4 text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center text-sm font-bold">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Officer Card */}
        <Link
          to="/officer/dashboard"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Officer
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Manage applications, certificates, view reports and analytics.
            </p>
          </div>
          <div className="mt-4 text-purple-600 group-hover:translate-x-1 transition-transform inline-flex items-center text-sm font-bold">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Need Help? Card */}
        <Link
          to="/how-it-works"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div>
            <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Need Help?
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Check our FAQs or contact support for any assistance.
            </p>
          </div>
          <div className="mt-4 text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 text-xs font-bold">
            <span>Go to FAQs →</span>
          </div>
        </Link>
      </div>

      {/* 4. Two-Column Lower Section: How It Works & Latest Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* How It Works Card (6 Steps) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 font-heading tracking-tight">
              How It Works
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              A simple and transparent process for verification and certification.
            </p>
          </div>

          {/* 6 Step Interactive Flow */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-2 relative">
            {[
              { step: 1, label: 'Application Submitted', icon: FileText },
              { step: 2, label: 'Inspector Assigned', icon: User },
              { step: 3, label: 'Inspection Conducted', icon: Search },
              { step: 4, label: 'Verification Completed', icon: ShieldCheck },
              { step: 5, label: 'Approved by Officer', icon: CheckCircle2 },
              { step: 6, label: 'Certificate Issued', icon: Award }
            ].map((s, idx, arr) => {
              const StepIcon = s.icon;
              return (
                <div key={s.step} className="flex flex-col items-center text-center relative group">
                  {/* Number Badge */}
                  <div className="w-5 h-5 rounded-full bg-[#0055D4] text-white text-[10px] font-bold flex items-center justify-center mb-2 shadow-2xs">
                    {s.step}
                  </div>

                  {/* Icon Circle */}
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-[#0055D4] flex items-center justify-center mb-2.5 shadow-2xs group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                    <StepIcon className="w-5 h-5" />
                  </div>

                  {/* Step Label */}
                  <span className="text-xs font-bold text-slate-800 leading-snug max-w-[100px]">
                    {s.label}
                  </span>

                  {/* Connecting Arrow for larger screens */}
                  {idx < arr.length - 1 && (
                    <span className="hidden xl:block absolute top-7 -right-2 text-slate-300 font-bold text-xs pointer-events-none">
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Updates Card */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900 font-heading tracking-tight">
              Latest Updates
            </h3>
            <Link
              to="/how-it-works"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { date: '12 Sep 2025', title: 'Revised guidelines for instrument verification' },
              { date: '05 Sep 2025', title: 'New application form for weights & measures' },
              { date: '28 Aug 2025', title: 'System maintenance scheduled on 2nd Sept 2025' }
            ].map((update, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span className="text-slate-400 font-mono text-[11px] shrink-0 font-medium">
                  {update.date}
                </span>
                <span className="text-slate-700 font-medium leading-relaxed hover:text-blue-600 cursor-pointer transition-colors">
                  {update.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          STATISTICS: 5 KEY STATS REQUESTED
          Total Instruments, Pending Applications, Under Inspection, Approved, Certificates
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Key Operational Metrics
          </h2>
          <span className="text-xs text-slate-500">Live statutory compliance status</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Instruments"
            value={stats.totalInstruments}
            subtitle="Registered weighing devices"
            icon={Scale}
            iconColor="text-blue-600 bg-blue-50"
          />
          <StatCard
            title="Pending Applications"
            value={stats.pendingApplications}
            subtitle="Awaiting processing"
            icon={Clock}
            iconColor="text-amber-600 bg-amber-50"
          />
          <StatCard
            title="Under Inspection"
            value={stats.underInspection}
            subtitle="Inspector assigned"
            icon={FileText}
            iconColor="text-indigo-600 bg-indigo-50"
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            subtitle="Legally verified"
            icon={CheckCircle2}
            iconColor="text-emerald-600 bg-emerald-50"
          />
          <StatCard
            title="Certificates"
            value={stats.activeCertificates}
            subtitle="Valid & QR verified"
            icon={Award}
            iconColor="text-purple-600 bg-purple-50"
          />
        </div>
      </div>

      {/* =========================================================================
          QUICK ACTIONS SECTION
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
            <p className="text-xs text-slate-500">Fast-track statutory compliance workflows</p>
          </div>
          <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Self-Service Hub
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/business/instruments/new"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-300 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 bg-blue-600 text-white rounded-xl group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-700">
                Register Instrument
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Onboard new scale, capacity & serial plate details
              </p>
            </div>
          </Link>

          <Link
            to="/business/applications/new"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block group-hover:text-indigo-700">
                New Application
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                File calibration audit with AI document pre-check
              </p>
            </div>
          </Link>

          <Link
            to="/business/certificates"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
                Digital Certificates
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Download legal verification certificates with QR seal
              </p>
            </div>
          </Link>

          <Link
            to={activeCert ? `/verify/${activeCert.id}` : "/verify"}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-purple-50/50 hover:border-purple-300 transition-all flex items-start gap-3 group"
          >
            <div className="p-2.5 bg-purple-600 text-white rounded-xl group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">
                Verify Public QR
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Test SHA-256 public lookup as seen by shoppers
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* =========================================================================
          APPLICATION TIMELINE: 8-STAGE STATUTORY LIFECYCLE
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Application Lifecycle Timeline
              </h3>
              {activeApp && (
                <Badge variant="primary" size="sm" className="font-mono">
                  {activeApp.id}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end statutory progression from digital asset onboarding to QR certificate issuance
            </p>
          </div>

          {applications.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Switch Application:</span>
              <select
                value={selectedAppId || ''}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.id} ({app.status})
                  </option>
                ))}
              </select>
              {activeApp && (
                <Link to={`/business/applications/${activeApp.id}`}>
                  <Button variant="outline" size="sm" rightIcon={ExternalLink}>
                    View Dossier
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {applications.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">No Verification Applications Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Once you register an instrument and file a calibration audit, its live 8-stage statutory lifecycle tracking will appear here.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Link to="/business/instruments/new">
                <Button variant="outline" size="sm" leftIcon={PlusCircle}>
                  1. Register Instrument
                </Button>
              </Link>
              <Link to="/business/applications/new">
                <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                  2. File Application
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Horizontal Visual Stepper / Cards */
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {timelineStages.map((stage) => {
                const isDone = stage.status === 'completed';
                return (
                  <div
                    key={stage.num}
                    className={`p-4 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-slate-50/80 border-slate-200/90'
                        : 'bg-white border-dashed border-slate-300 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : stage.num}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          STAGE 0{stage.num}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {stage.date}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1">
                      {stage.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-snug mb-2">
                      {stage.desc}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 block pt-1 border-t border-slate-100">
                      By: {stage.actor}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          RECENT APPLICATIONS TABLE
          ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Recent Verification Applications</h3>
            </div>
            <p className="text-xs text-slate-500">
              Statutory verification requests and calibration dossiers submitted by your enterprise
            </p>
          </div>
          <Link to="/business/applications">
            <Button variant="outline" size="sm" rightIcon={ArrowRight}>
              View All Applications ({applications.length})
            </Button>
          </Link>
        </div>

        <div className="p-4 sm:p-5">
          <DataTable
            columns={appColumns}
            data={applications}
            isLoading={loading}
            emptyTitle="No verification applications filed"
            emptyDescription="You have not submitted any calibration verification applications yet. Register an instrument and file an application to begin."
            onRowClick={(row) => setSelectedAppId(row.id)}
          />
        </div>
      </div>

      {/* =========================================================================
          INSTRUMENT SUMMARY SECTION & ACTIVE CERTIFICATE
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instrument Summary (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Instrument Inventory Summary</h3>
              </div>
              <Link to="/business/instruments" className="text-xs font-semibold text-blue-600 hover:underline">
                View Full Inventory ({instruments.length})
              </Link>
            </div>

            {instruments.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 my-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">No Instruments Registered</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You have not registered any weighing or measuring devices. Onboard your scale to begin tracking statutory compliance.
                  </p>
                </div>
                <div className="pt-1">
                  <Link to="/business/instruments/new">
                    <Button variant="primary" size="sm" leftIcon={PlusCircle}>
                      Onboard Instrument
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Category Breakdown Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                      Retail Weighing
                    </span>
                    <p className="text-lg font-bold text-blue-950 font-mono mt-0.5">
                      {instruments.filter((i) => /digital|bench|nawi|retail|scale/i.test(i.instrumentType || i.category || '')).length} Units
                    </p>
                    <span className="text-[10px] text-blue-600">Class III NAWI</span>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                      Heavy Platform
                    </span>
                    <p className="text-lg font-bold text-indigo-950 font-mono mt-0.5">
                      {instruments.filter((i) => /platform|weighbridge|heavy|industrial/i.test(i.instrumentType || i.category || '')).length} Units
                    </p>
                    <span className="text-[10px] text-indigo-600">Industrial Scales</span>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                      Precision Analytical
                    </span>
                    <p className="text-lg font-bold text-purple-950 font-mono mt-0.5">
                      {instruments.filter((i) => /precision|analytical|balance|micro/i.test(i.instrumentType || i.category || '')).length} Units
                    </p>
                    <span className="text-[10px] text-purple-600">Class I/II Balances</span>
                  </div>
                </div>

                {/* Instruments quick table */}
                <div className="divide-y divide-slate-100">
                  {instruments.slice(0, 5).map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-lg transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/business/instruments/${item.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
                          >
                            {item.instrumentType}
                          </Link>
                          <span className="font-mono text-[10px] text-slate-400">({item.id})</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5 font-mono">
                          Serial: {item.serialNumber} • Capacity: {item.capacity} • {item.accuracyClass || 'Standard'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={item.status} size="sm" />
                        <Link
                          to={`/business/instruments/${item.id}`}
                          className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              All commercial units comply with Legal Metrology (General) Rules 2011.
            </span>
            <Link to="/business/instruments/new">
              <Button variant="primary" size="sm" leftIcon={PlusCircle}>
                Onboard Instrument
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Certificate Card (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Active Legal Certificate</h3>
              </div>
              {activeCert ? (
                <StatusBadge status="VALID" size="sm" />
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  None Active
                </span>
              )}
            </div>

            {activeCert ? (
              <>
                <div className="mt-4 p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-300 uppercase">
                      Digital Certificate ID
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                      SEAL VALID
                    </span>
                  </div>
                  <p className="font-mono text-lg font-extrabold tracking-tight text-white">
                    {activeCert.id || activeCert.certificateNo}
                  </p>
                  <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-700/80">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Device:</span>
                      <span className="font-medium text-white">{activeCert.instrumentType || 'Weighing Scale'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Serial:</span>
                      <span className="font-mono text-white">{activeCert.serialNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valid Until:</span>
                      <span className="text-emerald-400 font-semibold">{activeCert.validUntil || 'Active'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 mt-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <QrCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>QR Physical Verification</span>
                  </div>
                  <p className="text-slate-500">
                    Tamper-proof digital seal with SHA-256 audit proof for consumer verification.
                  </p>
                </div>
              </>
            ) : (
              <div className="p-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 my-4 space-y-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">No Active Certificates Yet</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Digital certificates with cryptographic QR seals will be issued here once your applications are verified and approved by the Legal Metrology officer.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {activeCert ? (
              <>
                <Link to={`/business/certificates/${activeCert.id}`} className="w-full">
                  <Button variant="primary" size="sm" className="w-full" rightIcon={ArrowRight}>
                    Open Full Certificate
                  </Button>
                </Link>
                <Link to={`/verify/${activeCert.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full" leftIcon={ExternalLink}>
                    Public QR Registry View
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/business/applications/new" className="w-full">
                <Button variant="primary" size="sm" className="w-full" leftIcon={PlusCircle}>
                  Apply for Verification
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
