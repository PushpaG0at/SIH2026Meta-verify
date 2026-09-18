import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Camera,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Check,
  Building,
  Scale,
  RefreshCw,
  Radio,
  Phone,
  Info,
  CheckSquare,
  X,
  FileCheck2,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { inspectionService } from '../../services/inspectionService';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import StatusBadge from '../../components/ui/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const InspectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'checklist' | 'measurements' | 'evidence' | 'summary'

  // Modal states
  const [photoModalImage, setPhotoModalImage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Tab 2: Statutory Checklist
  const [checklist, setChecklist] = useState({
    instrumentAvailable: true,
    serialNumberVisible: true,
    manufacturerDetailsVisible: true,
    displayFunctioning: true,
    requiredMarkingsVisible: true,
    levelBubbleCentered: true
  });

  // Tab 3: Measurements with dynamic MPE calculations
  const [measurements, setMeasurements] = useState([
    {
      id: 'm1',
      testWeight: '10 kg (Minimum Load Test)',
      loadKg: 10,
      readingKg: 10.000,
      errorG: 0,
      toleranceG: 10,
      result: 'PASS'
    },
    {
      id: 'm2',
      testWeight: '250 kg (Quarter Load Test)',
      loadKg: 250,
      readingKg: 250.010,
      errorG: 10,
      toleranceG: 20,
      result: 'PASS'
    },
    {
      id: 'm3',
      testWeight: '750 kg (Half Capacity Test)',
      loadKg: 750,
      readingKg: 750.015,
      errorG: 15,
      toleranceG: 20,
      result: 'PASS'
    },
    {
      id: 'm4',
      testWeight: '1500 kg (Full Capacity Test)',
      loadKg: 1500,
      readingKg: 1500.020,
      errorG: 20,
      toleranceG: 30,
      result: 'PASS'
    }
  ]);

  // Tab 4: Evidence & GPS Telematics
  const [gpsData, setGpsData] = useState({
    coords: '28.6139° N, 77.2090° E',
    accuracy: '±3.1m',
    altitude: '216m ASL',
    satellites: 11,
    status: 'LOCKED',
    distanceMeters: 6.8,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });
  const [gpsRefreshing, setGpsRefreshing] = useState(false);

  // Structured Photo Evidence
  const [photos, setPhotos] = useState([
    {
      id: 'plate',
      title: 'Nameplate & Serial Stamping',
      description: 'Clear photo showing manufacturer, model & serial plate',
      url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Today, 10:34 AM',
      uploaded: true
    },
    {
      id: 'scale',
      title: 'Overall Instrument Installation',
      description: 'Full perspective showing platform, load receiver & environment',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Today, 10:35 AM',
      uploaded: true
    },
    {
      id: 'seal',
      title: 'Security Wire & Tamper Seal',
      description: 'Close-up of calibrated lead seal or tamper indicator',
      url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Today, 10:37 AM',
      uploaded: true
    },
    {
      id: 'display',
      title: 'Zero Indication & Level Bubble',
      description: 'Display indicator showing zero tare & centered level vial',
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
      timestamp: 'Today, 10:38 AM',
      uploaded: true
    }
  ]);

  // Tab 5: Summary & Final Submission
  const [recommendation, setRecommendation] = useState('RECOMMEND_APPROVAL');
  const [sealNumber, setSealNumber] = useState('MV-SEAL-2026-09412');
  const [remarks, setRemarks] = useState(
    'Instrument verified on-site. Standard weights applied up to maximum capacity 1500 kg. All verification errors within statutory MPE tolerances. Tamper seal attached to calibration switch.'
  );
  const [inspectorDeclaration, setInspectorDeclaration] = useState(true);

  const fetchAssignment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inspectionService.getAssignmentById(id || 'INSP-2026-00104');
      setAssignment(data);
      if (data.inspectionReport) {
        if (data.inspectionReport.checklist) setChecklist(data.inspectionReport.checklist);
        if (data.inspectionReport.remarks) setRemarks(data.inspectionReport.remarks);
        if (data.inspectionReport.sealNumber) setSealNumber(data.inspectionReport.sealNumber);
        if (data.inspectionReport.recommendation) setRecommendation(data.inspectionReport.recommendation);
        if (data.inspectionReport.measurements && data.inspectionReport.measurements.length > 0) {
          setMeasurements(data.inspectionReport.measurements.map((m, idx) => ({
            id: m.id || `m_${idx}`,
            testWeight: m.testWeight || `${m.loadKg || m.testWeightKg || 10} kg Calibration Load`,
            loadKg: Number(m.loadKg !== undefined ? m.loadKg : (m.testWeightKg || 10)),
            readingKg: Number(m.readingKg !== undefined ? m.readingKg : (m.indicatedWeightKg || m.loadKg || 10)),
            errorG: Number(m.errorG !== undefined ? m.errorG : 0),
            toleranceG: Number(m.toleranceG !== undefined ? m.toleranceG : 10),
            result: m.result || 'PASS'
          })));
        }
      } else if (data.initialMeasurements && data.initialMeasurements.length > 0) {
        setMeasurements(data.initialMeasurements.map((m, idx) => ({
          id: m.id || `m_${idx}`,
          testWeight: m.testWeight || `${m.loadKg} kg Load`,
          loadKg: Number(m.loadKg || 10),
          readingKg: Number(m.readingKg !== undefined ? m.readingKg : (m.loadKg || 10)),
          errorG: Number(m.errorG || 0),
          toleranceG: Number(m.toleranceG || 10),
          result: m.result || 'PASS'
        })));
      } else if (data.maxCapacity) {
        const capStr = String(data.maxCapacity).toLowerCase();
        let capKg = parseFloat(capStr);
        if (capStr.includes('g') && !capStr.includes('kg')) {
          capKg = capKg / 1000;
        }
        if (!isNaN(capKg) && capKg > 0) {
          const p1 = Math.max(0.01, +(capKg * 0.1).toFixed(3));
          const p2 = Math.max(0.05, +(capKg * 0.25).toFixed(3));
          const p3 = Math.max(0.1, +(capKg * 0.5).toFixed(3));
          const p4 = +capKg.toFixed(3);
          const tol = Math.max(1, Math.round(capKg <= 1 ? 1 : (capKg <= 100 ? 5 : 20)));

          setMeasurements([
            { id: 'm1', testWeight: `${p1} kg (Minimum Load Test)`, loadKg: p1, readingKg: p1, errorG: 0, toleranceG: tol, result: 'PASS' },
            { id: 'm2', testWeight: `${p2} kg (Quarter Load Test)`, loadKg: p2, readingKg: p2, errorG: 0, toleranceG: tol, result: 'PASS' },
            { id: 'm3', testWeight: `${p3} kg (Half Capacity Test)`, loadKg: p3, readingKg: p3, errorG: 0, toleranceG: tol * 2, result: 'PASS' },
            { id: 'm4', testWeight: `${p4} kg (Full Capacity Test)`, loadKg: p4, readingKg: p4, errorG: 0, toleranceG: tol * 3, result: 'PASS' }
          ]);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Inspection assignment could not be retrieved');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);


  // Checklist helper
  const toggleChecklist = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const passAllChecklist = () => {
    setChecklist({
      instrumentAvailable: true,
      serialNumberVisible: true,
      manufacturerDetailsVisible: true,
      displayFunctioning: true,
      requiredMarkingsVisible: true,
      levelBubbleCentered: true
    });
    showToast('All statutory checklist items marked as verified.', 'success');
  };

  // Dynamic MPE calculator handler
  const handleReadingChange = (rowId, newReadingStr) => {
    const val = parseFloat(newReadingStr);
    setMeasurements((prev) =>
      prev.map((item) => {
        if (item.id !== rowId) return item;
        const reading = isNaN(val) ? 0 : val;
        // error in grams = (readingKg - loadKg) * 1000
        const errorG = Math.round((reading - item.loadKg) * 1000 * 10) / 10;
        const pass = Math.abs(errorG) <= item.toleranceG;
        return {
          ...item,
          readingKg: isNaN(val) ? '' : val,
          errorG,
          result: pass ? 'PASS' : 'FAIL'
        };
      })
    );
  };

  // Add custom measurement row
  const addMeasurementRow = () => {
    const newId = `m-${Date.now()}`;
    setMeasurements((prev) => [
      ...prev,
      {
        id: newId,
        testWeight: '500 kg (Mid-range Test)',
        loadKg: 500,
        readingKg: 500.0,
        errorG: 0,
        toleranceG: 20,
        result: 'PASS'
      }
    ]);
    showToast('Added custom test weight load row.', 'info');
  };

  const removeMeasurementRow = (rowId) => {
    if (measurements.length <= 1) {
      showToast('At least one standard test measurement is required.', 'warning');
      return;
    }
    setMeasurements((prev) => prev.filter((m) => m.id !== rowId));
  };

  // Refresh GPS Telematics
  const handleRefreshGps = () => {
    setGpsRefreshing(true);
    showToast('Acquiring high-precision GNSS satellite lock...', 'info');
    setTimeout(() => {
      setGpsData({
        coords: '28.6141° N, 77.2094° E',
        accuracy: '±2.4m',
        altitude: '217m ASL',
        satellites: 13,
        status: 'LOCKED',
        distanceMeters: 4.2,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      });
      setGpsRefreshing(false);
      showToast('GPS Telematics updated: Target Geofence Verified (4.2m delta).', 'success');
    }, 700);
  };

  // Upload/Retake Photo Simulation
  const handleSimulatePhotoUpload = (slotId) => {
    showToast('Capturing high-resolution camera frame...', 'info');
    setTimeout(() => {
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === slotId
            ? {
                ...p,
                uploaded: true,
                timestamp: 'Just now (Watermarked)',
                url: p.url + '&t=' + Date.now()
              }
            : p
        )
      );
      showToast('Photo evidence captured and geotagged with active telematics.', 'success');
    }, 500);
  };

  // Tab navigation helpers
  const tabs = [
    { id: 'specs', label: 'Specs', icon: Info },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'measurements', label: 'MPE Tests', icon: Scale },
    { id: 'evidence', label: 'Evidence & GPS', icon: Camera },
    { id: 'summary', label: 'Summary', icon: FileCheck2 }
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);
  const nextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };
  const prevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  // Submit Final Report
  const handleSubmitReport = async () => {
    if (!inspectorDeclaration) {
      showToast('Please certify the digital declaration before submission.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      const reportPayload = {
        checklist,
        gpsData,
        measurements,
        photosCount: photos.filter((p) => p.uploaded).length,
        recommendation,
        sealNumber,
        remarks,
        completedAt: new Date().toISOString(),
        status: 'COMPLETED'
      };
      await inspectionService.submitInspection(assignment.id, reportPayload);
      setAssignment((prev) => ({
        ...prev,
        status: 'COMPLETED',
        completedAt: reportPayload.completedAt,
        inspectionReport: reportPayload
      }));
      showToast('Field inspection successfully signed and submitted to Officer queue.', 'success');
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      showToast('Failed to submit inspection report.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Loading field inspection telematics..." />;
  if (error || !assignment) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Link
          to="/inspector/assignments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assignments Roster</span>
        </Link>
        <ErrorState
          title="Inspection Assignment Not Found"
          message={error || `Assignment '${id}' could not be located in your active roster.`}
          onRetry={fetchAssignment}
        />
      </div>
    );
  }


  const passedChecklistCount = Object.values(checklist).filter(Boolean).length;
  const passedMeasurementsCount = measurements.filter((m) => m.result === 'PASS').length;

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24">
      {/* Top Header: Sticky Compact Telematics Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/inspector/assignments"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Assignments</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {assignment.id}
            </span>
            <StatusBadge status={assignment.priority} size="sm" />
            <StatusBadge status={assignment.status} size="sm" />
          </div>
        </div>

        {/* Compact Title & Geofence Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {assignment.instrumentType}
            </h2>
            <p className="text-xs text-slate-600">
              {assignment.businessName} • SN: <span className="font-mono font-bold text-slate-900">{assignment.serialNumber}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-emerald-800 text-xs font-semibold self-start sm:self-auto">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Geofence Locked • {gpsData.distanceMeters}m</span>
          </div>
        </div>

        {/* 5-Stage Mobile Horizontal Tab Navigation */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            {tabs.map((tab) => {
              const Icon = tab.icon;

              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.id === 'checklist' && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {passedChecklistCount}/6
                    </span>
                  )}
                  {tab.id === 'measurements' && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {passedMeasurementsCount}/{measurements.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & TECHNICAL SPECIFICATIONS */}
      {/* ========================================================= */}
      {activeTab === 'specs' && (
        <div className="space-y-4">
          {/* Target Trader Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Registered Business & Premises</h3>
              </div>
              {assignment.businessPhone && (
                <a
                  href={`tel:${assignment.businessPhone}`}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call: {assignment.businessPhone}</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Business Name:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{assignment.businessName}</p>
                {assignment.contactPerson && (
                  <p className="text-slate-600 mt-0.5">{assignment.contactPerson}</p>
                )}
              </div>
              <div>
                <span className="text-slate-400 font-medium">Application Reference:</span>
                <p className="font-mono font-bold text-blue-600 text-sm mt-0.5">{assignment.applicationId}</p>
                <p className="text-slate-500 mt-0.5">Instrument ID: {assignment.instrumentId}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-medium">Premises Inspection Location:</span>
                <p className="text-slate-800 font-medium flex items-start gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{assignment.location}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Instrument Legal Metrology Specs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Instrument Technical Parameters</h3>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {assignment.accuracyClass || 'Class III NAWI'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Manufacturer</span>
                <span className="font-bold text-slate-900 text-sm">{assignment.manufacturer}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Model Designation</span>
                <span className="font-bold text-slate-900 text-sm">{assignment.model}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Serial Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{assignment.serialNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Max Capacity (Max)</span>
                <span className="font-bold text-slate-900 text-sm">{assignment.maxCapacity || '1500 kg'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Min Capacity (Min)</span>
                <span className="font-bold text-slate-900 text-sm">{assignment.minCapacity || '2 kg'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Verification Division (e)</span>
                <span className="font-bold text-slate-900 text-sm">{assignment.verificationDivision || '10 g'}</span>
              </div>
            </div>

            {/* Test Standard Required Notification */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Standard Weights Calibration Protocol:</p>
                <p className="text-blue-800 text-[11px] mt-0.5">
                  {assignment.standardWeightsRequired ||
                    'Class M1 Standard Weights (10kg, 20kg, 50kg calibrated slabs) required for full range verification.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STATUTORY PHYSICAL INSPECTION CHECKLIST */}
      {/* ========================================================= */}
      {activeTab === 'checklist' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Statutory Physical Verification Checklist
                </h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  passedChecklistCount === 6
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {passedChecklistCount} / 6 Satisfied
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tap items to toggle compliance under Legal Metrology (General) Rules
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={Check}
              onClick={passAllChecklist}
              className="text-xs self-start sm:self-auto"
            >
              Pass All Items
            </Button>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'instrumentAvailable',
                title: 'Instrument Available on Registered Premises',
                desc: 'Verified physical presence at the registered warehouse/shop address'
              },
              {
                id: 'serialNumberVisible',
                title: 'Serial Number Stamping Intact & Match',
                desc: 'Metallic serial plate is permanently attached without tampering or erasure'
              },
              {
                id: 'manufacturerDetailsVisible',
                title: 'Manufacturer Details & Model Approval Plate',
                desc: 'Includes model number, year of manufacture & approval registration mark'
              },
              {
                id: 'displayFunctioning',
                title: 'Display Indicator & Zero-Tracking Stability',
                desc: 'Digital display digits sharp, responsive tare and automatic zero stabilization'
              },
              {
                id: 'requiredMarkingsVisible',
                title: 'Statutory Verification Divisions Inscription',
                desc: 'Max, Min, and scale interval (e = 10g) clearly legible in metric units'
              },
              {
                id: 'levelBubbleCentered',
                title: 'Level Indicator & Adjustable Footings',
                desc: 'Spirit bubble vial is centered and all load-cell support footings firmly locked'
              }
            ].map((item) => {
              const isChecked = checklist[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-300 text-slate-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: REFERENCE STANDARD MEASUREMENT FORM (MPE CALCULATOR) */}
      {/* ========================================================= */}
      {activeTab === 'measurements' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Reference Standard Tests (MPE Calculator)
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {passedMeasurementsCount} of {measurements.length} Passed
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculates Error = Reading - Load against Maximum Permissible Error (MPE)
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={Plus}
              onClick={addMeasurementRow}
              className="text-xs self-start sm:self-auto"
            >
              Add Test Load
            </Button>
          </div>

          {/* Measurements Table (Responsive) */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-3 py-2.5 text-left">Test Load Condition</th>
                  <th className="px-3 py-2.5 text-center">Nominal (kg)</th>
                  <th className="px-3 py-2.5 text-center">Observed (kg)</th>
                  <th className="px-3 py-2.5 text-center">Error (g)</th>
                  <th className="px-3 py-2.5 text-center">MPE Limit</th>
                  <th className="px-3 py-2.5 text-center">Result</th>
                  <th className="px-2 py-2.5 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {measurements.map((m) => {
                  const isPass = m.result === 'PASS';
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-3 py-2.5 font-semibold text-slate-900">
                        {m.testWeight}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono font-medium text-slate-700">
                        {m.loadKg.toFixed(3)}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="number"
                          step="0.001"
                          value={m.readingKg}
                          onChange={(e) => handleReadingChange(m.id, e.target.value)}
                          className="w-24 p-1 text-center font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold">
                        <span className={m.errorG > 0 ? 'text-amber-600' : m.errorG < 0 ? 'text-blue-600' : 'text-emerald-600'}>
                          {m.errorG > 0 ? `+${m.errorG}` : m.errorG} g
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-slate-500">
                        ± {m.toleranceG} g
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                            isPass
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {m.result}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => removeMeasurementRow(m.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legal Metrology Rules Hint */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Maximum Permissible Error (MPE) for Class III Scales:
            </p>
            <p>
              • 0 to 500e (0-5kg): <strong>±1e (±10g)</strong> • 500e to 2000e (5-20kg): <strong>±2e (±20g)</strong> • &gt;2000e: <strong>±3e (±30g)</strong>
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: EVIDENCE CAPTURE & LIVE GPS TELEMATICS */}
      {/* ========================================================= */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          {/* GPS Telematics Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">Live GNSS Geofencing Telematics</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={RefreshCw}
                onClick={handleRefreshGps}
                isLoading={gpsRefreshing}
                className="text-xs"
              >
                Re-acquire Satellite Lock
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">GPS Coordinates</span>
                <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{gpsData.coords}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Satellites / Accuracy</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{gpsData.satellites} Sats • {gpsData.accuracy}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Geofence Proximity</span>
                <span className="font-bold text-emerald-700 text-xs sm:text-sm flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> {gpsData.distanceMeters}m from Target
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block font-medium">Telemetry Timestamp</span>
                <span className="font-mono font-semibold text-slate-700 text-[11px]">{gpsData.timestamp}</span>
              </div>
            </div>
          </div>

          {/* 4 Required Evidence Slots */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Statutory Photographic Evidence (Watermarked)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tap thumbnail to view high-resolution photo with GNSS watermark
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photos.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div
                      onClick={() => setPhotoModalImage(item)}
                      className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-300 relative cursor-pointer group bg-slate-200"
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{item.title}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Attached
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{item.description}</p>
                      <p className="text-[10px] text-slate-400 font-mono pt-1">
                        Locked: {item.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                    <button
                      type="button"
                      onClick={() => setPhotoModalImage(item)}
                      className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulatePhotoUpload(item.id)}
                      className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" /> Retake
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: INSPECTION SUMMARY & SUBMISSION */}
      {/* ========================================================= */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          {/* Pre-Submission Audit Scorecard */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Inspection Summary Dossier
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidated audit results ready for legal metrology sign-off
              </p>
            </div>

            {/* 4 Scorecard Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 block font-semibold">Physical Checklist</span>
                <span className="font-bold text-emerald-900 text-sm">{passedChecklistCount} / 6 Verified</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 block font-semibold">MPE Standard Tests</span>
                <span className="font-bold text-emerald-900 text-sm">
                  {passedMeasurementsCount} of {measurements.length} Within MPE
                </span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-blue-700 block font-semibold">GPS Telematics</span>
                <span className="font-bold text-blue-900 text-sm">Geofence Verified (4m)</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                <span className="text-indigo-700 block font-semibold">Photo Evidence</span>
                <span className="font-bold text-indigo-900 text-sm">4 Watermarked Photos</span>
              </div>
            </div>

            {/* Inspector Recommendation Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800">
                Statutory Inspector Recommendation
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  {
                    id: 'RECOMMEND_APPROVAL',
                    label: 'Recommend for Approval',
                    desc: 'All criteria satisfied under Act',
                    color: 'peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-900'
                  },
                  {
                    id: 'REJECT_RECALIBRATION',
                    label: 'Require Re-calibration',
                    desc: 'Error exceeds MPE limit',
                    color: 'peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-900'
                  },
                  {
                    id: 'REJECT_NONCOMPLIANT',
                    label: 'Reject / Non-Compliant',
                    desc: 'Tampering or serial mismatch',
                    color: 'peer-checked:bg-rose-50 peer-checked:border-rose-500 peer-checked:text-rose-900'
                  }
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="relative border border-slate-200 rounded-xl p-3 cursor-pointer transition-all hover:bg-slate-50 flex items-start gap-2"
                  >
                    <input
                      type="radio"
                      name="recommendation"
                      value={opt.id}
                      checked={recommendation === opt.id}
                      onChange={(e) => setRecommendation(e.target.value)}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{opt.label}</p>
                      <p className="text-[11px] text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Physical Lead Seal Input */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Statutory Verification Seal Number Attached
              </label>
              <input
                type="text"
                value={sealNumber}
                onChange={(e) => setSealNumber(e.target.value)}
                placeholder="e.g. MV-SEAL-2026-09412"
                className="w-full p-2.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Enter the embossed identification number of the tamper-evident seal applied to the instrument.
              </p>
            </div>

            {/* Remarks / Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Inspector Findings & Audit Observations
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            {/* Inspector Digital Declaration */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectorDeclaration}
                  onChange={(e) => setInspectorDeclaration(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700 leading-relaxed">
                  I, <strong>Inspector Vikram Singh (INSP-NZ-4082)</strong>, hereby declare that the physical verification
                  and reference load testing of instrument <strong>{assignment.serialNumber}</strong> were carried out in my
                  presence on-site adhering to the Legal Metrology Act, 2009 and applicable State verification rules.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STICKY BOTTOM ACTION BAR (LOW-SCROLL ERGONOMIC CONTROLS) */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:px-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTab}
            disabled={currentTabIndex === 0}
            leftIcon={ArrowLeft}
            className="text-xs"
          >
            Prev
          </Button>

          <span className="text-xs font-semibold text-slate-600 text-center truncate">
            Step {currentTabIndex + 1} of 5: <strong className="text-slate-900">{tabs[currentTabIndex].label}</strong>
          </span>

          {currentTabIndex < tabs.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={nextTab}
              rightIcon={ArrowRight}
              className="text-xs shadow-xs"
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              isLoading={submitting}
              onClick={handleSubmitReport}
              leftIcon={CheckCircle2}
              className="bg-emerald-600 hover:bg-emerald-500 text-xs shadow-md"
            >
              Submit Report
            </Button>
          )}
        </div>
      </div>

      {/* Lightbox Photo Preview Modal */}
      {photoModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPhotoModalImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{photoModalImage.title}</h4>
                <p className="text-[11px] text-slate-500 font-mono">{gpsData.coords} • {photoModalImage.timestamp}</p>
              </div>
              <button
                type="button"
                onClick={() => setPhotoModalImage(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-900 flex items-center justify-center relative">
              <img
                src={photoModalImage.url}
                alt={photoModalImage.title}
                className="max-h-80 w-auto object-contain rounded-lg"
              />
              {/* Telematics Watermark Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-xs text-white p-2.5 rounded-lg text-[11px] font-mono space-y-0.5 border border-white/20">
                <p className="font-bold text-emerald-400">METRA-VERIFY LEGAL METROLOGY TELEMATICS</p>
                <p>LAT/LNG: {gpsData.coords} (±{gpsData.accuracy})</p>
                <p>INST: {assignment.serialNumber} • INSP: {assignment.id}</p>
                <p>TIMESTAMP: {photoModalImage.timestamp}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setPhotoModalImage(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Final Submission Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Inspection Report Submitted!
              </h3>
              <p className="text-xs text-slate-600">
                The field verification dossier for <strong>{assignment.businessName}</strong> has been digitally signed and routed to the Verification Officer for certificate issuance.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left font-mono space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Dossier Reference:</span>
                <span className="font-bold text-slate-900">{assignment.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Seal ID:</span>
                <span className="font-bold text-blue-600">{sealNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Inspector Badge:</span>
                <span className="font-bold text-slate-900">INSP-NZ-4082</span>
              </div>
              <div className="flex justify-between">
                <span>Routing Target:</span>
                <span className="font-bold text-emerald-700">Dr. Anita Deshmukh (Officer Queue)</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('specs');
                }}
                className="flex-1 text-xs"
              >
                Review Report
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/inspector/dashboard')}
                className="flex-1 text-xs"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionDetailPage;
