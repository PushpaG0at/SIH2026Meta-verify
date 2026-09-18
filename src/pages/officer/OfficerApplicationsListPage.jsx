import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Search,
  ArrowUpDown,
  Clock,
  LayoutGrid,
  List,
  Download,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import RiskBadge from '../../components/ui/RiskBadge';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const OfficerApplicationsListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Filter States
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('ALL'); // 'ALL' | 'OFFICER_REVIEW' | 'INSPECTION' | 'APPROVED' | 'REJECTED'
  const [riskFilter, setRiskFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [accuracyClassFilter, setAccuracyClassFilter] = useState('ALL');
  const [slaFilter, setSlaFilter] = useState('ALL'); // 'ALL' | 'URGENT' | 'NORMAL'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'risk_desc' | 'sla_asc' | 'trader'

  const isPending = (s) => s === 'OFFICER_REVIEW' || s === 'INSPECTION_COMPLETED' || s === 'PENDING_REVIEW';
  const isInInspection = (s) => s === 'INSPECTION' || s === 'INSPECTION_ASSIGNED' || s === 'INSPECTION_SCHEDULED' || s === 'ASSIGNED';
  const isApproved = (s) => s === 'APPROVED' || s === 'OFFICER_APPROVED' || s === 'VERIFIED';
  const isRejected = (s) => s === 'REJECTED' || s === 'OFFICER_REJECTED';

  const fetchApplications = async () => {
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
    fetchApplications();

    const handleSync = () => {
      fetchApplications();
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

  // Filter logic
  const filtered = applications.filter((app) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      app.id.toLowerCase().includes(query) ||
      app.businessName.toLowerCase().includes(query) ||
      app.instrumentType.toLowerCase().includes(query) ||
      (app.instrumentDetails?.serialNumber &&
        app.instrumentDetails.serialNumber.toLowerCase().includes(query)) ||
      (app.traderDetails?.gstin && app.traderDetails.gstin.toLowerCase().includes(query)) ||
      (app.assignedInspector && app.assignedInspector.toLowerCase().includes(query));

    const matchesStatus =
      statusTab === 'ALL'
        ? true
        : statusTab === 'OFFICER_REVIEW'
        ? isPending(app.status)
        : statusTab === 'INSPECTION'
        ? isInInspection(app.status)
        : statusTab === 'APPROVED'
        ? isApproved(app.status)
        : statusTab === 'REJECTED'
        ? isRejected(app.status)
        : app.status === statusTab;

    const matchesRisk =
      riskFilter === 'ALL'
        ? true
        : riskFilter === 'CRITICAL'
        ? app.riskScore >= 75
        : riskFilter === 'HIGH'
        ? app.riskLevel === 'HIGH'
        : riskFilter === 'MEDIUM'
        ? app.riskLevel === 'MEDIUM'
        : riskFilter === 'LOW'
        ? app.riskLevel === 'LOW'
        : true;

    const matchesClass =
      accuracyClassFilter === 'ALL'
        ? true
        : app.instrumentDetails?.accuracyClass?.toLowerCase().includes(accuracyClassFilter.toLowerCase());

    const matchesSla =
      slaFilter === 'ALL'
        ? true
        : slaFilter === 'URGENT'
        ? (app.slaRemainingDays || 0) <= 1.0
        : (app.slaRemainingDays || 0) > 1.0;

    return matchesSearch && matchesStatus && matchesRisk && matchesClass && matchesSla;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'risk_desc') return b.riskScore - a.riskScore;
    if (sortBy === 'sla_asc') return (a.slaRemainingDays || 99) - (b.slaRemainingDays || 99);
    if (sortBy === 'trader') return a.businessName.localeCompare(b.businessName);
    return new Date(b.submissionDate) - new Date(a.submissionDate);
  });

  // Quick export function
  const handleExportRegister = () => {
    const headers = ['Application ID', 'Trader', 'Instrument', 'Class', 'Risk Level', 'Risk Score', 'Status', 'Filing Date'];
    const rows = sorted.map((a) => [
      a.id,
      `"${a.businessName}"`,
      `"${a.instrumentType}"`,
      `"${a.instrumentDetails?.accuracyClass || 'Class III'}"`,
      a.riskLevel,
      a.riskScore,
      a.status,
      a.submissionDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Legal_Metrology_Statutory_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Statutory Register exported to CSV successfully.', 'success');
  };

  const columns = [
    {
      header: 'Application ID & Custody',
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
          <div className="flex items-center gap-1.5 mt-1">
            {/* 7-stage trust chain mini progress bar */}
            <div className="flex items-center gap-0.5" title="Digital Trust Chain: 6 of 7 Stages Complete">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <span
                  key={step}
                  className={`w-2 h-1 rounded-xs ${
                    step < 7
                      ? 'bg-emerald-500'
                      : row.status === 'APPROVED'
                      ? 'bg-emerald-500'
                      : row.status === 'REJECTED'
                      ? 'bg-rose-500'
                      : 'bg-purple-500 animate-pulse'
                  }`}
                />
              ))}
            </div>
            <span className="text-[9px] font-mono text-slate-400">
              {row.status === 'APPROVED' ? '7/7 Sealed' : '6/7 Passed'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Trading Business Entity',
      accessor: 'businessName',
      render: (row) => (
        <div>
          <span className="text-xs font-bold text-slate-900 block">{row.businessName}</span>
          <span className="text-[11px] text-slate-500 font-mono">
            {row.traderDetails?.gstin || 'GSTIN Validated'}
          </span>
          <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
            {row.traderDetails?.address?.split(',')[0]}
          </span>
        </div>
      )
    },
    {
      header: 'Instrument Specifications',
      accessor: 'instrumentType',
      render: (row) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 block">{row.instrumentType}</span>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <span>SN:</span>
            <strong className="font-mono text-slate-700">{row.instrumentDetails?.serialNumber || 'WS123456'}</strong>
            <span>•</span>
            <span className="font-semibold text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded text-[10px]">
              {row.instrumentDetails?.accuracyClass?.split(' ')[0] || 'Class III'}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Filing & Statutory SLA',
      accessor: 'submissionDate',
      render: (row) => {
        const isUrgent = (row.slaRemainingDays || 0) <= 1.0;
        return (
          <div>
            <span className="text-xs text-slate-800 font-medium block">{row.submissionDate}</span>
            <span
              className={`text-[10px] font-mono font-bold flex items-center gap-1 mt-0.5 ${
                isUrgent ? 'text-rose-600 animate-pulse' : 'text-emerald-700'
              }`}
            >
              <Clock className="w-3 h-3" />
              {row.slaRemainingDays ? `${row.slaRemainingDays}d SLA remaining` : 'On Target'}
            </span>
          </div>
        );
      }
    },
    {
      header: 'AI Pre-Check Risk',
      accessor: 'riskLevel',
      render: (row) => (
        <div>
          <RiskBadge level={row.riskLevel} score={row.riskScore} />
          {row.riskFactors?.[0] && (
            <span
              className="text-[10px] text-slate-500 truncate block max-w-[160px] mt-0.5"
              title={row.riskFactors[0]}
            >
              {row.riskFactors[0]}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Field Telematics & Seal',
      accessor: 'inspection',
      render: (row) => (
        <div>
          <span className="text-xs font-medium text-slate-800 block">
            {row.inspection?.inspectorName?.split('(')[0] || row.assignedInspector?.split('(')[0] || 'Unassigned'}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {row.inspection?.sealNumber ? (
              <span className="text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold border border-blue-200">
                Seal: {row.inspection.sealNumber.split('-')[0] + '...'}
              </span>
            ) : (
              <span className="text-slate-400">Pending Field Audit</span>
            )}
          </span>
        </div>
      )
    },
    {
      header: 'Audit Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Adjudication',
      accessor: 'action',
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

  const pendingCount = applications.filter((a) => isPending(a.status)).length;
  const inspectionCount = applications.filter((a) => isInInspection(a.status)).length;
  const approvedCount = applications.filter((a) => isApproved(a.status)).length;
  const rejectedCount = applications.filter((a) => isRejected(a.status)).length;
  const highRiskCount = applications.filter((a) => a.riskScore >= 60).length;

  return (
    <div className="space-y-6">
      {/* Page Header with Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs font-mono text-purple-700 uppercase font-bold tracking-wider">
              Legal Metrology Statutory Adjudication Registry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Regulatory Verification Applications
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cross-examine AI pre-check extractions, inspector field telemetry, and issue statutory seals
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Priority Kanban Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={handleExportRegister}
            className="text-xs shadow-xs"
          >
            Export Register (CSV)
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">Pending Adjudication</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-purple-700">{pendingCount}</span>
            <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 rounded">
              Ready for Order
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">High-Risk Escalations</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-rose-600">{highRiskCount}</span>
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 rounded">
              Anomaly Triggered
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">Under Field Inspection</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-indigo-600">{inspectionCount}</span>
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 rounded">
              GNSS Telematics
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block font-medium">Certificates Sealed</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-mono text-emerald-600">{approvedCount}</span>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 rounded">
              e-Signed Form VI
            </span>
          </div>
        </div>
      </div>

      {/* Main Filter & Adjudication Controls Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Row 1: Search & Status Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, business name, serial number, GSTIN, inspector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusTab('ALL')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusTab === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('OFFICER_REVIEW')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusTab === 'OFFICER_REVIEW'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pending Adjudication ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('INSPECTION')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusTab === 'INSPECTION'
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Field Audits ({inspectionCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('APPROVED')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusTab === 'APPROVED'
                  ? 'bg-white text-emerald-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('REJECTED')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusTab === 'REJECTED'
                  ? 'bg-white text-rose-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters (Risk, Class, SLA, Sort) */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-purple-500"
          >
            <option value="ALL">All Risk Profiles</option>
            <option value="CRITICAL">Critical Risk (&ge; 75)</option>
            <option value="HIGH">High Risk (60-74)</option>
            <option value="MEDIUM">Medium Risk (30-59)</option>
            <option value="LOW">Low Risk (&lt; 30)</option>
          </select>

          {/* Accuracy Class Filter */}
          <select
            value={accuracyClassFilter}
            onChange={(e) => setAccuracyClassFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-purple-500"
          >
            <option value="ALL">All Metrology Classes</option>
            <option value="Class I">Class I (Micro-Balance)</option>
            <option value="Class III">Class III (Commercial NAWI)</option>
            <option value="Class IV">Class IV (Weighbridges)</option>
            <option value="Class 0.5">Class 0.5 (Liquid Fuel)</option>
          </select>

          {/* SLA Urgency Filter */}
          <select
            value={slaFilter}
            onChange={(e) => setSlaFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-purple-500"
          >
            <option value="ALL">All SLA Windows</option>
            <option value="URGENT">Urgent SLA (&le; 24h Remaining)</option>
            <option value="NORMAL">Normal SLA (&gt; 24h)</option>
          </select>

          {/* Sort By Dropdown */}
          <div className="ml-auto flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-purple-500"
            >
              <option value="newest">Sort: Newest Submissions</option>
              <option value="risk_desc">Sort: Highest AI Risk Score</option>
              <option value="sla_asc">Sort: Nearest SLA Deadline</option>
              <option value="trader">Sort: Trader Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Rendering: Table or Priority Kanban Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs overflow-hidden">
          <DataTable
            columns={columns}
            data={sorted}
            isLoading={loading}
            onRowClick={(row) => navigate(`/officer/applications/${row.id}`)}
          />
        </div>
      ) : (
        /* Priority Kanban Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/officer/applications/${app.id}`)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {app.id}
                  </span>
                  <StatusBadge status={app.status} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    {app.instrumentType}
                  </h4>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{app.businessName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{app.traderDetails?.gstin}</p>
                </div>

                {/* Instrument Specifications */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Serial No:</span>
                    <span className="font-mono font-bold text-slate-800">{app.instrumentDetails?.serialNumber || 'WS123456'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Accuracy Class:</span>
                    <span className="font-semibold text-indigo-700">{app.instrumentDetails?.accuracyClass?.split(' ')[0] || 'Class III'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capacity:</span>
                    <span className="font-bold text-slate-800">{app.instrumentDetails?.maxCapacity}</span>
                  </div>
                </div>

                {/* AI Risk Profile */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">AI Risk Assessment:</span>
                  <RiskBadge level={app.riskLevel} score={app.riskScore} />
                </div>

                {/* SLA remaining */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Statutory SLA:</span>
                  <span
                    className={`font-mono font-bold flex items-center gap-1 ${
                      (app.slaRemainingDays || 0) <= 1.0 ? 'text-rose-600 animate-pulse' : 'text-emerald-700'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {app.slaRemainingDays ? `${app.slaRemainingDays}d remaining` : 'On Schedule'}
                  </span>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="pt-2">
                <Button
                  variant={isPending(app.status) ? 'primary' : 'outline'}
                  size="sm"
                  className={`w-full text-xs font-semibold ${
                    isPending(app.status) ? 'bg-purple-600 hover:bg-purple-500 shadow-xs' : ''
                  }`}
                  rightIcon={ChevronRight}
                >
                  {isPending(app.status) ? 'Adjudicate File' : 'Open Statutory Dossier'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfficerApplicationsListPage;
