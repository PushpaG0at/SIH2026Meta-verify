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

export const CertificateDetailPage = () => {
  const { id } = useParams();
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Action Bar (hidden in print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          to="/business/certificates"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issued Certificates</span>
        </Link>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct Verify Button */}
          <Link to={`/verify/${certificate.id}`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={ExternalLink}
              className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Verify Certificate
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
            {copiedUrl ? 'Copied Link' : 'Copy Verify Link'}
          </Button>

          {/* Print Button */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={Printer}
            onClick={handlePrint}
            className="text-xs"
          >
            Print
          </Button>

          {/* Download PDF Button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={Download}
            onClick={handleDownloadPdf}
            className="text-xs bg-blue-700 hover:bg-blue-600 shadow-sm font-bold"
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Synthetic Demonstration Disclaimer Banner (Required: Do not claim it is an official government certificate) */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs print:hidden">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold uppercase tracking-wider text-[11px] text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded font-mono">
              Demonstration Certificate • Synthetic Record
            </span>
            <span className="text-[11px] font-semibold text-amber-800">
              Not an official government certificate
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/90">
            This digital certificate is a simulated electronic credential generated by the <strong>METRA-VERIFY</strong> prototype platform for evaluation during <strong>Smart India Hackathon (SIH) 2026</strong>. It demonstrates statutory compliance under the Legal Metrology Act, 2009, but does not constitute an authentic legal document issued by the Department of Consumer Affairs or State Directorate of Legal Metrology.
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
          <span>Certificate Preview (Form VI)</span>
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
          <span>Certificate Details & Telematics</span>
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
                    Legal Metrology Digital Platform
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 pt-1">
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-700">
                  Directorate of Legal Metrology (Demonstration Environment)
                </p>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide font-heading">
                  Certificate of Verification
                </h1>
                <p className="text-[10px] font-mono font-bold text-blue-900 uppercase tracking-wider">
                  FORM VI • [See Legal Metrology (General) Rules, 2011 — Rules 14(1) & 24]
                </p>
              </div>

              {/* Statutory Endorsement Recital */}
              <p className="text-xs text-slate-600 max-w-2xl mx-auto italic pt-1 leading-relaxed">
                "I hereby certify that I have this day examined and verified the under-mentioned weighing / measuring instrument under the Legal Metrology Act, 2009 and found it to conform with the prescribed statutory specifications and permissible error limits."
              </p>
            </div>

            {/* Certificate ID & Statutory Status Ribbon */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Certificate No:</span>
                <span className="font-mono text-sm font-black text-blue-900 bg-blue-100/60 px-2 py-0.5 rounded border border-blue-200">
                  {certificate.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Instrument Ref:</span>
                <span className="font-mono font-bold text-slate-800">{certificate.instrumentId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Legal Status:</span>
                <StatusBadge status={certificate.status} />
              </div>
            </div>

            {/* Core Statutory Specifications 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Commercial Trader Details */}
              <div className="space-y-3.5">
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    1. Licensed Trader / Business Entity
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {certificate.businessName}
                  </span>
                  <p className="text-slate-600">
                    Licensee / Proprietor: <strong className="text-slate-800">{certificate.ownerName}</strong>
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
                    2. Instrument Classification
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Instrument Type:</span>
                    <span className="font-bold text-slate-900">{certificate.instrumentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-medium text-slate-700">{certificate.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Accuracy Class:</span>
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
                    3. Metrological & Technical Ratings
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Make & Model:</span>
                    <span className="font-bold text-slate-900">
                      {certificate.manufacturer} — {certificate.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stamped Serial No:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {certificate.serialNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capacity Envelope:</span>
                    <span className="font-bold text-slate-900">
                      Max: {certificate.capacity} | Min: {certificate.minCapacity || '100 g'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verification Scale:</span>
                    <span className="font-mono text-slate-800">
                      {certificate.verificationDivision || 'e = 5 g, d = 1 g'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model Approval Reg:</span>
                    <span className="font-mono font-semibold text-purple-700 text-[11px]">
                      {certificate.modelApprovalNumber || 'IND-DLM-2024-AP-0912'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    4. Security Seal & Validity Period
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applied Seal ID:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {certificate.sealNumber || 'MV-SEAL-2026-09412'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stamping Date:</span>
                    <span className="font-semibold text-slate-900">{certificate.issueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Statutory Expiry Date:</span>
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
                    Scan to Verify Authenticity
                  </span>
                  <p className="text-slate-500">Encodes live public registry verification route:</p>
                  <p className="font-mono text-[9px] text-blue-700 font-semibold truncate max-w-[200px]">
                    /verify/{certificate.id}
                  </p>
                  <span className="inline-block text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-200">
                    SHA-256 Validated
                  </span>
                </div>
              </div>

              {/* Holographic Security Emblem */}
              <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br from-amber-50 via-slate-50 to-blue-50 border border-slate-300 text-center text-[9px] font-mono text-slate-600">
                <ShieldCheck className="w-5 h-5 text-blue-900" />
                <span className="font-bold text-slate-800 mt-0.5">METRA-VERIFY</span>
                <span className="text-slate-500 text-[8px]">DIGITAL STAMP</span>
              </div>

              {/* Officer Attestation & Signature Box */}
              <div className="text-center md:text-right space-y-1">
                <div className="inline-block border-b-2 border-slate-800 px-6 pb-1 font-serif italic text-base text-slate-900 font-bold">
                  {certificate.issuingOfficer}
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-700 block tracking-wider">
                  Authorized Verification Officer
                </span>
                <p className="text-[10px] text-slate-500 font-mono">
                  State Legal Metrology Verification Directorate
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
                IMMUTABLE SHA-256 HASH: {certificate.securityHash}
              </span>
              <span className="text-slate-500 font-sans font-bold">
                METRA-VERIFY SYNTHETIC RECORD
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
                Certificate Registry & Cryptographic Custody Record
              </h3>
              <p className="text-xs text-slate-500">
                Deep telematics, SHA-256 chain of custody, and field inspection audit metadata
              </p>
            </div>
            <StatusBadge status={certificate.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Box 1: Cryptographic Block */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 border border-slate-800 font-mono">
              <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                <span>CHAIN OF CUSTODY SHA-256 DIGEST</span>
                <span className="text-emerald-400 font-bold">DIGITALLY SEALED</span>
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
                <span>{copied ? 'Hash Copied' : 'Copy Hash'}</span>
              </button>
            </div>

            {/* Box 2: Consumer QR & Verification Portal */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800">Public Consumer QR Seal</h4>
                <span className="text-[10px] text-blue-600 font-mono font-bold">
                  Scans: {certificate.verificationCount || 42}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Consumers and enforcement officers scan this QR code on the instrument label to instantly verify legal validity without logging in.
              </p>
              <div className="flex items-center gap-2">
                <Link to={`/verify/${certificate.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full text-xs" leftIcon={ExternalLink}>
                    Open Verification Portal
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleCopyUrl} className="text-xs">
                  {copiedUrl ? 'Copied' : 'Copy URL'}
                </Button>
              </div>
            </div>

            {/* Box 3: Inspector Telematics */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>Field Telematics & Geofence Confirmation</span>
              </h4>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Inspector Credential:</span>
                  <span className="font-bold text-slate-900">Vikram Singh (INSP-NZ-4082)</span>
                </div>
                <div className="flex justify-between">
                  <span>GNSS Geofence Match:</span>
                  <span className="font-bold text-emerald-700">28.6139° N, 77.2090° E (8.2m deviation)</span>
                </div>
                <div className="flex justify-between">
                  <span>Tamper Lead Seal ID:</span>
                  <span className="font-mono font-bold text-blue-600">{certificate.sealNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Baseline Calibration:</span>
                  <span className="font-bold text-slate-900">Class M1 Calibrated Weights (50kg)</span>
                </div>
              </div>
            </div>

            {/* Box 4: Statutory Legal Authority */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Statutory Authority & Legislation</span>
              </h4>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <div className="flex justify-between">
                  <span>Enacting Law:</span>
                  <span className="font-bold text-slate-900">Legal Metrology Act, 2009</span>
                </div>
                <div className="flex justify-between">
                  <span>Governing Rules:</span>
                  <span className="font-bold text-slate-900">Legal Metrology Rules, 2011</span>
                </div>
                <div className="flex justify-between">
                  <span>Statutory Certificate Form:</span>
                  <span className="font-bold text-purple-700 font-mono">Form VI (Rule 24)</span>
                </div>
                <div className="flex justify-between">
                  <span>Signatory Authority:</span>
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
