import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, ExternalLink, Search } from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import RiskBadge from '../../components/ui/RiskBadge';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

export const ApplicationsListPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);


  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.instrumentId.toLowerCase().includes(search.toLowerCase()) ||
      app.instrumentType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Application ID',
      accessor: 'id',
      render: (row) => (
        <Link
          to={`/business/applications/${row.id}`}
          className="font-mono text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
        >
          {row.id}
          <ExternalLink className="w-3 h-3 opacity-60" />
        </Link>
      )
    },
    {
      header: 'Instrument Type',
      accessor: 'instrumentType',
      render: (row) => <span className="text-xs font-medium text-slate-900">{row.instrumentType}</span>
    },
    {
      header: 'Instrument ID',
      accessor: 'instrumentId',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.instrumentId}</span>
    },
    {
      header: 'Submitted On',
      accessor: 'submissionDate',
      render: (row) => <span className="text-xs text-slate-500">{row.submissionDate}</span>
    },
    {
      header: 'Assigned Inspector',
      accessor: 'assignedInspector',
      render: (row) => <span className="text-xs text-slate-600">{row.assignedInspector}</span>
    },
    {
      header: 'AI Risk Level',
      accessor: 'riskLevel',
      render: (row) => <RiskBadge level={row.riskLevel} score={row.riskScore} />
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Verification Applications
          </h2>
          <p className="text-xs text-slate-500">
            Track statutory filing, AI analysis, field telemetry, and officer approvals
          </p>
        </div>
        <Link to="/business/applications/new">
          <Button variant="primary" size="md" leftIcon={PlusCircle}>
            New Verification Application
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by Application ID, instrument ID, device..."
          className="flex-1"
        />
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          label="Status"
          options={[
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Officer Review', value: 'OFFICER_REVIEW' },
            { label: 'Inspection', value: 'INSPECTION' },
            { label: 'Submitted', value: 'SUBMITTED' }
          ]}
        />
      </div>

      {/* Applications Table */}
      {error ? (
        <ErrorState
          title="Unable to load verification applications"
          message={error}
          onRetry={fetchApplications}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
          <DataTable
            columns={columns}
            data={filtered}
            isLoading={loading}
            onRowClick={(row) => navigate(`/business/applications/${row.id}`)}
          />
        </div>
      )}
    </div>

  );
};

export default ApplicationsListPage;
