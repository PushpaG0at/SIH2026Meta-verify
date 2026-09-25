import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Camera,
  ArrowRight,
  ShieldAlert,
  Phone,
  Radio,
  Navigation,
  Scale,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';
import { inspectionService } from '../../services/inspectionService';
import { MOCK_STATS } from '../../utils/mockData';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import RiskBadge from '../../components/ui/RiskBadge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const InspectorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleFilter, setScheduleFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'COMPLETED'

  const loadAssignments = async () => {
    try {
      const data = await inspectionService.getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();

    const handleUpdate = () => {
      loadAssignments();
    };

    window.addEventListener('mv_inspection_updated', handleUpdate);
    window.addEventListener('mv_application_updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('mv_inspection_updated', handleUpdate);
      window.removeEventListener('mv_application_updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const isPending = (a) => a.status === 'PENDING' || a.status === 'ASSIGNED' || a.status === 'INSPECTION_ASSIGNED';
  const isDone = (a) => a.status === 'COMPLETED' || a.status === 'INSPECTION_COMPLETED';

  const pendingAssignments = assignments.filter(isPending);
  const completedAssignments = assignments.filter(isDone);
  const highPriorityPending = assignments.filter((a) => a.priority === 'HIGH' && isPending(a));
  const activeAssignment = pendingAssignments[0] || assignments[0];

  const filteredAssignments = assignments.filter((a) => {
    if (scheduleFilter === 'PENDING') return isPending(a);
    if (scheduleFilter === 'COMPLETED') return isDone(a);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Field Inspector Header with Telematics Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-indigo-300 font-semibold tracking-wider uppercase font-mono">
              GNSS Telematics Active • Zone 4 North Delhi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-heading text-white" style={{ color: '#ffffff' }}>
            {user?.name?.toLowerCase().startsWith('insp')
              ? user.name
              : user?.name
              ? `Inspector ${user.name}`
              : 'Insp. Vikram Sharma'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Badge: <span className="font-mono text-indigo-200 font-semibold">{user?.badgeNumber || 'INSP-NZ-4082'}</span> • Legal Metrology Field Enforcement Unit
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/inspector/assignments">
            <Button
              variant="primary"
              size="md"
              leftIcon={ClipboardCheck}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-md text-xs sm:text-sm"
            >
              Assignments Queue ({pendingAssignments.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Inspector Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Assigned Audits"
          value={assignments.length}
          subtitle="Active roster cycle"
          icon={ClipboardCheck}
          iconColor="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Pending Visits"
          value={pendingAssignments.length}
          subtitle="On-site verification required"
          icon={Clock}
          iconColor="text-amber-600 bg-amber-50"
        />
        <StatCard
          title="Completed Audits"
          value={completedAssignments.length}
          subtitle="Signed & submitted"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          title="High-Priority Sites"
          value={highPriorityPending.length > 0 ? highPriorityPending.length : assignments.filter((a) => a.priority === 'HIGH').length}
          subtitle="Priority queue verification"
          icon={ShieldAlert}
          iconColor="text-rose-600 bg-rose-50"
        />
      </div>

      {/* Prominent Active Inspection Card (1-Click Field Resume) */}
      {activeAssignment && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/70 to-slate-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-blue-600 text-white rounded-xl shrink-0 shadow-xs">
                <Navigation className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full font-mono">
                    {isPending(activeAssignment) ? 'Next Active Target' : 'Inspection Dossier'}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-800">{activeAssignment.id}</span>
                  <StatusBadge status={activeAssignment.priority} size="sm" />
                  <StatusBadge status={activeAssignment.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {activeAssignment.instrumentType} — {activeAssignment.businessName}
                </h3>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Slot: <strong>{activeAssignment.timeSlot || '10:30 AM - 11:45 AM'}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Geofence: <strong className="text-emerald-700">Locked (6m delta)</strong>
                  </span>
                  <span className="font-mono text-slate-500">SN: {activeAssignment.serialNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-0 border-blue-200">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/inspector/assignments/${activeAssignment.id}`)}
                rightIcon={ArrowRight}
                className="w-full md:w-auto shadow-md"
              >
                {activeAssignment.status === 'COMPLETED' ? 'Review Verification Report' : 'Launch Inspection Telematics'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Schedule & Telematics Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection Schedule Queue (2 columns on large) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Today's Inspection Schedule</h3>
              <p className="text-xs text-slate-500">Tap assignment to initiate GPS geofenced checklist</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setScheduleFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  scheduleFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({assignments.length})
              </button>
              <button
                type="button"
                onClick={() => setScheduleFilter('PENDING')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  scheduleFilter === 'PENDING'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pending ({pendingAssignments.length})
              </button>
              <button
                type="button"
                onClick={() => setScheduleFilter('COMPLETED')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  scheduleFilter === 'COMPLETED'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Done ({completedAssignments.length})
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {filteredAssignments.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/inspector/assignments/${item.id}`)}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    item.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    <Scale className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900">{item.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-xs text-slate-500">{item.applicationId}</span>
                      <StatusBadge status={item.priority} size="sm" />
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {item.instrumentType} ({item.manufacturer} {item.model})
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      {item.businessName} • SN: <span className="font-mono font-bold text-slate-800">{item.serialNumber}</span>
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{item.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Schedule Slot</span>
                    <span className="text-xs font-semibold text-slate-800">{item.timeSlot || item.scheduledDate}</span>
                  </div>
                  <Button variant="primary" size="sm" rightIcon={ArrowRight} className="mt-1">
                    {item.status === 'COMPLETED' ? 'Review Audit' : 'Start Inspection'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inspector Field Equipment & Radar Desk (1 column) */}
        <div className="space-y-4">
          {/* GPS Radar Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-900">GNSS Field Radar</h4>
              </div>
              <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                11 Sats • ±3m
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Live Latitude:</span>
                <span className="font-mono font-bold text-slate-800">28.6139° N</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Live Longitude:</span>
                <span className="font-mono font-bold text-slate-800">77.2090° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Geofence Status:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> Target Locked (50m radius)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Device Clock:</span>
                <span className="font-mono text-slate-700">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed">
              Legal metrology statutory audit requires on-site biometric/GPS timestamp locking before seal stamping.
            </div>
          </div>

          {/* Reference Standards Kit Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">Standard Test Weights Kit</h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Kit M1-NZ-408</p>
                  <p className="text-[10px] text-slate-500">10kg, 20kg, 50kg Cast Iron Blocks</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Calibrated
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Calibration Certificate</p>
                  <p className="text-[10px] text-slate-500">NABL Lab Ref: RRSL-2025-0982</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-600">Valid: Nov 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorDashboard;
