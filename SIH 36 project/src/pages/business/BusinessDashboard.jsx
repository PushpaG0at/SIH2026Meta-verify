import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ExternalLink
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { instrumentService } from '../../services/instrumentService';
import { MOCK_STATS } from '../../utils/mockData';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import RiskBadge from '../../components/ui/RiskBadge';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../hooks/useAuth';

export const BusinessDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('MV-APP-000123');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [apps, insts] = await Promise.all([
          applicationService.getApplications(),
          instrumentService.getInstruments()
        ]);
        setApplications(apps);
        setInstruments(insts);
        if (apps.length > 0) {
          setSelectedAppId((prev) => prev || apps[0].id);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const stats = MOCK_STATS.business;

  // Selected application for live interactive timeline
  const activeApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  // 8-stage statutory legal metrology lifecycle timeline steps
  const timelineStages = [
    {
      num: 1,
      title: 'Digital Instrument Registration',
      actor: 'Rajesh Sharma (Owner)',
      date: '01 Sep 2026',
      desc: 'Asset minted with Digital ID MV-INS-000123 & serial plate WS123456.',
      status: 'completed'
    },
    {
      num: 2,
      title: 'Document & Invoice Upload',
      actor: 'Business Licensee',
      date: '01 Sep 2026',
      desc: 'Tax invoice & manufacturer model approval test certificate uploaded.',
      status: 'completed'
    },
    {
      num: 3,
      title: 'AI Pre-check & OCR Scrutiny',
      actor: 'METRA-AI Vision Engine',
      date: '01 Sep 2026',
      desc: 'Automated 100% parameter match. Advisory risk evaluated as Low (25/100).',
      status: 'completed'
    },
    {
      num: 4,
      title: 'Statutory Fee Clearance',
      actor: 'e-Treasury Gateway',
      date: '02 Sep 2026',
      desc: 'Government scheduled fee of ₹1,250 received with transaction ID TR-881920.',
      status: 'completed'
    },
    {
      num: 5,
      title: 'Inspector Assignment',
      actor: 'Legal Metrology Dispatch',
      date: '03 Sep 2026',
      desc: 'Field Inspector Vikram Singh (Badge INSP-NZ-4082) dispatched.',
      status: 'completed'
    },
    {
      num: 6,
      title: 'On-Site Geofenced Audit',
      actor: 'Inspector Vikram Singh',
      date: '05 Sep 2026',
      desc: 'Physical verification with F1 standard weights at 28.6139°N, 77.2090°E. 0 error.',
      status: 'completed'
    },
    {
      num: 7,
      title: 'Officer Adjudication',
      actor: 'Dr. Anita Deshmukh (Officer)',
      date: '08 Sep 2026',
      desc: 'Review completed with positive recommendation. Statutory clearance granted.',
      status: 'completed'
    },
    {
      num: 8,
      title: 'Digital QR Certificate Issued',
      actor: 'State Directorate',
      date: '08 Sep 2026',
      desc: 'Certificate #MV-2026-000123 sealed with SHA-256 cryptographic signature.',
      status: activeApp?.status === 'APPROVED' ? 'completed' : 'pending'
    }
  ];

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
      {/* Welcome Banner & Quick Action Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Commercial Trader Compliance Hub • SIH 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-white">
            Welcome back, {user?.name || 'Rajesh Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            {user?.organization || 'Sharma Traders & Co.'} • Active Trade Registration:{' '}
            <span className="font-mono text-blue-300 font-medium">
              {user?.registrationNumber || 'GSTIN07AAACS1429B1Z8'}
            </span>
          </p>
        </div>

        {/* Header Quick Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Link to="/business/instruments/new">
            <Button
              variant="primary"
              size="md"
              leftIcon={PlusCircle}
              className="shadow-sm shadow-blue-500/20"
            >
              Register Instrument
            </Button>
          </Link>
          <Link to="/business/applications/new">
            <Button variant="outlineDark" size="md" leftIcon={FileText}>
              New Application
            </Button>
          </Link>
          <Link to="/verify/MV-2026-000123">
            <Button variant="outlineDark" size="md" leftIcon={QrCode}>
              Verify Certificate
            </Button>
          </Link>
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
            to="/verify/MV-2026-000123"
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
              <Badge variant="primary" size="sm" className="font-mono">
                {activeApp?.id || 'MV-APP-000123'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end statutory progression from digital asset onboarding to QR certificate issuance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Switch Application:</span>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} ({app.status})
                </option>
              ))}
            </select>
            <Link to={`/business/applications/${activeApp?.id || 'MV-APP-000123'}`}>
              <Button variant="outline" size="sm" rightIcon={ExternalLink}>
                View Dossier
              </Button>
            </Link>
          </div>
        </div>

        {/* Horizontal Visual Stepper / Cards */}
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

            {/* Category Breakdown Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                  Retail Weighing
                </span>
                <p className="text-lg font-bold text-blue-950 font-mono mt-0.5">1 Unit</p>
                <span className="text-[10px] text-blue-600">Class III NAWI (WS-500)</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                  Heavy Platform
                </span>
                <p className="text-lg font-bold text-indigo-950 font-mono mt-0.5">1 Unit</p>
                <span className="text-[10px] text-indigo-600">1500 kg Industrial</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                  Precision Analytical
                </span>
                <p className="text-lg font-bold text-purple-950 font-mono mt-0.5">1 Unit</p>
                <span className="text-[10px] text-purple-600">Class I Micro-Balance</span>
              </div>
            </div>

            {/* Instruments quick table */}
            <div className="divide-y divide-slate-100">
              {instruments.map((item) => (
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
                      Serial: {item.serialNumber} • Capacity: {item.capacity} • {item.accuracyClass}
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
              <StatusBadge status="VALID" size="sm" />
            </div>

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
                MV-2026-000123
              </p>
              <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-700/80">
                <div className="flex justify-between">
                  <span className="text-slate-400">Device:</span>
                  <span className="font-medium text-white">Digital Weighing Scale</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Serial:</span>
                  <span className="font-mono text-white">WS123456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valid Until:</span>
                  <span className="text-emerald-400 font-semibold">08 Sep 2027</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 mt-3 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                <span>QR Physical Verification</span>
              </div>
              <p className="text-slate-500">
                Affixed to scale plate. Scanned 42 times by consumers & field squads.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/business/certificates/MV-2026-000123" className="w-full">
              <Button variant="primary" size="sm" className="w-full" rightIcon={ArrowRight}>
                Open Full Certificate
              </Button>
            </Link>
            <Link to="/verify/MV-2026-000123" className="w-full">
              <Button variant="outline" size="sm" className="w-full" leftIcon={ExternalLink}>
                Public QR Registry View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
