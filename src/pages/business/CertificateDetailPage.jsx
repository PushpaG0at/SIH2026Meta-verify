import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Download,
  ExternalLink,
  Printer,
  ArrowLeft,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  Scale,
  MapPin,
  Lock,
  Radio
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { certificateService } from '../../services/certificateService';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const CertificateDetailPage = () => {
  const { id } = useParams();
  const { t, isHindi } = useLanguage();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeTab, setActiveTab] = useState('certificate'); // 'certificate' | 'details'
  const { showToast } = useToast();
  const certificateRef = useRef(null);

  const targetId = id || 'MV-CERT-000123';

  useEffect(() => {
    const fetchCert = async () => {
      setLoading(true);
      try {
        const cert = await certificateService.getCertificateById(targetId);
        if (!cert) throw new Error('Certificate not found');
        setCertificate(cert);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [targetId]);

  // Verification URL pointing to /verify/:certificateId
  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certificate?.id || targetId}`
    : `/verify/${certificate?.id || targetId}`;

  const handleCopyHash = () => {
    if (certificate?.securityHash) {
      navigator.clipboard.writeText(certificate.securityHash);
      setCopied(true);
      showToast('Cryptographic SHA-256 hash copied to clipboard', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedUrl(true);
    showToast('Public verification URL copied to clipboard', 'info');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast(`Downloading digital PDF certificate for ${certificate.id}...`, 'success');
    window.print();
  };

  if (loading) return <LoadingState message="Loading legal metrology verification certificate..." />;
  if (error || !certificate) return <ErrorState message={error || 'Certificate record not found.'} />;

    const isOfficer = typeof window !== 'undefined' && window.location.pathname.startsWith('/officer');
    const backPath = isOfficer ? '/officer/certificates' : '/business/certificates';

    return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Action Bar (hidden in print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <Link
            to={backPath}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isOfficer ? (t.backToOfficerCerts || (isHindi ? 'अधिकारी प्रमाणपत्रों पर वापस' : 'Back to Officer Certificates')) : (t.backToIssuedCerts || (isHindi ? 'जारी प्रमाणपत्रों पर वापस' : 'Back to Issued Certificates'))}</span>
          </Link>
          {isOfficer && certificate.applicationId && (
            <Link
              to={`/officer/applications/${certificate.applicationId}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-md transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>{isHindi ? 'आवेदन की समीक्षा' : 'Review Application'} {certificate.applicationId}</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct Verify Button */}
          <Link to={`/verify/${certificate.id}`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={ExternalLink}
              className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              {t.verifyCertificate || (isHindi ? 'प्रमाणपत्र सत्यापित करें' : 'Verify Certificate')}
            </Button>
          </Link>

          {/* Copy Link */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={copiedUrl ? Check : Copy}
            onClick={handleCopyUrl}
            className="text-xs"
          >
            {copiedUrl ? (t.copiedLink || (isHindi ? 'कॉपी किया गया लिंक' : 'Copied Link')) : (t.copyVerifyLink || (isHindi ? 'सत्यापन लिंक कॉपी करें' : 'Copy Verify Link'))}
          </Button>

          {/* Print Button */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={Printer}
            onClick={handlePrint}
            className="text-xs"
          >
            {t.print || (isHindi ? 'प्रिंट करें' : 'Print')}
          </Button>

          {/* Download PDF Button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={Download}
            onClick={handleDownloadPdf}
            className="text-xs bg-blue-700 hover:bg-blue-600 shadow-sm font-bold"
          >
            {t.downloadPdf || (isHindi ? 'पीडीएफ डाउनलोड करें' : 'Download PDF')}
          </Button>
        </div>
      </div>

      {/* Synthetic Demonstration Disclaimer Banner (Required: Do not claim it is an official government certificate) */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs print:hidden">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold uppercase tracking-wider text-[11px] text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded font-mono">
              {isHindi ? 'प्रदर्शन प्रमाणपत्र • सिंथेटिक रिकॉर्ड' : 'Demonstration Certificate • Synthetic Record'}
            </span>
            <span className="text-[11px] font-semibold text-amber-800">
              {isHindi ? 'आधिकारिक सरकारी प्रमाणपत्र नहीं' : 'Not an official government certificate'}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/90">
            {isHindi ? 'यह डिजिटल प्रमाणपत्र स्मार्ट इंडिया हैकथॉन (SIH) 2026 के मूल्यांकन के लिए मेट्रा-वेरीफाई प्रोटोटाइप प्लेटफॉर्म द्वारा उत्पन्न एक सिम्युलेटेड इलेक्ट्रॉनिक क्रेडेंशियल है।' : 'This digital certificate is a simulated electronic credential generated by the METRA-VERIFY prototype platform for evaluation during Smart India Hackathon (SIH) 2026.'}
          </p>
        </div>
      </div>

      {/* Tabs: Certificate Preview vs Technical Details */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('certificate')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'certificate'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{t.certPreviewTab || (isHindi ? 'प्रमाणपत्र पूर्वावलोकन (फॉर्म VI)' : 'Certificate Preview (Form VI)')}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'details'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t.certDetailsTab || (isHindi ? 'प्रमाणपत्र विवरण और टेलीमैटिक्स' : 'Certificate Details & Telematics')}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. VISUALLY PROFESSIONAL CERTIFICATE PREVIEW (FORM VI)   */}
      {/* ========================================================= */}
      {activeTab === 'certificate' && (
        <div
          ref={certificateRef}
          className="bg-white rounded-2xl border-4 border-slate-800 shadow-2xl p-6 sm:p-10 relative overflow-hidden space-y-6 print:border-2 print:shadow-none print:p-6 print:rounded-none"
        >
          {/* Subtle Guilloché Watermark Background */}
          <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#1e3a8a_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none" />

          {/* Semi-transparent Synthetic Diagonal Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
            <span className="text-7xl sm:text-8xl font-black text-slate-900 -rotate-45 uppercase tracking-widest whitespace-nowrap font-mono">
              SYNTHETIC DEMO
            </span>
          </div>

          {/* Classical Ornamental Inner Double Border */}
          <div className="border-2 border-slate-700 p-5 sm:p-8 rounded-xl space-y-6 relative bg-white/80 backdrop-blur-2xs">
            {/* Top Statutory Simulation Notice Strip */}
            <div className="text-center pb-2 border-b border-dashed border-slate-300">
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-slate-500">
                • DEMONSTRATION RECORD FOR EVALUATION • NOT AN OFFICIAL GOVERNMENT DOCUMENT •
              </span>
            </div>

            {/* Certificate Official Header */}
            <div className="text-center space-y-2 pb-5 border-b-2 border-slate-800">
              <div className="flex items-center justify-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center shadow-xs">
                  <Scale className="w-6 h-6 text-blue-300" />
                </div>
                <div className="text-left">
                  <span className="text-xl font-black tracking-tight text-blue-950 font-heading block leading-none">
                    METRA-VERIFY
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500 font-mono">
                    {isHindi ? 'विधिक मापविज्ञान डिजिटल प्लेटफॉर्म' : 'Legal Metrology Digital Platform'}
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 pt-1">
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-700">
                  {isHindi ? 'विधिक मापविज्ञान निदेशालय (प्रदर्शन वातावरण)' : 'Directorate of Legal Metrology (Demonstration Environment)'}
                </p>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide font-heading">
                  {t.certOfVerification || (isHindi ? 'सत्यापन प्रमाण-पत्र' : 'Certificate of Verification')}
                </h1>
                <p className="text-[10px] font-mono font-bold text-blue-900 uppercase tracking-wider">
                  {t.formViRules || (isHindi ? 'फॉर्म VI • [विधिक मापविज्ञान (सामान्य) नियम, 2011 — नियम 14(1) और 24 देखें]' : 'FORM VI • [See Legal Metrology (General) Rules, 2011 — Rules 14(1) & 24]')}
                </p>
              </div>

              {/* Statutory Endorsement Recital */}
              <p className="text-xs text-slate-600 max-w-2xl mx-auto italic pt-1 leading-relaxed">
                {t.certRecital || (isHindi ? '"मैं प्रमाणित करता हूँ कि मैंने आज विधिक मापविज्ञान अधिनियम, 2009 के तहत नीचे उल्लिखित वजन / माप उपकरण की जांच और सत्यापन किया है और इसे निर्धारित वैधानिक विनिर्देशों और अनुमेय त्रुटि सीमाओं के अनुरूप पाया है।"' : '"I hereby certify that I have this day examined and verified the under-mentioned weighing / measuring instrument under the Legal Metrology Act, 2009 and found it to conform with the prescribed statutory specifications and permissible error limits."')}
              </p>
            </div>

            {/* Certificate ID & Statutory Status Ribbon */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">{t.certNoLabel || (isHindi ? 'प्रमाणपत्र संख्या:' : 'Certificate No:')}</span>
                <span className="font-mono text-sm font-black text-blue-900 bg-blue-100/60 px-2 py-0.5 rounded border border-blue-200">
                  {certificate.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">{t.instRefLabel || (isHindi ? 'उपकरण संदर्भ:' : 'Instrument Ref:')}</span>
                <span className="font-mono font-bold text-slate-800">{certificate.instrumentId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">{t.legalStatusLabel || (isHindi ? 'कानूनी स्थिति:' : 'Legal Status:')}</span>
                <StatusBadge status={certificate.status} />
              </div>
            </div>

            {/* Core Statutory Specifications 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Commercial Trader Details */}
              <div className="space-y-3.5">
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    {t.licensedTraderLabel || (isHindi ? '1. लाइसेंस प्राप्त व्यापारी / व्यावसायिक इकाई' : '1. Licensed Trader / Business Entity')}
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {certificate.businessName}
                  </span>
                  <p className="text-slate-600">
                    {isHindi ? 'अनुज्ञप्तिधारी / स्वामी:' : 'Licensee / Proprietor:'} <strong className="text-slate-800">{certificate.ownerName}</strong>
                  </p>
                  <p className="text-slate-600 flex items-start gap-1 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{certificate.businessAddress}</span>
                  </p>
                  <p className="text-[11px] font-mono text-blue-700 font-semibold pt-0.5">
                    GSTIN: {certificate.gstin || '07AAACS1429B1Z8'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    {t.instClassificationLabel || (isHindi ? '2. उपकरण वर्गीकरण' : '2. Instrument Classification')}
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHindi ? 'उपकरण का प्रकार:' : 'Instrument Type:'}</span>
                    <span className="font-bold text-slate-900">{certificate.instrumentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHindi ? 'श्रेणी:' : 'Category:'}</span>
                    <span className="font-medium text-slate-700">{certificate.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHindi ? 'सटीकता वर्ग:' : 'Accuracy Class:'}</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                      {certificate.accuracyClass || 'Class III (Medium Accuracy)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Metrological Parameters & Physical Seals */}
              <div className="space-y-3.5">
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    {t.metrologicalRatingsLabel || (isHindi ? '3. मापकीय एवं तकनीकी रेटिंग' : '3. Metrological & Technical Ratings')}
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHindi ? 'मेक और मॉडल:' : 'Make & Model:'}</span>
                    <span className="font-bold text-slate-900">
                      {certificate.manufacturer} — {certificate.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.stampedSerialLabel || (isHindi ? 'अंकित सीरियल नंबर:' : 'Stamped Serial No:')}</span>
                    <span className="font-mono font-bold text-blue-700">
                      {certificate.serialNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.capacityEnvelopeLabel || (isHindi ? 'क्षमता सीमा:' : 'Capacity Envelope:')}</span>
                    <span className="font-bold text-slate-900">
                      Max: {certificate.capacity} | Min: {certificate.minCapacity || '100 g'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.verificationScaleLabel || (isHindi ? 'सत्यापन पैमाना:' : 'Verification Scale:')}</span>
                    <span className="font-mono text-slate-800">
                      {certificate.verificationDivision || 'e = 5 g, d = 1 g'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.modelApprovalRegLabel || (isHindi ? 'मॉडल अनुमोदन पंजीकरण:' : 'Model Approval Reg:')}</span>
                    <span className="font-mono font-semibold text-purple-700 text-[11px]">
                      {certificate.modelApprovalNumber || 'IND-DLM-2024-AP-0912'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    {t.securitySealValidityLabel || (isHindi ? '4. सुरक्षा सील और वैधता अवधि' : '4. Security Seal & Validity Period')}
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t.appliedSealIdLabel || (isHindi ? 'लगाई गई सील आईडी:' : 'Applied Seal ID:')}</span>
                    <span className="font-mono font-bold text-blue-700">
                      {certificate.sealNumber || 'MV-SEAL-2026-09412'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHindi ? 'मुहर लगाने की तिथि:' : 'Stamping Date:'}</span>
                    <span className="font-semibold text-slate-900">{certificate.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isHindi ? 'वैधानिक समाप्ति तिथि:' : 'Statutory Expiry Date:'}</span>
                    <span className="font-bold text-emerald-700">{certificate.validUntil}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Officer Signature, Security Hologram & QR Code Footer */}
            <div className="pt-6 border-t-2 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* QR Verification Seal (Powered by qrcode.react) */}
              <div className="flex items-center gap-3">
                <Link
                  to={`/verify/${certificate.id}`}
                  title="Scan or click to verify in public registry"
                  className="p-1.5 bg-white rounded-xl border-2 border-slate-400 hover:border-blue-500 transition-colors shrink-0 shadow-xs cursor-pointer group"
                >
                  <QRCodeSVG
                    value={verificationUrl}
                    size={96}
                    level="M"
                    includeMargin={false}
                    className="group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="text-[10px] text-slate-600 space-y-0.5">
                  <span className="font-bold text-slate-900 block text-xs">
                    {isHindi ? 'प्रामाणिकता सत्यापित करने के लिए स्कैन करें' : 'Scan to Verify Authenticity'}
                  </span>
                  <p className="text-slate-500">{isHindi ? 'लाइव सार्वजनिक रजिस्ट्री सत्यापन रूट:' : 'Encodes live public registry verification route:'}</p>
                  <p className="font-mono text-[9px] text-blue-700 font-semibold truncate max-w-[200px]">
                    /verify/{certificate.id}
                  </p>
                  <span className="inline-block text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-200">
                    {isHindi ? 'SHA-256 सत्यापित' : 'SHA-256 Validated'}
                  </span>
                </div>
              </div>

              {/* Holographic Security Emblem */}
              <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br from-amber-50 via-slate-50 to-blue-50 border border-slate-300 text-center text-[9px] font-mono text-slate-600">
                <ShieldCheck className="w-5 h-5 text-blue-900" />
                <span className="font-bold text-slate-800 mt-0.5">METRA-VERIFY</span>
                <span className="text-slate-500 text-[8px]">{isHindi ? 'डिजिटल मुहर' : 'DIGITAL STAMP'}</span>
              </div>

              {/* Officer Attestation & Signature Box */}
              <div className="text-center md:text-right space-y-1">
                <div className="inline-block border-b-2 border-slate-800 px-6 pb-1 font-serif italic text-base text-slate-900 font-bold">
                  {certificate.issuingOfficer}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-700 block tracking-wider">
                  {isHindi ? 'प्राधिकृत सत्यापन अधिकारी' : 'Authorized Verification Officer'}
                </span>
                <p className="text-[10px] text-slate-500 font-mono">
                  {isHindi ? 'राज्य विधिक मापविज्ञान सत्यापन निदेशालय' : 'State Legal Metrology Verification Directorate'}
                </p>
                <div className="flex items-center justify-center md:justify-end gap-1 text-[9px] font-mono text-emerald-700 pt-0.5">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Class 3 DSC Token: OFF-HQ-ANITA-D</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Hash Ledger Footer */}
            <div className="pt-3 border-t border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] font-mono text-slate-400">
              <span className="truncate max-w-md">
                {isHindi ? 'अपरिवर्तनीय SHA-256 हैश:' : 'IMMUTABLE SHA-256 HASH:'} {certificate.securityHash}
              </span>
              <span className="text-slate-500 font-sans font-bold">
                {isHindi ? 'मेट्रा-वेरीफाई सिंथेटिक रिकॉर्ड' : 'METRA-VERIFY SYNTHETIC RECORD'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TECHNICAL TELEMATICS & AUDIT DOSSIER TAB              */}
      {/* ========================================================= */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'प्रमाणपत्र रजिस्ट्री एवं क्रिप्टोग्राफिक कस्टडी रिकॉर्ड' : 'Certificate Registry & Cryptographic Custody Record'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? 'विस्तृत टेलीमैटिक्स, SHA-256 कस्टडी चेन और फील्ड निरीक्षण ऑडिट मेटाडेटा' : 'Deep telematics, SHA-256 chain of custody, and field inspection audit metadata'}
              </p>
            </div>
            <StatusBadge status={certificate.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Box 1: Cryptographic Block */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 border border-slate-800 font-mono">
              <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                <span>{isHindi ? 'कस्टडी चेन SHA-256 डाइजेस्ट' : 'CHAIN OF CUSTODY SHA-256 DIGEST'}</span>
                <span className="text-emerald-400 font-bold">{isHindi ? 'डिजिटल रूप से सीलबंद' : 'DIGITALLY SEALED'}</span>
              </div>
              <p className="text-emerald-300 break-all text-[11px] leading-relaxed">
                {certificate.securityHash}
              </p>
              <button
                type="button"
                onClick={handleCopyHash}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors mt-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isHindi ? 'हैश कॉपी हुआ' : 'Hash Copied') : (isHindi ? 'हैश कॉपी करें' : 'Copy Hash')}</span>
              </button>
            </div>

            {/* Box 2: Consumer QR & Verification Portal */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800">{isHindi ? 'सार्वजनिक उपभोक्ता क्यूआर सील' : 'Public Consumer QR Seal'}</h4>
                <span className="text-[10px] text-blue-600 font-mono font-bold">
                  {isHindi ? 'स्कैन:' : 'Scans:'} {certificate.verificationCount || 42}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                {isHindi ? 'उपभोक्ता और प्रवर्तन अधिकारी बिना लॉग इन किए कानूनी वैधता को तुरंत सत्यापित करने के लिए उपकरण लेबल पर इस क्यूआर कोड को स्कैन करते हैं।' : 'Consumers and enforcement officers scan this QR code on the instrument label to instantly verify legal validity without logging in.'}
              </p>
              <div className="flex items-center gap-2">
                <Link to={`/verify/${certificate.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full text-xs" leftIcon={ExternalLink}>
                    {isHindi ? 'सत्यापन पोर्टल खोलें' : 'Open Verification Portal'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleCopyUrl} className="text-xs">
                  {copiedUrl ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'यूआरएल कॉपी करें' : 'Copy URL')}
                </Button>
              </div>
            </div>

            {/* Box 3: Inspector Telematics */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'फील्ड टेलीमैटिक्स एवं जियोफेंस पुष्टि' : 'Field Telematics & Geofence Confirmation'}</span>
              </h4>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <div className="flex justify-between">
                  <span>{isHindi ? 'निरीक्षक परिचय:' : 'Inspector Credential:'}</span>
                  <span className="font-bold text-slate-900">Vikram Singh (INSP-NZ-4082)</span>
                </div>
                <div className="flex justify-between">
                  <span>{isHindi ? 'जीएनएसएस जियोफेंस मिलान:' : 'GNSS Geofence Match:'}</span>
                  <span className="font-bold text-emerald-700">28.6139° N, 77.2090° E ({isHindi ? '8.2मी विचलन' : '8.2m deviation'})</span>
                </div>
                <div className="flex justify-between">
                  <span>{isHindi ? 'छेड़छाड़-रोधी लेड सील आईडी:' : 'Tamper Lead Seal ID:'}</span>
                  <span className="font-mono font-bold text-blue-600">{certificate.sealNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isHindi ? 'बेसलाइन अंशांकन:' : 'Baseline Calibration:'}</span>
                  <span className="font-bold text-slate-900">{isHindi ? 'वर्ग M1 अंशांकित बाट (50किग्रा)' : 'Class M1 Calibrated Weights (50kg)'}</span>
                </div>
              </div>
            </div>

            {/* Box 4: Statutory Legal Authority */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                <span>{isHindi ? 'वैधानिक प्राधिकरण एवं विधान' : 'Statutory Authority & Legislation'}</span>
              </h4>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <div className="flex justify-between">
                  <span>{isHindi ? 'अधिनियमित कानून:' : 'Enacting Law:'}</span>
                  <span className="font-bold text-slate-900">{isHindi ? 'विधिक मापविज्ञान अधिनियम, 2009' : 'Legal Metrology Act, 2009'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isHindi ? 'शासी नियम:' : 'Governing Rules:'}</span>
                  <span className="font-bold text-slate-900">{isHindi ? 'विधिक मापविज्ञान नियम, 2011' : 'Legal Metrology Rules, 2011'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isHindi ? 'वैधानिक प्रमाणपत्र प्रपत्र:' : 'Statutory Certificate Form:'}</span>
                  <span className="font-bold text-purple-700 font-mono">{isHindi ? 'फॉर्म VI (नियम 24)' : 'Form VI (Rule 24)'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isHindi ? 'हस्ताक्षरकर्ता प्राधिकरण:' : 'Signatory Authority:'}</span>
                  <span className="font-bold text-slate-900">{certificate.issuingOfficer}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDetailPage;
