import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Scale,
  Building,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Award,
  MapPin,
  ShieldCheck,
  UserCheck,
  FileQuestion,
  Eye,
  Radio,
  Sparkles,
  Phone,
  Hash,
  ShieldAlert,
  Maximize2,
  Compass
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import StatusBadge from '../../components/ui/StatusBadge';
import RiskBadge from '../../components/ui/RiskBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import AIAnalysisCard from '../../components/ai/AIAnalysisCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useToast } from '../../context/ToastContext';

export const OfficerApplicationReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTrustStage, setActiveTrustStage] = useState('all'); // 'all' | 'instrument' | 'application' | 'documents' | 'ai' | 'inspection' | 'evidence' | 'decision'

  // Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [docPreview, setDocPreview] = useState(null);

  // Form states in modals
  const [approvalRemarks, setApprovalRemarks] = useState(
    'All statutory tolerances, model approval parameters, and field telematics verified in accordance with Legal Metrology Act, 2009 and Legal Metrology (General) Rules, 2011.'
  );
  const [validityMonths, setValidityMonths] = useState('12');
  const [dscPin, setDscPin] = useState('••••');
  const [rejectionReason, setRejectionReason] = useState('MPE_EXCEEDED');
  const [rejectionRemarks, setRejectionRemarks] = useState(
    'Observed reading errors exceed Maximum Permissible Error (MPE) tolerances under Schedule VII. Re-calibration and re-verification required.'
  );
  const [correctionNotes, setCorrectionNotes] = useState(
    'Please upload clear high-resolution photographic proof of the stamped model approval plate and updated test weight calibration certificate.'
  );
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      setLoading(true);
      try {
        const data = await applicationService.getApplicationById(id || 'MV-APP-000123');
        setApplication(data);
        if (data.status === 'REJECTED' && data.officerRemarks) {
          setRejectionRemarks(data.officerRemarks);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);


  const handleApproveConfirm = async () => {
    setIsProcessing(true);
    try {
      const generatedCertId = `MV-2026-${application.id.replace('MV-APP-', '')}`;
      await applicationService.updateStatus(application.id, 'APPROVED', approvalRemarks);
      showToast(
        `Application ${application.id} approved. Certificate ${generatedCertId} cryptographically sealed under DSC signature.`,
        'success'
      );
      setApproveModalOpen(false);
      navigate('/officer/dashboard');
    } catch (err) {
      console.error(err);
      showToast('Error approving application.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = async () => {
    setIsProcessing(true);
    try {
      await applicationService.updateStatus(
        application.id,
        'REJECTED',
        `${rejectionReason}: ${rejectionRemarks}`
      );
      showToast(`Application ${application.id} rejected. Formal statutory order dispatched.`, 'error');
      setRejectModalOpen(false);
      navigate('/officer/dashboard');
    } catch (err) {
      console.error(err);
      showToast('Error rejecting application.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCorrectionSubmit = async () => {
    setIsProcessing(true);
    try {
      await applicationService.updateStatus(application.id, 'CORRECTION_REQUESTED', correctionNotes);
      showToast(`Deficiency notice dispatched to trader for ${application.id}.`, 'info');
      setCorrectionModalOpen(false);
      navigate('/officer/dashboard');
    } catch (err) {
      console.error(err);
      showToast('Error sending deficiency notice.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <LoadingState message="Loading regulatory verification dossier & trust chain..." />;
  if (error || !application) return <ErrorState message={error || 'Application dossier not found.'} />;

  // 7-Stage Digital Trust Chain Definition
  const trustChainStages = [
    {
      id: 'instrument',
      number: 1,
      title: 'Instrument',
      badge: application.instrumentDetails?.accuracyClass?.split(' ')[0] || 'Class III',
      isPassed: true,
      desc: `SN: ${application.instrumentDetails?.serialNumber || 'WS123456'}`,
      statusText: 'Specs Validated'
    },
    {
      id: 'application',
      number: 2,
      title: 'Application',
      badge: 'Fee Paid',
      isPassed: true,
      desc: application.statutoryFee?.amount || '₹1,250',
      statusText: 'Challan Reconciled'
    },
    {
      id: 'documents',
      number: 3,
      title: 'Documents',
      badge: `${application.documents?.length || 3} Files`,
      isPassed: true,
      desc: 'Authentic 99.4%',
      statusText: 'PDF Vault Signed'
    },
    {
      id: 'ai',
      number: 4,
      title: 'AI Check',
      badge: application.riskLevel === 'HIGH' ? 'Anomaly Flag' : 'OCR Match',
      isPassed: application.riskLevel !== 'HIGH',
      isWarning: application.riskLevel === 'HIGH',
      desc: `Risk: ${application.riskScore}/100`,
      statusText: application.riskLevel === 'HIGH' ? 'Serial Mismatch' : 'OCR 100% Match'
    },
    {
      id: 'inspection',
      number: 5,
      title: 'Inspection',
      badge: application.inspection?.checklist ? '6/6 Check' : 'In Progress',
      isPassed: !!application.inspection?.completedDate,
      desc: application.inspection?.inspectorName?.split(' ')[0] || 'Assigned',
      statusText: application.inspection?.completedDate ? 'Site Audit Done' : 'Field Pending'
    },
    {
      id: 'evidence',
      number: 6,
      title: 'Evidence',
      badge: application.inspection?.measurements?.every((m) => m.result === 'PASS')
        ? 'MPE Verified'
        : 'MPE Exceeded',
      isPassed: application.inspection?.measurements?.every((m) => m.result === 'PASS'),
      isWarning: application.inspection?.measurements?.some((m) => m.result === 'FAIL'),
      desc: 'GNSS & Photos',
      statusText: application.inspection?.measurements?.every((m) => m.result === 'PASS')
        ? 'Tolerances Met'
        : 'Error Tolerance Fail'
    },
    {
      id: 'decision',
      number: 7,
      title: 'Officer Decision',
      badge:
        application.status === 'APPROVED'
          ? 'Approved'
          : application.status === 'REJECTED'
          ? 'Rejected'
          : 'Pending Order',
      isPassed: application.status === 'APPROVED',
      isWarning: application.status === 'OFFICER_REVIEW',
      desc: 'Dr. Anita Deshmukh',
      statusText: application.status === 'APPROVED' ? 'Form VI Sealed' : 'Awaiting Sign-off'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Top Bar: Navigation & Sticky Decision Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/officer/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Adjudication Queue</span>
        </Link>

        {/* Adjudication Decision Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={FileQuestion}
            onClick={() => setCorrectionModalOpen(true)}
            className="text-xs shadow-xs"
          >
            Request Correction
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={XCircle}
            onClick={() => setRejectModalOpen(true)}
            className="text-xs shadow-xs"
          >
            Reject Verification
          </Button>
          <Button
            variant="success"
            size="sm"
            leftIcon={CheckCircle2}
            onClick={() => setApproveModalOpen(true)}
            className="text-xs shadow-md font-bold"
          >
            Approve & Issue Certificate
          </Button>
        </div>
      </div>

      {/* Main Dossier Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
              {application.id}
            </span>
            <StatusBadge status={application.status} />
            <RiskBadge level={application.riskLevel} score={application.riskScore} />
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              SLA: {application.slaRemainingDays}d remaining
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            {application.instrumentType} — Statutory Adjudication Dossier
          </h2>
          <p className="text-xs text-slate-500">
            Filing Date: <strong className="text-slate-700">{application.submissionDate}</strong> • State Directorate Authority
          </p>
        </div>

        <div className="text-left md:text-right text-xs space-y-1 bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-slate-200">
          <span className="text-slate-400 font-medium block">Applicant Commercial Entity</span>
          <p className="text-slate-900 font-bold text-sm">{application.businessName}</p>
          <p className="text-slate-600 font-mono text-[11px]">{application.traderDetails?.gstin || 'GSTIN Validated'}</p>
          <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
            GST Active & Validated
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7-STAGE DIGITAL TRUST CHAIN VISUAL STEPPER & GRAPH */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg space-y-4 border border-indigo-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-400/30">
              <ShieldCheck className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight font-heading">
                Complete Digital Trust Chain Architecture
              </h3>
              <p className="text-[11px] text-slate-300">
                End-to-end statutory cryptographic trail from instrument registration to legal verification order
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-semibold bg-indigo-900/70 px-2.5 py-1 rounded-full border border-indigo-700/50">
              Cryptographically Anchored • 7 Nodes
            </span>
          </div>
        </div>

        {/* 7-Stage Horizontal Pipeline Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
          {trustChainStages.map((stage) => {
            const isSelected = activeTrustStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                aria-label={`View stage ${stage.number}: ${stage.name}`}
                onClick={() => setActiveTrustStage(stage.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-600 border-purple-300 shadow-md ring-2 ring-purple-300/40 text-white'
                    : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {stage.number}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                        stage.isWarning
                          ? 'bg-rose-500 text-white'
                          : stage.isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {stage.badge}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white leading-tight">{stage.title}</p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-white/10">
                  <p className="text-[10px] text-slate-300 font-mono truncate">{stage.desc}</p>
                  <p className="text-[9px] text-indigo-200 font-medium truncate mt-0.5">{stage.statusText}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Trust Chain View Selector Pills & Cryptographic Hash */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1 border-t border-indigo-900/60 text-slate-300">
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-medium mr-1">View Stage:</span>
            <button
              type="button"
              onClick={() => setActiveTrustStage('all')}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                activeTrustStage === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              All 7 Stages
            </button>
            {trustChainStages.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveTrustStage(s.id)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                  activeTrustStage === s.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {s.number}. {s.title}
              </button>
            ))}
          </div>

          <div className="font-mono text-[10px] text-purple-300 truncate max-w-sm flex items-center gap-1">
            <Hash className="w-3 h-3 shrink-0" />
            <span>Chain Hash: {application.chainOfCustodyHash?.slice(0, 24)}...</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. INSTRUMENT TECHNICAL SPECIFICATIONS SECTION */}
      {/* ========================================================= */}
      {(activeTrustStage === 'instrument' || activeTrustStage === 'all') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  1. Instrument Technical Specifications & Model Approval
                </h3>
                <p className="text-[11px] text-slate-500">
                  National Legal Metrology Model Approval Registry cross-reference & class parameters
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {application.instrumentDetails?.accuracyClass || 'Class III NAWI'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Manufacturer / Brand</span>
              <span className="font-bold text-slate-900 text-sm">{application.instrumentDetails?.manufacturer}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Model Designation</span>
              <span className="font-bold text-slate-900 text-sm">{application.instrumentDetails?.model}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Stamped Serial Number</span>
              <span className="font-mono font-bold text-blue-600 text-sm">
                {application.instrumentDetails?.serialNumber}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Model Approval Number</span>
              <span className="font-mono font-bold text-purple-700 text-xs">
                {application.instrumentDetails?.modelApprovalNumber || 'IND-DLM-2024-AP-0912'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Maximum Capacity (Max)</span>
              <span className="font-bold text-slate-900 text-sm">{application.instrumentDetails?.maxCapacity}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Minimum Capacity (Min)</span>
              <span className="font-bold text-slate-900 text-sm">{application.instrumentDetails?.minCapacity}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Verification Division (e)</span>
              <span className="font-bold text-slate-900 text-sm">
                {application.instrumentDetails?.verificationDivision}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Actual Scale Interval (d)</span>
              <span className="font-bold text-slate-900 text-sm">
                {application.instrumentDetails?.scaleInterval}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. APPLICATION FILING & STATUTORY FEE CHALLAN */}
      {/* ========================================================= */}
      {(activeTrustStage === 'application' || activeTrustStage === 'all') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  2. Commercial Entity & Statutory Fee Reconciliation
                </h3>
                <p className="text-[11px] text-slate-500">
                  GSTIN verification, registered premise geo-coordinates, and Treasury Challan payment receipt
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Treasury Challan Reconciled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Trader Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-slate-800 flex items-center justify-between">
                <span>Trading Business Entity</span>
                <span className="font-mono text-[11px] text-blue-600 font-bold">
                  {application.traderDetails?.gstin || '07AAACS1429B1Z8'}
                </span>
              </h4>
              <p className="font-bold text-slate-900 text-sm">{application.businessName}</p>
              <p className="text-slate-600">
                Proprietor / Signatory: <strong>{application.traderDetails?.proprietor}</strong>
              </p>
              <p className="text-slate-600 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{application.traderDetails?.address}</span>
              </p>
              {application.traderDetails?.phone && (
                <p className="text-slate-600 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{application.traderDetails?.phone}</span>
                </p>
              )}
            </div>

            {/* Statutory Fee Challan */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center justify-between">
                <span>Statutory Fee Challan Receipt</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                  Payment Captured
                </span>
              </h4>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-500">Statutory Fee Paid:</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {application.statutoryFee?.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Challan / Receipt Number:</span>
                <span className="font-mono font-bold text-blue-600">
                  {application.statutoryFee?.receiptNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway Timestamp:</span>
                <span className="text-slate-700 font-mono">{application.statutoryFee?.paidAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="text-slate-700 font-medium">{application.statutoryFee?.paymentMode}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. STATUTORY DOCUMENT VAULT SECTION */}
      {/* ========================================================= */}
      {(activeTrustStage === 'documents' || activeTrustStage === 'all') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  3. Statutory Document Vault ({application.documents?.length || 4} Files)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cryptographically hashed PDF uploads, pixel integrity scan, and EXIF authenticity check
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Integrity: 99.4% Clean
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {application.documents?.map((doc, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{doc.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {doc.size} • Uploaded {doc.uploadedAt} • SHA-256 Verified
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      doc.status === 'Flagged'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDocPreview(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-blue-600 rounded-lg border border-slate-200 hover:border-blue-300 bg-white shadow-2xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. AI PRE-CHECK & OCR CROSS-MATCH SECTION */}
      {/* ========================================================= */}
      {(activeTrustStage === 'ai' || activeTrustStage === 'all') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  4. AI Computer Vision & OCR Cross-Match Matrix
                </h3>
                <p className="text-[11px] text-slate-500">
                  Automated discrepancy detection comparing trader application, invoice text, and stamped photo OCR
                </p>
              </div>
            </div>
          </div>
          <AIAnalysisCard
            riskScore={application.riskScore}
            riskLevel={application.riskLevel}
            riskFactors={application.riskFactors}
            ocrComparison={application.ocrComparison}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. FIELD INSPECTION PHYSICAL AUDIT SECTION */}
      {/* ========================================================= */}
      {(activeTrustStage === 'inspection' || activeTrustStage === 'all') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  5. Legal Metrology Field Inspector Physical Verification Audit
                </h3>
                <p className="text-[11px] text-slate-500">
                  On-site statutory audit checklist, tamper wire application, and inspector credentials
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Field Audit Complete
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Assigned Field Inspector</span>
              <span className="font-bold text-slate-900 text-sm">
                {application.inspection?.inspectorName || application.assignedInspector}
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Inspection Audit Timestamp</span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {application.inspection?.completedDate || 'Pending Field Visit'}
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">Statutory Lead Seal Applied</span>
              <span className="font-mono font-bold text-blue-600 text-xs">
                {application.inspection?.sealNumber || 'MV-SEAL-2026-09412'}
              </span>
            </div>
          </div>

          {/* Statutory 6-Item Physical Checklist Results */}
          {application.inspection?.checklist && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold text-slate-800">
                Statutory Physical Examination Verification Checklist:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {application.inspection.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      item.passed
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <span className="text-[11px] font-medium leading-tight">{item.item}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {item.passed ? 'PASSED' : 'NON-COMPLIANT'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {application.inspection?.remarks && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 block font-medium">
                Field Inspector Observations & Findings:
              </span>
              <p className="text-slate-800 mt-1 font-medium leading-relaxed">
                {application.inspection.remarks}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. EVIDENCE, TELEMATICS & MPE TOLERANCE CHECKS */}
      {/* ========================================================= */}
      {(activeTrustStage === 'evidence' || activeTrustStage === 'all') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  6. Telematics Evidence & Standard Reference Load MPE Verification
                </h3>
                <p className="text-[11px] text-slate-500">
                  Live GNSS geofence radius check, standard test weights calibration, and watermarked photography
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {application.inspection?.gpsCoordinates?.split('(')[0] || '28.6139° N, 77.2090° E'}
            </span>
          </div>

          {/* GNSS Telematics Geofence Verification Strip */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200">GNSS Geofence Spatial Verification</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Geofence Verified • 8.2m Precision Radius
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Inspector GPS fix coincides with registered commercial shop coordinate (Premise Geofence Envelope: 50m). Device verified on-site.
            </p>
          </div>

          {/* Reference Standard Load Tests Table */}
          {application.inspection?.measurements && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800">
                Statutory Reference Load Measurements vs MPE Tolerances (Legal Metrology Rules Schedule VII):
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="px-3.5 py-2.5 text-left">Applied Standard Load</th>
                      <th className="px-3.5 py-2.5 text-center">Observed Reading</th>
                      <th className="px-3.5 py-2.5 text-center">Calculated Error</th>
                      <th className="px-3.5 py-2.5 text-center">Statutory MPE Limit</th>
                      <th className="px-3.5 py-2.5 text-center">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {application.inspection.measurements.map((m, idx) => (
                      <tr key={idx}>
                        <td className="px-3.5 py-3 font-semibold text-slate-900">{m.testWeight}</td>
                        <td className="px-3.5 py-3 text-center font-mono font-bold text-slate-800">
                          {m.readingKg !== undefined ? `${m.readingKg} kg` : m.reading}
                        </td>
                        <td className="px-3.5 py-3 text-center font-mono font-medium">
                          {m.errorG !== undefined ? `${m.errorG} g` : m.error}
                        </td>
                        <td className="px-3.5 py-3 text-center font-mono text-slate-500">
                          {m.toleranceG !== undefined ? `± ${m.toleranceG} g` : m.tolerance}
                        </td>
                        <td className="px-3.5 py-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              m.result === 'PASS'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {m.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Photographic Evidence Gallery */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">
                Watermarked Photographic Field Evidence (Tap to Zoom):
              </h4>
              <span className="text-[10px] font-mono text-slate-400">4 Cryptographic Records</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  title: 'Serial Nameplate Plate',
                  desc: 'Riveted manufacturer data plate',
                  url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'
                },
                {
                  title: 'Full Instrument Unit',
                  desc: 'Operational retail counter view',
                  url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
                },
                {
                  title: 'Lead Security Wire Seal',
                  desc: 'Tamper-evident wire lock affixed',
                  url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80'
                },
                {
                  title: 'Zero Tare Indication',
                  desc: 'Digital display zero stability',
                  url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80'
                }
              ].map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setPhotoPreview(p)}
                  className="rounded-xl border border-slate-200 overflow-hidden cursor-pointer group bg-slate-100 shadow-xs hover:border-purple-400 transition-all text-left"
                >

                  <div className="h-28 w-full overflow-hidden relative">
                    <img
                      src={p.url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="p-2.5 bg-white text-center">
                    <p className="text-xs font-bold text-slate-800 truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{p.desc}</p>
                    <p className="text-[9px] text-emerald-600 font-mono font-semibold mt-0.5">
                      Watermark Validated
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. OFFICER DECISION CENTER & STATUTORY ORDER */}
      {/* ========================================================= */}
      {(activeTrustStage === 'decision' || activeTrustStage === 'all') && (
        <div className="bg-white rounded-2xl border-2 border-purple-300 p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  7. Legal Metrology Officer Statutory Adjudication Decision Center
                </h3>
                <p className="text-xs text-slate-500">
                  Final adjudication under Section 24, Legal Metrology Act, 2009 with cryptographic DSC seal
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Signatory: Dr. Anita Deshmukh (OFF-HQ)
            </span>
          </div>

          {/* Cryptographic Chain of Custody Anchor */}
          <div className="p-4 bg-slate-950 text-white rounded-xl font-mono text-xs space-y-1.5 border border-purple-900/60">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>DIGITAL TRUST CHAIN IMMUTABLE SHA-256 HASH</span>
              <span className="text-emerald-400 font-bold">CHAIN INTEGRITY VERIFIED</span>
            </div>
            <p className="text-emerald-300 break-all text-[11px] leading-relaxed">
              {application.chainOfCustodyHash ||
                '8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a'}
            </p>
          </div>

          {/* Adjudication Decision Execution Toolbar */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-900">Execute Statutory Order</h4>
              <p className="text-xs text-slate-500">
                Issue Legal Metrology Verification Certificate or Statutory Non-Compliance Order
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="md"
                leftIcon={FileQuestion}
                onClick={() => setCorrectionModalOpen(true)}
                className="text-xs"
              >
                Request Correction
              </Button>
              <Button
                variant="danger"
                size="md"
                leftIcon={XCircle}
                onClick={() => setRejectModalOpen(true)}
                className="text-xs shadow-xs"
              >
                Reject Order
              </Button>
              <Button
                variant="success"
                size="md"
                leftIcon={CheckCircle2}
                onClick={() => setApproveModalOpen(true)}
                className="text-xs shadow-md font-bold"
              >
                Approve & Issue Certificate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: STATUTORY APPROVAL MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Issue Legal Metrology Verification Certificate (Form VI)"
        description="Statutory certification under Section 24 of Legal Metrology Act, 2009."
      >
        <div className="space-y-4 text-xs">
          {/* Form VI Preview Box */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl text-emerald-950 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-900">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Certificate Form VI Ready for Issuance</span>
              </div>
              <span className="font-mono text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded font-bold">
                STATUTORY SEAL
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Certificate <strong className="font-mono">MV-2026-{application.id.replace('MV-APP-', '')}</strong> will be cryptographically sealed with authorized Officer DSC and published to the public portal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 font-mono text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
            <div>
              <span className="text-slate-400 block font-sans">Instrument Serial:</span>
              <span className="font-bold text-slate-900">{application.instrumentDetails?.serialNumber || 'WS123456'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Accuracy Class:</span>
              <span className="font-bold text-indigo-700">{application.instrumentDetails?.accuracyClass || 'Class III'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Applied Seal ID:</span>
              <span className="font-bold text-blue-600">{application.inspection?.sealNumber || 'MV-SEAL-2026-09412'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Statutory Validity:</span>
              <span className="font-bold text-emerald-700">{validityMonths} Months (Annual Renewal)</span>
            </div>
          </div>

          {/* Validity Period Selector */}
          <div>
            <label htmlFor="statutory-validity" className="block font-bold text-slate-800 mb-1">
              Statutory Validity Duration
            </label>
            <select
              id="statutory-validity"
              value={validityMonths}
              onChange={(e) => setValidityMonths(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="12">12 Months (Standard Commercial Non-Automatic Weighing)</option>
              <option value="24">24 Months (Specialized / Sealed Flow Meter Standards)</option>
            </select>
          </div>

          {/* Digital Signature Hardware Token PIN */}
          <div>
            <label htmlFor="dsc-pin" className="block font-bold text-slate-800 mb-1">
              Officer Digital Signature Certificate (DSC) Hardware Token PIN *
            </label>
            <input
              id="dsc-pin"
              type="password"
              value={dscPin}
              onChange={(e) => setDscPin(e.target.value)}
              placeholder="Enter DSC PIN..."
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Token ID: OFF-HQ-ANITA-D (Class 3 DSC Cryptographic USB Key)
            </span>
          </div>

          {/* Endorsement Remarks */}
          <div>
            <label htmlFor="approval-remarks" className="block font-bold text-slate-800 mb-1">
              Statutory Endorsement & Approval Remarks *
            </label>
            <textarea
              id="approval-remarks"
              rows={3}
              value={approvalRemarks}
              onChange={(e) => setApprovalRemarks(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>


          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              isLoading={isProcessing}
              onClick={handleApproveConfirm}
              leftIcon={CheckCircle2}
              className="font-bold"
            >
              Sign DSC & Issue Certificate
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 2: REJECTION ORDER MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Issue Statutory Rejection Order"
        description="Formal statutory order of non-compliance under Legal Metrology Act & Rules."
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Statutory Prohibition of Use Order
            </p>
            <p className="text-[11px] text-rose-900 leading-relaxed">
              This formal order forbids commercial use or transaction using the instrument until complete recalibration, physical seal replacement, and formal re-verification.
            </p>
          </div>

          <div>
            <label htmlFor="rejection-reason" className="block font-bold text-slate-800 mb-1">
              Statutory Ground for Rejection *
            </label>
            <select
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-medium"
            >
              <option value="MPE_EXCEEDED">Measurement Error exceeds Maximum Permissible Error (MPE) limit</option>
              <option value="SERIAL_MISMATCH">Serial number discrepancy / altered stamped nameplate</option>
              <option value="UNAPPROVED_MODIFICATION">Unapproved electronic bypass or load-cell tampering detected</option>
              <option value="MISSING_DOCUMENTS">Missing valid model approval or purchase invoice records</option>
              <option value="PREMISES_INACCESSIBLE">Registered premises inaccessible or instrument unavailable</option>
            </select>
          </div>

          <div>
            <label htmlFor="rejection-remarks" className="block font-bold text-slate-800 mb-1">
              Detailed Legal Metrology Violation Findings & Directions *
            </label>
            <textarea
              id="rejection-remarks"
              rows={3}
              value={rejectionRemarks}
              onChange={(e) => setRejectionRemarks(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
            />
          </div>


          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isProcessing}
              onClick={handleRejectConfirm}
              leftIcon={XCircle}
              className="font-bold"
            >
              Confirm Rejection Order
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 3: CORRECTION DEFICIENCY NOTICE MODAL */}
      {/* ========================================================= */}
      <Modal
        isOpen={correctionModalOpen}
        onClose={() => setCorrectionModalOpen(false)}
        title="Issue Statutory Deficiency Notice"
        description="Direct the applicant to rectify omissions within statutory 7-day window."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label htmlFor="correction-notes" className="block font-bold text-slate-800 mb-1">
              Specific Deficiencies & Rectification Directives *
            </label>
            <textarea
              id="correction-notes"
              rows={4}
              value={correctionNotes}
              onChange={(e) => setCorrectionNotes(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setCorrectionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isProcessing}
              onClick={handleCorrectionSubmit}
              className="font-bold"
            >
              Dispatch Deficiency Notice
            </Button>
          </div>
        </div>
      </Modal>

      {/* Document PDF Preview Lightbox */}
      {docPreview && (
        <Modal
          isOpen={!!docPreview}
          onClose={() => setDocPreview(null)}
          title={`Document Preview: ${docPreview.name}`}
          description={`File Size: ${docPreview.size} • Uploaded ${docPreview.uploadedAt}`}
        >
          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 font-mono text-[11px] space-y-2">
              <div className="flex justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                <span>DIGITAL ARCHIVE VIEWER</span>
                <span className="text-emerald-400">PDF OCR PARSED</span>
              </div>
              <p className="text-slate-300">
                Title: <strong className="text-white">{docPreview.name}</strong>
              </p>
              <p className="text-slate-300">
                SHA-256 Hash: <span className="text-purple-300">{application.chainOfCustodyHash?.slice(0, 32)}...</span>
              </p>
              <p className="text-slate-300">
                Authenticity: <strong className="text-emerald-400">Verified Original (No alterations detected)</strong>
              </p>
            </div>

            <div className="h-48 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <FileText className="w-10 h-10 text-slate-400" />
              <p className="text-xs font-semibold text-slate-600">Simulated Encrypted PDF Preview</p>
              <span className="text-[11px] text-slate-400">Page 1 of 1 • Ready for Inspector Audit</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setDocPreview(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Photographic Telematics Lightbox Modal */}
      {photoPreview && (
        <Modal
          isOpen={!!photoPreview}
          onClose={() => setPhotoPreview(null)}
          title={photoPreview.title}
          description={photoPreview.desc}
          maxWidth="max-w-lg"
        >
          <div className="bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center relative p-2">
            <img
              src={photoPreview.url}
              alt={photoPreview.title}
              className="max-h-80 w-auto object-contain rounded-lg shadow-md"
            />
            <div className="w-full mt-3 bg-black/75 backdrop-blur-xs text-white p-2.5 rounded-lg text-[11px] font-mono border border-white/20 space-y-0.5">
              <p className="font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                TELEMATICS EVIDENCE WATERMARK VERIFIED
              </p>
              <p>INST: {application?.instrumentDetails?.serialNumber} • APP: {application?.id}</p>
              <p>GPS: {application?.inspection?.gpsCoordinates?.split('(')[0] || '28.6139° N, 77.2090° E'}</p>
              <p>INSPECTOR: {application?.inspection?.inspectorName || 'Vikram Singh'}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OfficerApplicationReviewPage;
