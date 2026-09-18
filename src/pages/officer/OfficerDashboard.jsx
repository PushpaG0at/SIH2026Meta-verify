import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
  Search,
  Scale,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Activity,
  MapPin,
  Lock,
  Compass
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { MOCK_STATS } from '../../utils/mockData';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import RiskBadge from '../../components/ui/RiskBadge';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'HIGH_RISK' | 'INSPECTION' | 'APPROVED'
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadOfficerData = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfficerData();

    const handleSync = () => {
      loadOfficerData();
    };

    window.addEventListener('mv_inspection_updated', handleSync);
    window.addEventListener('mv_application_updated', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('mv_inspection_updated', handleSync);
      window.removeEventListener('mv_application_updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const stats = MOCK_STATS.officer;

  const isPending = (s) => s === 'OFFICER_REVIEW' || s === 'INSPECTION_COMPLETED' || s === 'PENDING_REVIEW';
  const isInInspection = (s) => s === 'INSPECTION' || s === 'INSPECTION_ASSIGNED' || s === 'INSPECTION_SCHEDULED' || s === 'ASSIGNED';
  const isApproved = (s) => s === 'APPROVED' || s === 'OFFICER_APPROVED' || s === 'VERIFIED';
  const isRejected = (s) => s === 'REJECTED' || s === 'OFFICER_REJECTED';

  // Filtered applications for the table
  const filteredApps = applications.filter((app) => {
    const matchesFilterTab =
      filterTab === 'ALL'
        ? true
        : filterTab === 'PENDING'
        ? isPending(app.status)
        : filterTab === 'HIGH_RISK'
        ? app.riskScore >= 60
        : filterTab === 'INSPECTION'
        ? isInInspection(app.status)
        : filterTab === 'APPROVED'
        ? isApproved(app.status)
        : true;

    const matchesJurisdiction =
      selectedJurisdiction === 'ALL'
        ? true
        : selectedJurisdiction === 'NORTH'
        ? app.traderDetails?.address?.includes('New Delhi') || app.assignedInspector?.includes('NZ')
        : selectedJurisdiction === 'WEST'
        ? app.assignedInspector?.includes('WZ') || app.traderDetails?.address?.includes('Gurugram')
        : true;

    const matchesSearch =
      searchQuery.trim() === '' ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.instrumentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.instrumentDetails?.serialNumber &&
        app.instrumentDetails.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilterTab && matchesJurisdiction && matchesSearch;
  });

  // Highlight the highest-risk application in queue
  const highRiskApp =
    applications.find((a) => a.riskScore >= 60 && isPending(a.status)) ||
    applications.find((a) => a.riskScore >= 60);

  const pendingAdjudicationCount = applications.filter((a) => isPending(a.status)).length;
  const highRiskCount = applications.filter((a) => a.riskScore >= 60).length;
  const underInspectionCount = applications.filter((a) => isInInspection(a.status)).length;
  const approvedCount = applications.filter((a) => isApproved(a.status)).length;
  const rejectedCount = applications.filter((a) => isRejected(a.status)).length;

  // Audit activity ticker items
  const auditTicker = [
    {
      time: '12m ago',
      type: 'INSPECTION_SUBMITTED',
      text: 'Inspector Vikram Singh uploaded GNSS telematics & MPE test for MV-APP-000130 (70 L/min Flow Meter)',
      badge: 'Telematics Verified',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      time: '34m ago',
      type: 'AI_PRECHECK_ANOMALY',
      text: 'AI OCR flagged 140kg error on MV-APP-000126 (Weighbridge 60T) exceeding Class IV MPE',
      badge: 'High Risk Flag',
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200'
    },
    {
      time: '1h 15m ago',
      type: 'CERTIFICATE_SEALED',
      text: 'Statutory Certificate MV-2026-000123 cryptographically anchored by Officer Deshmukh',
      badge: 'e-Signed SHA-256',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200'
    }
  ];

  const columns = [
    {
      header: 'Application ID',
      accessor: 'id',
      render: (row) => (
        <div>
          <Link
            to={`/officer/applications/${row.id}`}
            className="font-mono text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            {row.id}
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
          <span className="text-[10px] text-slate-400 font-mono block">Filing: {row.submissionDate}</span>
        </div>
      )
    },
    {
      header: 'Business Entity & Location',
      accessor: 'businessName',
      render: (row) => (
        <div>
          <span className="text-xs font-bold text-slate-900 block">{row.businessName}</span>
          <span className="text-[11px] text-slate-500 font-mono">
            {row.traderDetails?.gstin || 'GSTIN Validated'}
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
            <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-400" />
            {row.traderDetails?.address?.split(',')[0]}
          </span>
        </div>
      )
    },
    {
      header: 'Instrument & Accuracy Class',
      accessor: 'instrumentType',
      render: (row) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 block">{row.instrumentType}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-mono font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
              SN: {row.instrumentDetails?.serialNumber || 'WS123456'}
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
              {row.instrumentDetails?.accuracyClass?.split(' ')[0] || 'Class III'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Field Inspector Telematics',
      accessor: 'assignedInspector',
      render: (row) => (
        <div>
          <span className="text-xs text-slate-700 font-medium block">
            {row.inspection?.inspectorName?.split('(')[0] || row.assignedInspector?.split('(')[0] || 'Field Desk'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Seal:{' '}
            {row.inspection?.sealNumber ? (
              <strong className="text-blue-600">{row.inspection.sealNumber.split('-')[0] + '...'}</strong>
            ) : (
              'Pending Visit'
            )}
          </span>
        </div>
      )
    },
    {
      header: 'AI Risk Profile',
      accessor: 'riskLevel',
      render: (row) => (
        <div>
          <RiskBadge level={row.riskLevel} score={row.riskScore} />
          {row.riskScore >= 60 && (
            <span className="text-[9px] font-bold text-rose-600 uppercase block mt-0.5 tracking-tight">
              Discrepancy Flag
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Statutory SLA',
      accessor: 'slaRemainingDays',
      render: (row) => {
        const isUrgent = row.slaRemainingDays <= 1.0;
        return (
          <div>
            <span
              className={`text-xs font-mono font-bold flex items-center gap-1 ${
                isUrgent ? 'text-rose-600 animate-pulse' : 'text-emerald-700'
              }`}
            >
              <Clock className="w-3 h-3" />
              {row.slaRemainingDays ? `${row.slaRemainingDays}d remaining` : 'On Schedule'}
            </span>
            <span className="text-[10px] text-slate-400">Target: 3.0d</span>
          </div>
        );
      }
    },
    {
      header: 'Adjudication Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Action',
      accessor: 'actions',
      render: (row) => (
        <Link to={`/officer/applications/${row.id}`}>
          <Button
            variant={isPending(row.status) ? 'primary' : 'outline'}
            size="sm"
            className={isPending(row.status) ? 'bg-purple-600 hover:bg-purple-500 shadow-xs' : ''}
          >
            {isPending(row.status) ? 'Adjudicate' : 'Review Dossier'}
          </Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Officer Authority Header with Jurisdiction Filter & DSC Hardware Token Status */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-purple-900/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-[11px] text-purple-300 font-semibold tracking-wider uppercase font-mono">
                Statutory Directorate of Legal Metrology • Authority Desk
              </span>
              <span className="text-[10px] font-mono bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded-full border border-purple-700/60">
                Rule 14 & 24 Legal Metrology Act, 2009
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-heading text-white" style={{ color: '#ffffff' }}>
              {user?.name || 'Dr. Anita Deshmukh'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Authorized Legal Metrology Verification Officer •{' '}
              <span className="font-mono text-purple-200 font-semibold">ID: OFF-HQ-ANITA-D</span> • State Directorate HQ
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* DSC Hardware Security Token Badge */}
            <div className="p-2.5 bg-slate-900/80 border border-purple-800/60 rounded-xl flex items-center gap-2.5 text-xs">
              <div className="p-1.5 bg-purple-900/80 text-purple-300 rounded-lg">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">DSC e-Sign Token</span>
                <span className="text-emerald-400 font-bold font-mono text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Hardware PIN Active
                </span>
              </div>
            </div>

            <Link to="/officer/applications">
              <Button
                variant="primary"
                size="md"
                className="bg-purple-600 hover:bg-purple-500 shadow-md text-xs sm:text-sm font-semibold"
                rightIcon={ArrowRight}
              >
                Adjudication Roster ({pendingAdjudicationCount})
              </Button>
            </Link>
          </div>
        </div>

        {/* Sub-bar: Active Jurisdiction Selector & Quick Context */}
        <div className="pt-3 border-t border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-medium text-slate-400">Statutory Jurisdiction:</span>
            <select
              value={selectedJurisdiction}
              onChange={(e) => setSelectedJurisdiction(e.target.value)}
              className="bg-slate-900 border border-purple-800/80 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 font-medium"
            >
              <option value="ALL">All Jurisdictions (Full State Directorate)</option>
              <option value="NORTH">Zone 4 — North Delhi Industrial Cluster</option>
              <option value="WEST">Zone 7 — West NCR & Gurugram Hub</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-[11px] font-mono">
            <span>
              Direct Sign-Off Authority:{' '}
              <strong className="text-purple-300">Classes I, II, III & IV</strong>
            </span>
            <span className="hidden sm:inline text-purple-700">|</span>
            <span>
              Queue Health: <strong className="text-emerald-400">96.4% Compliance</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Top 5 Statutory Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Pending Adjudication"
          value={loading ? '-' : pendingAdjudicationCount}
          subtitle="Awaiting officer sign-off"
          icon={Clock}
          iconColor="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="High-Risk Anomalies"
          value={loading ? '-' : highRiskCount}
          subtitle="AI mismatch flagged"
          icon={ShieldAlert}
          iconColor="text-rose-600 bg-rose-50"
        />
        <StatCard
          title="Under Field Inspection"
          value={loading ? '-' : underInspectionCount}
          subtitle="Live GNSS telematics"
          icon={FileText}
          iconColor="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          title="Certificates Issued"
          value={loading ? '-' : (approvedCount > 0 ? approvedCount : stats.approvedTotal)}
          subtitle="Cryptographically sealed"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="Rejections / Void"
          value={loading ? '-' : (rejectedCount > 0 ? rejectedCount : stats.rejectedTotal)}
          subtitle="Statutory non-compliance"
          icon={XCircle}
          iconColor="text-rose-600 bg-rose-50"
        />
      </div>

      {/* High-Risk Auto-Escalation Priority Banner */}
      {highRiskApp && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50/50 to-slate-50 border-2 border-rose-300/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-600 text-white rounded-xl shrink-0 shadow-sm animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full font-mono">
                    High-Priority Regulatory Anomaly
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">{highRiskApp.id}</span>
                  <RiskBadge level={highRiskApp.riskLevel} score={highRiskApp.riskScore} />
                  <span className="text-[10px] text-rose-700 font-mono font-semibold">
                    SLA: {highRiskApp.slaRemainingDays}d remaining
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {highRiskApp.instrumentType} — {highRiskApp.businessName}
                </h3>
                <p className="text-xs text-rose-800 font-medium">
                  {highRiskApp.riskFactors?.[0] ||
                    'AI OCR Mismatch: Serial number discrepancy detected between purchase invoice and stamped plate.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="danger"
                size="md"
                onClick={() => navigate(`/officer/applications/${highRiskApp.id}`)}
                rightIcon={ArrowRight}
                className="w-full md:w-auto shadow-sm text-xs sm:text-sm"
              >
                Inspect & Adjudicate Dossier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Information-Rich Analytics Cards Grid (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Statutory SLA Velocity & Aging */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">Adjudication SLA Velocity</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              96.4% On-Time
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-500">Average Turnaround:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">1.8 Days</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-500">Statutory Maximum Window:</span>
              <span className="font-mono font-medium text-slate-600">3.0 Days max</span>
            </div>

            {/* SLA Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-[60%]" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                <span>0-24h (2 apps)</span>
                <span>24-48h (3 apps)</span>
                <span className="text-emerald-700 font-semibold">0 Overdue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: AI Pre-Check Risk Spectrum */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-bold text-slate-900">AI Risk Spectrum</h4>
            </div>
            <span className="text-[10px] font-mono font-semibold text-slate-500">Active State Queue</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low Risk (&lt;30)
                </span>
                <span className="font-bold text-slate-800">50% (3 items)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full w-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium Risk (30-59)
                </span>
                <span className="font-bold text-slate-800">17% (1 item)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full w-1/6" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> High Risk (&ge;60)
                </span>
                <span className="font-bold text-rose-700">33% (2 items)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-rose-500 h-1.5 rounded-full w-1/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Instrument Classification Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">Instrument Classification</h4>
            </div>
            <span className="text-[10px] font-mono font-semibold text-slate-500">Legal Metrology</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="p-2 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="text-slate-700 font-medium">Class III NAWI Commercial</span>
              <span className="font-bold text-slate-900">40%</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="text-slate-700 font-medium">Class IV Heavy Weighbridges</span>
              <span className="font-bold text-slate-900">20%</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="text-slate-700 font-medium">Class I Analytical Balances</span>
              <span className="font-bold text-slate-900">20%</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg flex justify-between items-center">
              <span className="text-slate-700 font-medium">Liquid Fuel & Checkweighers</span>
              <span className="font-bold text-slate-900">20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Cryptographic Activity Ledger Ticker */}
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xs border border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
            <h4 className="text-xs sm:text-sm font-bold tracking-tight">
              Live State Verification Ledger & Telematics Feed
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            Cryptographically Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {auditTicker.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{item.time}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Applications Review Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Regulatory Verification Adjudication Desk
            </h3>
            <p className="text-xs text-slate-500">
              Cross-reference AI OCR results, field telemetry, and execute statutory orders under Legal Metrology Act
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, trader, serial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilterTab('ALL')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                  filterTab === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('PENDING')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                  filterTab === 'PENDING'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pending ({pendingAdjudicationCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('HIGH_RISK')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                  filterTab === 'HIGH_RISK'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                High Risk ({highRiskCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('INSPECTION')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                  filterTab === 'INSPECTION'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                In Field ({underInspectionCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('APPROVED')}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                  filterTab === 'APPROVED'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Approved ({approvedCount})
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <DataTable
            columns={columns}
            data={filteredApps}
            isLoading={loading}
            onRowClick={(row) => navigate(`/officer/applications/${row.id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
