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
  Compass,
  ExternalLink
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import { notificationService } from '../../services/notificationService';
import StatusBadge from '../../components/ui/StatusBadge';
import RiskBadge from '../../components/ui/RiskBadge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import AIAnalysisCard from '../../components/ai/AIAnalysisCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const OfficerApplicationReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t, isHindi } = useLanguage();

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
        const data = await applicationService.getApplicationById(id || 'MV-APP-438242');
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
      const generatedCertId = `MV-2026-${(application.id || '').replace('MV-APP-', '')}`;
      await applicationService.updateStatus(application.id, 'APPROVED', approvalRemarks);

      // Notify Business user that certificate has been issued and approved
      notificationService.addNotification({
        recipientRole: 'BUSINESS',
        type: 'CERT_ISSUED',
        title: `Verification Certificate Active (${generatedCertId})`,
        titleHi: `सत्यापन प्रमाणपत्र सक्रिय (${generatedCertId})`,
        message: `Application ${application.id} has been formally approved by Authorized Legal Metrology Officer. Certificate ${generatedCertId} is active.`,
        messageHi: `आवेदन ${application.id} विधिक मापविज्ञान अधिकारी द्वारा स्वीकृत कर दिया गया है। प्रमाणपत्र ${generatedCertId} सक्रिय है।`,
        link: `/business/certificates/${generatedCertId}`
      });

      showToast(
        `Application ${application.id} approved! Opening Form VI Certificate ${generatedCertId}...`,
        'success'
      );
      setApproveModalOpen(false);
      navigate(`/officer/certificates/${generatedCertId}`);
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

      // Notify Business user of statutory rejection
      notificationService.addNotification({
        recipientRole: 'BUSINESS',
        type: 'AI_DISCREPANCY',
        title: `Statutory Order Issued (${application.id})`,
        titleHi: `वैधानिक आदेश जारी (${application.id})`,
        message: `Application ${application.id} rejected under Legal Metrology Act: ${rejectionReason}.`,
        messageHi: `आवेदन ${application.id} विधिक मापविज्ञान अधिनियम के तहत अस्वीकृत: ${rejectionReason}।`,
        link: `/business/applications/${application.id}`
      });

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

      // Notify Business user of deficiency notice
      notificationService.addNotification({
        recipientRole: 'BUSINESS',
        type: 'STATUTORY_ALERT',
        title: `Deficiency Notice (${application.id})`,
        titleHi: `त्रुटि सुधार सूचना (${application.id})`,
        message: `Officer requested documentation correction: ${correctionNotes}.`,
        messageHi: `सत्यापन अधिकारी ने दस्तावेज़ सुधार का अनुरोध किया: ${correctionNotes}।`,
        link: `/business/applications/${application.id}`
      });

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

  // Normalize checklist items whether provided as object or array
  const getChecklistItems = (checklist) => {
    if (!checklist) return [];
    if (Array.isArray(checklist)) {
      return checklist.map((c) => ({
        item: c.item || c.title || c.label || 'Inspection Requirement',
        passed: c.passed !== undefined ? c.passed : (c.checked !== undefined ? c.checked : true)
      }));
    }
    if (typeof checklist === 'object') {
      const labels = {
        instrumentAvailable: isHindi ? 'निरीक्षण के लिए साइट पर उपकरण उपलब्ध' : 'Instrument Available On-Site for Inspection',
        serialNumberVisible: isHindi ? 'स्टैम्प्ड सीरियल नंबर साफ एवं पठनीय' : 'Stamped Serial Number Clean & Legible',
        manufacturerDetailsVisible: isHindi ? 'मॉडल एवं निर्माता प्लेट अक्षुण्ण' : 'Model & Manufacturer Plate Intact',
        displayFunctioning: isHindi ? 'डिजिटल डिस्प्ले एवं शून्य संकेतक चालू' : 'Digital Display & Zero Indicator Operational',
        requiredMarkingsVisible: isHindi ? 'वैधानिक सत्यापन चिन्हांकन प्रदर्शित' : 'Statutory Verification Markings Displayed',
        requiredDocumentsAvailable: isHindi ? 'मॉडल अनुमोदन दस्तावेज़ीकरण मान्य' : 'Model Approval Documentation Valid',
        visualInspection: isHindi ? 'दृश्य निरीक्षण एवं आवरण अखंडता' : 'Visual Inspection & Housing Integrity',
        sealingIntact: isHindi ? 'अंशांकन छेड़छाड़-रोधी सील बाड़े अक्षुण्ण' : 'Calibration Tamper Seal Enclosure Intact',
        zeroErrorCheck: isHindi ? 'शून्य टेयर संतुलन एवं केंद्रित स्तर वायल' : 'Zero Tare Balance & Centered Level Vial',
        repeatabilityPass: isHindi ? 'बहु-परीक्षण दोहराव सहनशीलता अनुरूप' : 'Multi-Trial Repeatability Tolerance Compliant'
      };
      return Object.entries(checklist).map(([key, val]) => ({
        item: labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
        passed: Boolean(val)
      }));
    }
    return [];
  };

  // Normalize measurements whether stringified, partial, or formatted
  const getMeasurementsList = (measurements) => {
    if (!measurements) return [];
    let list = measurements;
    if (typeof list === 'string') {
      try { list = JSON.parse(list); } catch { return []; }
    }
    if (!Array.isArray(list)) return [];
    return list.map((m) => {
      const load = m.testWeightKg !== undefined ? m.testWeightKg : (m.loadKg !== undefined ? m.loadKg : (m.testWeight ? parseFloat(String(m.testWeight).replace(/[^0-9.]/g, '')) : 5));
      const reading = m.indicatedWeightKg !== undefined ? m.indicatedWeightKg : (m.readingKg !== undefined ? m.readingKg : (m.reading ? parseFloat(String(m.reading).replace(/[^0-9.]/g, '')) : load));
      const errG = m.errorG !== undefined ? m.errorG : (m.error !== undefined ? m.error : Math.round(Math.abs(Number(reading) - Number(load)) * 1000));
      const tolG = m.toleranceG !== undefined ? m.toleranceG : (m.tolerance !== undefined ? m.tolerance : 5);
      const res = m.result || (Math.abs(Number(errG) || 0) <= (typeof tolG === 'number' ? tolG : 10) ? 'PASS' : 'FAIL');
      return {
        testWeight: m.testWeight || `${load} kg Class M1 Standard Test Block`,
        readingKg: reading,
        errorG: errG,
        toleranceG: tolG,
        result: res
      };
    });
  };

  const checklistItems = getChecklistItems(application.inspection?.checklist);
  const measurementsList = getMeasurementsList(application.inspection?.measurements);

  // 7-Stage Digital Trust Chain Definition
  const trustChainStages = [
    {
      id: 'instrument',
      number: 1,
      title: isHindi ? 'उपकरण' : 'Instrument',
      badge: application.instrumentDetails?.accuracyClass?.split(' ')[0] || (isHindi ? 'वर्ग III' : 'Class III'),
      isPassed: true,
      desc: `SN: ${application.instrumentDetails?.serialNumber || 'WS123456'}`,
      statusText: isHindi ? 'विनिर्देश मान्य' : 'Specs Validated'
    },
    {
      id: 'application',
      number: 2,
      title: isHindi ? 'आवेदन' : 'Application',
      badge: isHindi ? 'शुल्क भुगतान पूर्ण' : 'Fee Paid',
      isPassed: true,
      desc: application.statutoryFee?.amount || '₹1,250',
      statusText: isHindi ? 'चालान समाधान' : 'Challan Reconciled'
    },
    {
      id: 'documents',
      number: 3,
      title: isHindi ? 'दस्तावेज़' : 'Documents',
      badge: `${application.documents?.length || 3} ${isHindi ? 'फ़ाइलें' : 'Files'}`,
      isPassed: true,
      desc: isHindi ? 'प्रामाणिक 99.4%' : 'Authentic 99.4%',
      statusText: isHindi ? 'हस्ताक्षरित पीडीएफ वॉल्ट' : 'PDF Vault Signed'
    },
    {
      id: 'ai',
      number: 4,
      title: isHindi ? 'एआई जांच' : 'AI Check',
      badge: application.riskLevel === 'HIGH' ? (isHindi ? 'विसंगति ध्वज' : 'Anomaly Flag') : (isHindi ? 'ओसीआर मिलान' : 'OCR Match'),
      isPassed: application.riskLevel !== 'HIGH',
      isWarning: application.riskLevel === 'HIGH',
      desc: `${isHindi ? 'जोखिम:' : 'Risk:'} ${application.riskScore}/100`,
      statusText: application.riskLevel === 'HIGH' ? (isHindi ? 'सीरियल बेमेल' : 'Serial Mismatch') : (isHindi ? 'ओसीआर 100% मिलान' : 'OCR 100% Match')
    },
    {
      id: 'inspection',
      number: 5,
      title: isHindi ? 'निरीक्षण' : 'Inspection',
      badge: checklistItems.length > 0 ? `${checklistItems.filter(c => c.passed).length}/${checklistItems.length} ${isHindi ? 'जांच' : 'Check'}` : (isHindi ? 'प्रगति में' : 'In Progress'),
      isPassed: !!application.inspection?.completedDate,
      desc: application.inspection?.inspectorName?.split(' ')[0] || (isHindi ? 'नियुक्त' : 'Assigned'),
      statusText: application.inspection?.completedDate ? (isHindi ? 'साइट ऑडिट पूर्ण' : 'Site Audit Done') : (isHindi ? 'फील्ड लंबित' : 'Field Pending')
    },
    {
      id: 'evidence',
      number: 6,
      title: isHindi ? 'साक्ष्य' : 'Evidence',
      badge: measurementsList.length > 0 && measurementsList.every((m) => m.result === 'PASS')
        ? (isHindi ? 'एमपीई सत्यापित' : 'MPE Verified')
        : (measurementsList.length === 0 ? (isHindi ? 'फील्ड ऑडिट लंबित' : 'Pending Field Audit') : (isHindi ? 'एमपीई सीमा पार' : 'MPE Exceeded')),
      isPassed: measurementsList.length > 0 && measurementsList.every((m) => m.result === 'PASS'),
      isWarning: measurementsList.some((m) => m.result === 'FAIL'),
      desc: isHindi ? 'जीएनएसएस व फोटो' : 'GNSS & Photos',
      statusText: measurementsList.length > 0 && measurementsList.every((m) => m.result === 'PASS')
        ? (isHindi ? 'सहनशीलता संतुष्ट' : 'Tolerances Met')
        : (measurementsList.length === 0 ? (isHindi ? 'फील्ड दौरे की प्रतीक्षा' : 'Awaiting Field Visit') : (isHindi ? 'त्रुटि सीमा विफल' : 'Error Tolerance Fail'))
    },
    {
      id: 'decision',
      number: 7,
      title: isHindi ? 'अधिकारी निर्णय' : 'Officer Decision',
      badge:
        application.status === 'APPROVED'
          ? (isHindi ? 'स्वीकृत' : 'Approved')
          : application.status === 'REJECTED'
          ? (isHindi ? 'अस्वीकृत' : 'Rejected')
          : (isHindi ? 'आदेश लंबित' : 'Pending Order'),
      isPassed: application.status === 'APPROVED',
      isWarning: application.status === 'OFFICER_REVIEW',
      desc: 'Dr. Anita Deshmukh',
      statusText: application.status === 'APPROVED' ? (isHindi ? 'फॉर्म VI सील' : 'Form VI Sealed') : (isHindi ? 'हस्ताक्षर प्रतीक्षित' : 'Awaiting Sign-off')
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
          <span>{t.backToAdjudicationQueue || (isHindi ? 'न्यायनिर्णयन कतार पर वापस' : 'Back to Adjudication Queue')}</span>
        </Link>

        {/* Adjudication Decision Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {application.status === 'APPROVED' ? (
            <>
              <Link to={`/officer/certificates/MV-2026-${(application.id || '').replace('MV-APP-', '')}`}>
                <Button
                  variant="success"
                  size="sm"
                  leftIcon={Award}
                  className="text-xs shadow-md font-bold"
                >
                  {t.viewIssuedFormVi || (isHindi ? 'जारी किया गया फॉर्म VI प्रमाणपत्र देखें' : 'View Issued Form VI Certificate')}
                </Button>
              </Link>
              <Link to={`/verify/MV-2026-${(application.id || '').replace('MV-APP-', '')}`}>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={Eye}
                  className="text-xs border-emerald-300 text-emerald-800 bg-emerald-50"
                >
                  {t.publicVerification || (isHindi ? 'सार्वजनिक सत्यापन' : 'Public Verification')}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                leftIcon={FileQuestion}
                onClick={() => setCorrectionModalOpen(true)}
                className="text-xs shadow-xs"
              >
                {t.requestCorrection || (isHindi ? 'सुधार का अनुरोध करें' : 'Request Correction')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                leftIcon={XCircle}
                onClick={() => setRejectModalOpen(true)}
                className="text-xs shadow-xs"
              >
                {t.rejectVerification || (isHindi ? 'सत्यापन अस्वीकार करें' : 'Reject Verification')}
              </Button>
              <Button
                variant="success"
                size="sm"
                leftIcon={CheckCircle2}
                onClick={() => setApproveModalOpen(true)}
                className="text-xs shadow-md font-bold"
              >
                {t.approveAndIssue || (isHindi ? 'स्वीकृत करें और प्रमाणपत्र जारी करें' : 'Approve & Issue Certificate')}
              </Button>
            </>
          )}
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
              SLA: {application.slaRemainingDays}d {isHindi ? 'शेष' : 'remaining'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            {application.instrumentType} — {t.statutoryAdjudicationDossier || (isHindi ? 'वैधानिक न्यायनिर्णयन डॉसियर' : 'Statutory Adjudication Dossier')}
          </h2>
          <p className="text-xs text-slate-500">
            {t.filingDate || (isHindi ? 'दाखिल करने की तिथि:' : 'Filing Date:')} <strong className="text-slate-700">{application.submissionDate}</strong> • {t.stateDirectorateAuthority || (isHindi ? 'राज्य निदेशालय प्राधिकरण' : 'State Directorate Authority')}
          </p>
        </div>

        <div className="text-left md:text-right text-xs space-y-1 bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-slate-200">
          <span className="text-slate-400 font-medium block">{t.applicantEntity || (isHindi ? 'आवेदक व्यावसायिक इकाई' : 'Applicant Commercial Entity')}</span>
          <p className="text-slate-900 font-bold text-sm">{application.businessName}</p>
          <p className="text-slate-600 font-mono text-[11px]">{application.traderDetails?.gstin || (isHindi ? 'जीएसटी मान्य' : 'GSTIN Validated')}</p>
          <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
            {t.gstActive || (isHindi ? 'जीएसटी सक्रिय और सत्यापित' : 'GST Active & Validated')}
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
                {t.trustChainTitle || (isHindi ? 'पूर्ण डिजिटल ट्रस्ट चेन आर्किटेक्चर' : 'Complete Digital Trust Chain Architecture')}
              </h3>
              <p className="text-[11px] text-slate-300">
                {t.trustChainSub || (isHindi ? 'उपकरण पंजीकरण से विधिक सत्यापन आदेश तक एंड-टू-एंड वैधानिक क्रिप्टोग्राफिक ट्रेल' : 'End-to-end statutory cryptographic trail from instrument registration to legal verification order')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-semibold bg-indigo-900/70 px-2.5 py-1 rounded-full border border-indigo-700/50">
              {t.cryptoAnchored || (isHindi ? 'क्रिप्टोग्राफ़िक रूप से सुरक्षित • 7 नोड्स' : 'Cryptographically Anchored • 7 Nodes')}
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
                aria-label={`View stage ${stage.number}: ${stage.title}`}
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
            <span className="text-[11px] text-slate-400 font-medium mr-1">{t.viewStage || (isHindi ? 'चरण देखें:' : 'View Stage:')}</span>
            <button
              type="button"
              onClick={() => setActiveTrustStage('all')}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                activeTrustStage === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {t.allStages || (isHindi ? 'सभी 7 चरण' : 'All 7 Stages')}
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
            <span>{t.chainHash || (isHindi ? 'चेन हैश:' : 'Chain Hash:')} {application.chainOfCustodyHash?.slice(0, 24)}...</span>
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
                  {isHindi ? '1. उपकरण तकनीकी विनिर्देश एवं मॉडल अनुमोदन' : '1. Instrument Technical Specifications & Model Approval'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHindi
                    ? 'राष्ट्रीय विधिक मापविज्ञान मॉडल अनुमोदन रजिस्ट्री क्रॉस-संदर्भ एवं श्रेणी पैरामीटर'
                    : 'National Legal Metrology Model Approval Registry cross-reference & class parameters'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {isHindi
                ? (application.instrumentDetails?.accuracyClass ? application.instrumentDetails.accuracyClass.replace('Class III', 'वर्ग III') : 'वर्ग III NAWI')
                : (application.instrumentDetails?.accuracyClass || 'Class III NAWI')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'निर्माता / ब्रांड' : 'Manufacturer / Brand'}
              </span>
              <span className="font-bold text-slate-900 text-sm">{application.instrumentDetails?.manufacturer}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'मॉडल' : 'Model Designation'}
              </span>
              <span className="font-bold text-slate-900 text-sm">{application.instrumentDetails?.model}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'स्टैम्प्ड सीरियल नंबर' : 'Stamped Serial Number'}
              </span>
              <span className="font-mono font-bold text-blue-600 text-sm">
                {application.instrumentDetails?.serialNumber}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'मॉडल अनुमोदन संख्या' : 'Model Approval Number'}
              </span>
              <span className="font-mono font-bold text-purple-700 text-xs">
                {application.instrumentDetails?.modelApprovalNumber || 'IND-DLM-2024-AP-0912'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'अधिकतम क्षमता (Max)' : 'Maximum Capacity (Max)'}
              </span>
              <span className="font-bold text-slate-900 text-sm">{application.instrumentDetails?.maxCapacity}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'न्यूनतम क्षमता (Min)' : 'Minimum Capacity (Min)'}
              </span>
              <span className="font-bold text-slate-900 text-sm">{application.instrumentDetails?.minCapacity}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'सत्यापन डिवीज़न (e)' : 'Verification Division (e)'}
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {application.instrumentDetails?.verificationDivision}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'वास्तविक पैमाना अंतराल (d)' : 'Actual Scale Interval (d)'}
              </span>
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
                  {isHindi ? '2. वाणिज्यिक इकाई एवं वैधानिक शुल्क समाधान' : '2. Commercial Entity & Statutory Fee Reconciliation'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHindi
                    ? 'जीएसटीआईएन सत्यापन, पंजीकृत परिसर भू-निर्देशांक एवं ट्रेजरी चालान भुगतान रसीद'
                    : 'GSTIN verification, registered premise geo-coordinates, and Treasury Challan payment receipt'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {isHindi ? 'ट्रेजरी चालान समाधान संपन्न' : 'Treasury Challan Reconciled'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Trader Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-slate-800 flex items-center justify-between">
                <span>{isHindi ? 'व्यावसायिक व्यावसायिक इकाई' : 'Trading Business Entity'}</span>
                <span className="font-mono text-[11px] text-blue-600 font-bold">
                  {application.traderDetails?.gstin || '07AAACS1429B1Z8'}
                </span>
              </h4>
              <p className="font-bold text-slate-900 text-sm">{application.businessName}</p>
              <p className="text-slate-600">
                {isHindi ? 'स्वामी / हस्ताक्षरकर्ता:' : 'Proprietor / Signatory:'} <strong>{application.traderDetails?.proprietor}</strong>
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
                <span>{isHindi ? 'वैधानिक शुल्क चालान रसीद' : 'Statutory Fee Challan Receipt'}</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                  {isHindi ? 'भुगतान प्राप्त' : 'Payment Captured'}
                </span>
              </h4>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-500">{isHindi ? 'वैधानिक शुल्क भुगतान:' : 'Statutory Fee Paid:'}</span>
                <span className="font-mono font-bold text-slate-900 text-base">
                  {application.statutoryFee?.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHindi ? 'चालान / रसीद संख्या:' : 'Challan / Receipt Number:'}</span>
                <span className="font-mono font-bold text-blue-600">
                  {application.statutoryFee?.receiptNo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHindi ? 'भुगतान गेटवे समय-मुहर:' : 'Payment Gateway Timestamp:'}</span>
                <span className="text-slate-700 font-mono">{application.statutoryFee?.paidAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHindi ? 'भुगतान माध्यम:' : 'Payment Channel:'}</span>
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
                  {isHindi
                    ? `3. वैधानिक दस्तावेज़ वॉल्ट (${application.documents?.length || 4} फ़ाइलें)`
                    : `3. Statutory Document Vault (${application.documents?.length || 4} Files)`}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHindi
                    ? 'क्रिप्टोग्राफ़िक रूप से हैश किए गए पीडीएफ अपलोड, पिक्सेल अखंडता स्कैन एवं ईएक्सआईएफ प्रामाणिकता जांच'
                    : 'Cryptographically hashed PDF uploads, pixel integrity scan, and EXIF authenticity check'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {isHindi ? 'अखंडता: 99.4% स्वच्छ' : 'Integrity: 99.4% Clean'}
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {(Array.isArray(application.documents) ? application.documents : []).map((doc, idx) => (
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
                      {doc.size} • {isHindi ? 'अपलोड:' : 'Uploaded'} {doc.uploadedAt} • {isHindi ? 'SHA-256 सत्यापित' : 'SHA-256 Verified'}
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
                    {doc.status === 'Flagged' ? (isHindi ? 'ध्वजांकित' : 'Flagged') : (isHindi ? 'सत्यापित' : doc.status)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDocPreview(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-blue-600 rounded-lg border border-slate-200 hover:border-blue-300 bg-white shadow-2xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'पीडीएफ देखें' : 'View PDF'}</span>
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
                  {isHindi
                    ? '4. एआई कंप्यूटर विज़न एवं ओसीआर क्रॉस-मैच मैट्रिक्स'
                    : '4. AI Computer Vision & OCR Cross-Match Matrix'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHindi
                    ? 'व्यापारी आवेदन, इनवॉइस टेक्स्ट और मुद्रांकित फोटो ओसीआर की तुलना करने वाली स्वचालित विसंगति पहचान'
                    : 'Automated discrepancy detection comparing trader application, invoice text, and stamped photo OCR'}
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
                  {isHindi
                    ? '5. विधिक मापविज्ञान फील्ड निरीक्षक भौतिक सत्यापन ऑडिट'
                    : '5. Legal Metrology Field Inspector Physical Verification Audit'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHindi
                    ? 'ऑन-साइट वैधानिक ऑडिट चेकलिस्ट, छेड़छाड़-रोधी तार एवं निरीक्षक साख'
                    : 'On-site statutory audit checklist, tamper wire application, and inspector credentials'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {isHindi ? 'फ़ील्ड ऑडिट पूर्ण' : 'Field Audit Complete'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'नियुक्त फील्ड निरीक्षक' : 'Assigned Field Inspector'}
              </span>
              <span className="font-bold text-slate-900 text-sm">
                {application.inspection?.inspectorName || application.assignedInspector}
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'निरीक्षण ऑडिट समय-मुहर' : 'Inspection Audit Timestamp'}
              </span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {application.inspection?.completedDate || (isHindi ? 'फील्ड दौरा लंबित' : 'Pending Field Visit')}
              </span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'लगाई गई वैधानिक लेड सील' : 'Statutory Lead Seal Applied'}
              </span>
              <span className="font-mono font-bold text-blue-600 text-xs">
                {application.inspection?.sealNumber || 'MV-SEAL-2026-09412'}
              </span>
            </div>
          </div>

          {/* Statutory 6-Item Physical Checklist Results */}
          {checklistItems.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold text-slate-800">
                {isHindi
                  ? 'वैधानिक भौतिक परीक्षण सत्यापन चेकलिस्ट:'
                  : 'Statutory Physical Examination Verification Checklist:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {checklistItems.map((item, idx) => (
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
                      {item.passed
                        ? (isHindi ? 'उत्तीर्ण' : 'PASSED')
                        : (isHindi ? 'गैर-अनुपालन' : 'NON-COMPLIANT')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {application.inspection?.remarks && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 block font-medium">
                {isHindi ? 'फील्ड निरीक्षक अवलोकन एवं निष्कर्ष:' : 'Field Inspector Observations & Findings:'}
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
                  {isHindi
                    ? '6. टेलीमैटिक्स साक्ष्य एवं मानक संदर्भ भार एमपीई सत्यापन'
                    : '6. Telematics Evidence & Standard Reference Load MPE Verification'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHindi
                    ? 'लाइव जीएनएसएस जियोफेंस त्रिज्या जांच, मानक परीक्षण बाट अंशांकन एवं वॉटरमार्क युक्त फोटोग्राफी'
                    : 'Live GNSS geofence radius check, standard test weights calibration, and watermarked photography'}
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
                <span className="font-bold text-slate-200">
                  {isHindi ? 'जीएनएसएस जियोफेंस स्थानिक सत्यापन' : 'GNSS Geofence Spatial Verification'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                {isHindi ? 'जियोफेंस सत्यापित • 8.2मी परिशुद्धता त्रिज्या' : 'Geofence Verified • 8.2m Precision Radius'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isHindi
                ? 'निरीक्षक का जीपीएस फिक्स पंजीकृत वाणिज्यिक दुकान के निर्देशांक से मेल खाता है (परिसर जियोफेंस दायरा: 50 मी)। उपकरण का साइट पर सत्यापन किया गया।'
                : 'Inspector GPS fix coincides with registered commercial shop coordinate (Premise Geofence Envelope: 50m). Device verified on-site.'}
            </p>
          </div>

          {/* Reference Standard Load Tests Table */}
          {measurementsList.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800">
                {isHindi
                  ? 'वैधानिक संदर्भ भार माप बनाम एमपीई सहनशीलता (विधिक मापविज्ञान नियम अनुसूची VII):'
                  : 'Statutory Reference Load Measurements vs MPE Tolerances (Legal Metrology Rules Schedule VII):'}
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="px-3.5 py-2.5 text-left">{isHindi ? 'प्रयुक्त मानक भार' : 'Applied Standard Load'}</th>
                      <th className="px-3.5 py-2.5 text-center">{isHindi ? 'प्रेक्षित पाठ्यांक' : 'Observed Reading'}</th>
                      <th className="px-3.5 py-2.5 text-center">{isHindi ? 'परिकलित त्रुटि' : 'Calculated Error'}</th>
                      <th className="px-3.5 py-2.5 text-center">{isHindi ? 'वैधानिक एमपीई सीमा' : 'Statutory MPE Limit'}</th>
                      <th className="px-3.5 py-2.5 text-center">{isHindi ? 'सत्यापन स्थिति' : 'Verification Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {measurementsList.map((m, idx) => (
                      <tr key={idx}>
                        <td className="px-3.5 py-3 font-semibold text-slate-900">
                          {isHindi
                            ? String(m.testWeight)
                                .replace(/Class M1 Standard Test Block/g, 'वर्ग M1 मानक परीक्षण ब्लॉक')
                                .replace(/Minimum Load Test/g, 'न्यूनतम भार परीक्षण')
                                .replace(/Quarter Load Test/g, 'तिमाही भार परीक्षण')
                                .replace(/Half Capacity Test/g, 'अर्ध क्षमता परीक्षण')
                                .replace(/Full Capacity Test/g, 'पूर्ण क्षमता परीक्षण')
                            : m.testWeight}
                        </td>
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
                            {m.result === 'PASS' ? (isHindi ? 'उत्तीर्ण' : 'PASS') : (isHindi ? 'विफल' : 'FAIL')}
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
                {isHindi
                  ? 'वॉटरमार्क युक्त फोटोग्राफिक फील्ड साक्ष्य (ज़ूम करने के लिए टैप करें):'
                  : 'Watermarked Photographic Field Evidence (Tap to Zoom):'}
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {isHindi ? '4 क्रिप्टोग्राफिक रिकॉर्ड' : '4 Cryptographic Records'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  id: 'plate',
                  title: isHindi ? 'सीरियल नेमप्लेट' : 'Serial Nameplate Plate',
                  desc: isHindi ? 'रिवेट की गई निर्माता डेटा प्लेट' : 'Riveted manufacturer data plate',
                  url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'
                },
                {
                  id: 'scale',
                  title: isHindi ? 'संपूर्ण उपकरण इकाई' : 'Full Instrument Unit',
                  desc: isHindi ? 'परिचालन खुदरा काउंटर दृश्य' : 'Operational retail counter view',
                  url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
                },
                {
                  id: 'seal',
                  title: isHindi ? 'लेड सुरक्षा वायर सील' : 'Lead Security Wire Seal',
                  desc: isHindi ? 'छेड़छाड़-रोधी वायर लॉक संलग्न' : 'Tamper-evident wire lock affixed',
                  url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80'
                },
                {
                  id: 'display',
                  title: isHindi ? 'शून्य टेयर संकेतक' : 'Zero Tare Indication',
                  desc: isHindi ? 'डिजिटल डिस्प्ले शून्य स्थिरता' : 'Digital display zero stability',
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
                      {isHindi ? 'वॉटरमार्क मान्य' : 'Watermark Validated'}
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
                  {isHindi
                    ? '7. विधिक मापविज्ञान अधिकारी वैधानिक न्यायनिर्णयन निर्णय केंद्र'
                    : '7. Legal Metrology Officer Statutory Adjudication Decision Center'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi
                    ? 'विधिक मापविज्ञान अधिनियम, 2009 की धारा 24 के तहत क्रिप्टोग्राफिक डीएससी सील के साथ अंतिम न्यायनिर्णयन'
                    : 'Final adjudication under Section 24, Legal Metrology Act, 2009 with cryptographic DSC seal'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              {isHindi ? 'हस्ताक्षरकर्ता: डॉ. अनीता देशमुख (मुख्यालय अधिकारी)' : 'Signatory: Dr. Anita Deshmukh (OFF-HQ)'}
            </span>
          </div>

          {/* Cryptographic Chain of Custody Anchor */}
          <div className="p-4 bg-slate-950 text-white rounded-xl font-mono text-xs space-y-1.5 border border-purple-900/60">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>{isHindi ? 'डिजिटल ट्रस्ट चेन अपरिवर्तनीय SHA-256 हैश' : 'DIGITAL TRUST CHAIN IMMUTABLE SHA-256 HASH'}</span>
              <span className="text-emerald-400 font-bold">{isHindi ? 'चेन अखंडता सत्यापित' : 'CHAIN INTEGRITY VERIFIED'}</span>
            </div>
            <p className="text-emerald-300 break-all text-[11px] leading-relaxed">
              {application.chainOfCustodyHash ||
                '8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a'}
            </p>
          </div>

          {/* Adjudication Decision Execution Toolbar */}
          {application.status === 'APPROVED' ? (
            <div className="p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-xl border border-emerald-500/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isHindi
                        ? 'वैधानिक सत्यापन प्रमाणपत्र (प्रारूप VI) क्रिप्टोग्राफिक रूप से जारी'
                        : 'Statutory Verification Certificate (Form VI) Cryptographically Issued'}
                    </h4>
                    <p className="text-[11px] text-emerald-300">
                      {isHindi
                        ? 'विधिक मापविज्ञान अधिनियम, 2009 की धारा 24 के तहत अधिकारी क्लास 3 डीएससी टोकन के साथ ई-हस्ताक्षरित'
                        : 'e-Signed under Section 24, Legal Metrology Act, 2009 with Officer Class 3 DSC Token'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-600/50">
                  MV-2026-{(application.id || '').replace('MV-APP-', '')}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-emerald-950/60 rounded-lg border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">{isHindi ? 'वैधानिक सील' : 'Statutory Seal'}</span>
                  <span className="font-mono font-bold text-white text-xs">{application.inspection?.sealNumber || 'MV-SEAL-2026-09412'}</span>
                </div>
                <div className="p-2.5 bg-emerald-950/60 rounded-lg border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">{isHindi ? 'वैधता' : 'Validity'}</span>
                  <span className="font-bold text-white text-xs">{isHindi ? '12 महीने (सक्रिय)' : '12 Months (Active)'}</span>
                </div>
                <div className="p-2.5 bg-emerald-950/60 rounded-lg border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">{isHindi ? 'हस्ताक्षरकर्ता अधिकारी' : 'Signatory Officer'}</span>
                  <span className="font-bold text-white text-xs">Dr. Anita Deshmukh</span>
                </div>
                <div className="p-2.5 bg-emerald-950/60 rounded-lg border border-emerald-800/40">
                  <span className="text-slate-400 block text-[10px]">{isHindi ? 'स्थिति' : 'Status'}</span>
                  <span className="font-bold text-emerald-400 text-xs">{isHindi ? 'सील एवं जारी' : 'SEALED & ISSUED'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Link to={`/officer/certificates/MV-2026-${(application.id || '').replace('MV-APP-', '')}`}>
                  <Button variant="success" size="sm" leftIcon={Eye} className="font-bold text-xs shadow-md">
                    {isHindi ? 'प्रारूप VI प्रमाणपत्र देखें' : 'View Form VI Certificate'}
                  </Button>
                </Link>
                <Link to={`/verify/MV-2026-${(application.id || '').replace('MV-APP-', '')}`}>
                  <Button variant="outline" size="sm" leftIcon={ExternalLink} className="text-xs bg-transparent border-emerald-600 text-emerald-300 hover:bg-emerald-900/50">
                    {isHindi ? 'सार्वजनिक सत्यापन पृष्ठ' : 'Public Verification Page'}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'वैधानिक आदेश निष्पादित करें' : 'Execute Statutory Order'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isHindi
                    ? 'विधिक मापविज्ञान सत्यापन प्रमाणपत्र या वैधानिक गैर-अनुपालन आदेश जारी करें'
                    : 'Issue Legal Metrology Verification Certificate or Statutory Non-Compliance Order'}
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
          )}
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
              <span className="text-slate-400 block font-sans">{isHindi ? 'उपकरण सीरियल:' : 'Instrument Serial:'}</span>
              <span className="font-bold text-slate-900">{application.instrumentDetails?.serialNumber || 'WS123456'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">{isHindi ? 'सटीकता वर्ग:' : 'Accuracy Class:'}</span>
              <span className="font-bold text-indigo-700">{application.instrumentDetails?.accuracyClass || 'Class III'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">{isHindi ? 'लगाई गई सील आईडी:' : 'Applied Seal ID:'}</span>
              <span className="font-bold text-blue-600">{application.inspection?.sealNumber || 'MV-SEAL-2026-09412'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">{isHindi ? 'वैधानिक वैधता:' : 'Statutory Validity:'}</span>
              <span className="font-bold text-emerald-700">{validityMonths} {isHindi ? 'महीने (वार्षिक नवीनीकरण)' : 'Months (Annual Renewal)'}</span>
            </div>
          </div>

          {/* Validity Period Selector */}
          <div>
            <label htmlFor="statutory-validity" className="block font-bold text-slate-800 mb-1">
              {t.statutoryValidityDuration || (isHindi ? 'वैधानिक वैधता अवधि' : 'Statutory Validity Duration')}
            </label>
            <select
              id="statutory-validity"
              value={validityMonths}
              onChange={(e) => setValidityMonths(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="12">{isHindi ? '12 महीने (मानक वाणिज्यिक गैर-स्वचालित तराजू)' : '12 Months (Standard Commercial Non-Automatic Weighing)'}</option>
              <option value="24">{isHindi ? '24 महीने (विशेष / सीलबंद फ्लो मीटर मानक)' : '24 Months (Specialized / Sealed Flow Meter Standards)'}</option>
            </select>
          </div>

          {/* Digital Signature Hardware Token PIN */}
          <div>
            <label htmlFor="dsc-pin" className="block font-bold text-slate-800 mb-1">
              {isHindi ? 'अधिकारी डिजिटल हस्ताक्षर प्रमाणपत्र (डीएससी) हार्डवेयर टोकन पिन *' : 'Officer Digital Signature Certificate (DSC) Hardware Token PIN *'}
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
              {isHindi ? 'वैधानिक पृष्ठांकन और अनुमोदन टिप्पणियां *' : 'Statutory Endorsement & Approval Remarks *'}
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
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button
              variant="success"
              size="sm"
              isLoading={isProcessing}
              onClick={handleApproveConfirm}
              leftIcon={CheckCircle2}
              className="font-bold"
            >
              {t.signDscAndIssue || (isHindi ? 'डीएससी ई-हस्ताक्षर करें और प्रमाणपत्र जारी करें' : 'Sign DSC & Issue Certificate')}
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
        title={t.issueRejectionOrderTitle || (isHindi ? "वैधानिक अस्वीकृति आदेश जारी करें" : "Issue Statutory Rejection Order")}
        description={isHindi ? "विधिक मापविज्ञान अधिनियम एवं नियमों के तहत गैर-अनुपालन का औपचारिक वैधानिक आदेश।" : "Formal statutory order of non-compliance under Legal Metrology Act & Rules."}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              {isHindi ? 'उपयोग का वैधानिक निषेध आदेश' : 'Statutory Prohibition of Use Order'}
            </p>
            <p className="text-[11px] text-rose-900 leading-relaxed">
              {isHindi ? 'यह औपचारिक आदेश पूर्ण पुनर्गणना, भौतिक सील प्रतिस्थापन और औपचारिक पुनर्सत्यापन तक उपकरण के उपयोग या वाणिज्यिक लेनदेन को रोकता है।' : 'This formal order forbids commercial use or transaction using the instrument until complete recalibration, physical seal replacement, and formal re-verification.'}
            </p>
          </div>

          <div>
            <label htmlFor="rejection-reason" className="block font-bold text-slate-800 mb-1">
              {isHindi ? 'अस्वीकृति के वैधानिक आधार *' : 'Statutory Ground for Rejection *'}
            </label>
            <select
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-medium"
            >
              <option value="MPE_EXCEEDED">{isHindi ? 'माप त्रुटि अधिकतम अनुमेय त्रुटि (एमपीई) सीमा से अधिक है' : 'Measurement Error exceeds Maximum Permissible Error (MPE) limit'}</option>
              <option value="SERIAL_MISMATCH">{isHindi ? 'सीरियल नंबर विसंगति / बदली हुई मोहर प्लेट' : 'Serial number discrepancy / altered stamped nameplate'}</option>
              <option value="UNAPPROVED_MODIFICATION">{isHindi ? 'अनधिकृत इलेक्ट्रॉनिक बायपास या लोड-सेल छेड़छाड़' : 'Unapproved electronic bypass or load-cell tampering detected'}</option>
              <option value="MISSING_DOCUMENTS">{isHindi ? 'वैध मॉडल अनुमोदन या खरीद चालान रिकॉर्ड गायब' : 'Missing valid model approval or purchase invoice records'}</option>
              <option value="PREMISES_INACCESSIBLE">{isHindi ? 'पंजीकृत परिसर दुर्गम या उपकरण अनुपलब्ध' : 'Registered premises inaccessible or instrument unavailable'}</option>
            </select>
          </div>

          <div>
            <label htmlFor="rejection-remarks" className="block font-bold text-slate-800 mb-1">
              {isHindi ? 'विधिक मापविज्ञान उल्लंघन निष्कर्ष और निर्देश *' : 'Detailed Legal Metrology Violation Findings & Directions *'}
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
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isProcessing}
              onClick={handleRejectConfirm}
              leftIcon={XCircle}
              className="font-bold"
            >
              {t.confirmRejectionOrder || (isHindi ? 'अस्वीकृति आदेश की पुष्टि करें' : 'Confirm Rejection Order')}
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
        title={t.issueDeficiencyNoticeTitle || (isHindi ? "वैधानिक त्रुटि निवारण नोटिस जारी करें" : "Issue Statutory Deficiency Notice")}
        description={isHindi ? "आवेदक को वैधानिक 7-दिवसीय अवधि के भीतर कमियों को दूर करने का निर्देश दें।" : "Direct the applicant to rectify omissions within statutory 7-day window."}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label htmlFor="correction-notes" className="block font-bold text-slate-800 mb-1">
              {isHindi ? 'विशिष्ट कमियां और सुधार निर्देश *' : 'Specific Deficiencies & Rectification Directives *'}
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
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isProcessing}
              onClick={handleCorrectionSubmit}
              className="font-bold"
            >
              {t.dispatchDeficiencyNotice || (isHindi ? 'त्रुटि निवारण नोटिस भेजें' : 'Dispatch Deficiency Notice')}
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
