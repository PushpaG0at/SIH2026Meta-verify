import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ClipboardCheck,
  MapPin,
  Search,
  Filter,
  Phone,
  ArrowRight,
  Clock,
  Radio,
  CheckCircle2,
  Calendar,
  Scale
} from 'lucide-react';
import { inspectionService } from '../../services/inspectionService';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

export const AssignmentsListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOfficer = location.pathname.startsWith('/officer');
  const isCompletedRoute = location.pathname.includes('completed');

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusTab, setStatusTab] = useState(isCompletedRoute ? 'COMPLETED' : 'ALL'); // 'ALL' | 'PENDING' | 'COMPLETED'

  // Synchronize status tab if route changes between assignments and completed
  useEffect(() => {
    if (location.pathname.includes('completed')) {
      setStatusTab('COMPLETED');
    }
  }, [location.pathname]);

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inspectionService.getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch assigned inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();

    const handleSync = () => {
      fetchAssignments();
    };

    window.addEventListener('mv_inspection_updated', handleSync);
    window.addEventListener('mv_application_updated', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('mv_inspection_updated', handleSync);
      window.removeEventListener('mv_application_updated', handleSync);
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);


  const filtered = assignments.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.businessName.toLowerCase().includes(search.toLowerCase()) ||
      a.instrumentType.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      (a.location && a.location.toLowerCase().includes(search.toLowerCase()));

    const matchesPriority = priorityFilter ? a.priority === priorityFilter : true;

    const isPendingStatus = (s) => s === 'PENDING' || s === 'ASSIGNED' || s === 'INSPECTION_ASSIGNED';
    const matchesStatus = statusTab === 'ALL'
      ? true
      : statusTab === 'PENDING'
      ? isPendingStatus(a.status)
      : a.status === statusTab;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const pendingCount = assignments.filter((a) => a.status === 'PENDING' || a.status === 'ASSIGNED' || a.status === 'INSPECTION_ASSIGNED').length;
  const completedCount = assignments.filter((a) => a.status === 'COMPLETED' || a.status === 'INSPECTION_COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            {isOfficer
              ? 'Inspection Oversight & Records'
              : (isCompletedRoute ? 'Completed Field Audits' : 'Field Inspection Assignments')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isOfficer
              ? 'Statutory oversight of field telemetry logs, GPS geofencing & calibration evidence'
              : 'Legal metrology physical inspection roster, GPS geofencing & reference weight audits'}
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStatusTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({assignments.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusTab === 'PENDING'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusTab('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusTab === 'COMPLETED'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by business, serial no, location, application..."
          className="flex-1"
        />
        <FilterDropdown
          value={priorityFilter}
          onChange={setPriorityFilter}
          label="Priority"
          options={[
            { label: 'All Priorities', value: '' },
            { label: 'High Priority', value: 'HIGH' },
            { label: 'Medium Priority', value: 'MEDIUM' },
            { label: 'Normal', value: 'NORMAL' }
          ]}
        />
      </div>

      {/* Assignments Card Grid */}
      {loading ? (
        <LoadingState message="Fetching assigned inspection routes..." />
      ) : error ? (
        <ErrorState
          title="Unable to load inspection routes"
          message={error}
          onRetry={fetchAssignments}
        />
      ) : filtered.length === 0 ? (
        <EmptyState

          title="No assignments found"
          description="Try adjusting your search query or filter criteria."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setPriorityFilter('');
            setStatusTab('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{item.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-[11px] text-slate-500">{item.applicationId}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{item.businessName}</h3>
                    {item.contactPerson && (
                      <p className="text-[11px] text-slate-500">{item.contactPerson}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={item.priority} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                </div>

                {/* Details Section */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Instrument:</span>
                    <span className="font-semibold text-slate-900">{item.instrumentType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Make / Model:</span>
                    <span className="font-medium text-slate-800">{item.manufacturer} {item.model}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Serial Number:</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {item.serialNumber}
                    </span>
                  </div>

                  {item.maxCapacity && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Capacity & Class:</span>
                      <span className="text-slate-700 font-medium">
                        {item.maxCapacity} • {item.accuracyClass || 'Class III'}
                      </span>
                    </div>
                  )}

                  {/* Location & Geofence Indicator */}
                  <div className="pt-2 border-t border-slate-100/80 space-y-1">
                    <div className="text-slate-600 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{item.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="flex items-center gap-1 font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                        Target Locked (50m radius)
                      </span>
                      {item.businessPhone && (
                        <a
                          href={`tel:${item.businessPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Trader</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Slot</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.timeSlot || item.scheduledDate}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (isOfficer) {
                      const targetId = item.applicationId || item.id;
                      navigate(`/officer/applications/${targetId}`);
                    } else {
                      navigate(`/inspector/assignments/${item.id}`);
                    }
                  }}
                  rightIcon={ArrowRight}
                  className="shadow-xs"
                >
                  {isOfficer
                    ? 'Review Application'
                    : (item.status === 'COMPLETED' ? 'View Full Report' : 'Execute Inspection')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsListPage;
