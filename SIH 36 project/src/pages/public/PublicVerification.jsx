import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Share2,
  Printer,
  FileText,
  Copy,
  Check,
  ShieldAlert,
  Sparkles,
  MapPin
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { certificateService } from '../../services/certificateService';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import { useToast } from '../../context/ToastContext';

export const PublicVerification = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [inputQuery, setInputQuery] = useState(certificateId || 'MV-CERT-000123');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      setLoading(true);
      setNotFound(false);
      const idToSearch = certificateId || 'MV-CERT-000123';
      setInputQuery(idToSearch);

      try {
        const result = await certificateService.verifyPublicCertificate(idToSearch);
        if (result) {
          setCertificate(result);
          setNotFound(false);
        } else {
          setNotFound(true);
          setCertificate(null);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
        setCertificate(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [certificateId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      navigate(`/verify/${inputQuery.trim()}`);
    }
  };

  const handleCopyHash = () => {
    if (certificate?.securityHash) {
      navigator.clipboard.writeText(certificate.securityHash);
      setCopiedHash(true);
      showToast('Cryptographic SHA-256 hash copied to clipboard', 'info');
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleCopyShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    showToast('Verification URL copied to clipboard', 'info');
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `/verify/${certificateId || 'MV-CERT-000123'}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 pb-24">
      {/* Top Search & Interactive Live Evaluator Demo Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 print:hidden">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              National Legal Metrology Digital Verification Portal
            </span>
            <span className="text-[10px] font-semibold text-slate-400 font-mono">
              SIH 2026 Evaluator Console
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Universal Instrument Verification Registry
          </h2>
          <p className="text-xs text-slate-500">
            Instant statutory validation of commercial weighing and measuring instruments under Section 24 of Legal Metrology Act, 2009
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Enter Certificate ID (e.g. MV-CERT-000123)"
              className="w-full pl-9.5 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono font-bold text-slate-900"
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="font-bold text-xs sm:text-sm bg-blue-700 hover:bg-blue-600">
            Verify Certificate
          </Button>
        </form>

        {/* 4 Interactive State Switcher Chips for Evaluators */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Live Demo Switcher:
          </span>

          <button
            type="button"
            onClick={() => {
              setInputQuery('MV-CERT-000123');
              navigate('/verify/MV-CERT-000123');
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 ${
              certificate?.id === 'MV-CERT-000123' && !notFound && certificate?.status === 'VALID'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            VALID (MV-CERT-000123)
          </button>

          <button
            type="button"
            onClick={() => {
              setInputQuery('MV-2025-000089');
              navigate('/verify/MV-2025-000089');
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 ${
              certificate?.id === 'MV-2025-000089' && !notFound && certificate?.status === 'EXPIRED'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            EXPIRED (MV-2025-000089)
          </button>

          <button
            type="button"
            onClick={() => {
              setInputQuery('MV-2026-000999');
              navigate('/verify/MV-2026-000999');
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 ${
              certificate?.id === 'MV-2026-000999' && !notFound && certificate?.status === 'REVOKED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3 h-3" />
            REVOKED (MV-2026-000999)
          </button>

          <button
            type="button"
            onClick={() => {
              setInputQuery('MV-UNKNOWN-999999');
              navigate('/verify/MV-UNKNOWN-999999');
            }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all flex items-center gap-1 ${
              notFound
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Search className="w-3 h-3" />
            NOT FOUND (MV-UNKNOWN-999999)
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Connecting to Legal Metrology cryptographic verification ledger..." />
      ) : (
        <div className="space-y-6">
          {/* ========================================================= */}
          {/* STATE 4: NOT FOUND STATE                                  */}
          {/* ========================================================= */}
          {notFound && (
            <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-md p-6 sm:p-8 text-center space-y-5">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-rose-200">
                <XCircle className="w-9 h-9 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block">
                  Statutory Registry Status: Record Not Found
                </span>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 font-heading">
                  CERTIFICATE NOT FOUND IN PUBLIC REGISTRY
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  No active legal metrology verification record was located in the official state database matching identifier{' '}
                  <strong className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                    "{certificateId || inputQuery}"
                  </strong>.
                </p>
              </div>

              {/* Warning & Guidance Card */}
              <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl text-left text-xs text-rose-950 space-y-2 max-w-xl mx-auto">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 text-sm">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Consumer Protection Alert</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-900">
                  If this certificate number was provided by a vendor or appears on a physical weighing instrument in a commercial establishment, the instrument may be <strong>unverified, uncalibrated, or counterfeit</strong>.
                </p>
                <div className="pt-2 border-t border-rose-200 text-[11px] text-rose-800 space-y-1">
                  <p>• Verify the spelling of the certificate code (format: MV-CERT-XXXXXX or MV-YYYY-XXXXXX).</p>
                  <p>• Scan the QR code sticker affixed directly to the physical instrument casing.</p>
                  <p>• Report unverified commercial instruments to the State Directorate of Legal Metrology.</p>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputQuery('MV-CERT-000123');
                    navigate('/verify/MV-CERT-000123');
                  }}
                  className="text-xs"
                >
                  Load Valid Demonstration Record
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 1: VALID CERTIFICATE STATE                         */}
          {/* ========================================================= */}
          {!notFound && certificate && certificate.status === 'VALID' && (
            <div className="space-y-6">
              {/* Main Status Indicator Banner (Exact Text: ✓ CERTIFICATE VERIFIED) */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-500 rounded-2xl p-6 sm:p-8 text-center text-emerald-950 shadow-md space-y-3 relative overflow-hidden">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md ring-4 ring-emerald-100">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 font-mono bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300 inline-block">
                    Official Public Registry Verification
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-950 font-heading">
                    ✓ CERTIFICATE VERIFIED
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-900 font-medium max-w-lg mx-auto leading-relaxed">
                    This measuring instrument is legally verified, calibrated, and authorized for commercial trade within permissible Maximum Permissible Error (MPE) limits.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-800 font-bold shadow-2xs">
                    Status: VALID & ACTIVE
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white border border-emerald-300 text-emerald-800 font-bold shadow-2xs">
                    Legal Metrology Act, 2009 — Section 24
                  </span>
                </div>
              </div>

              {/* Required Core Dossier Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
                {/* Dossier Top Bar */}
                <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block">
                        Verified Statutory Record
                      </span>
                      <h3 className="text-base font-bold font-mono text-white">
                        {certificate.id}
                      </h3>
                    </div>
                  </div>

                  {/* Actions (Print, Download, Share) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outlineDark"
                      size="sm"
                      leftIcon={Printer}
                      onClick={handlePrint}
                      className="text-xs"
                    >
                      Print Receipt
                    </Button>
                    <Link to={`/business/certificates/${certificate.id}`}>
                      <Button
                        variant="outlineDark"
                        size="sm"
                        leftIcon={FileText}
                        className="text-xs"
                      >
                        Form VI Certificate
                      </Button>
                    </Link>
                    <Button
                      variant="outlineDark"
                      size="sm"
                      leftIcon={copiedShare ? Check : Share2}
                      onClick={handleCopyShare}
                      className="text-xs"
                    >
                      {copiedShare ? 'Copied' : 'Share'}
                    </Button>
                  </div>
                </div>

                {/* The 8 Required Fields Highlight Grid */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* 1. Certificate ID */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">
                        Certificate ID
                      </span>
                      <span className="font-mono text-base font-black text-blue-900 block truncate">
                        {certificate.id}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        • Verified in Central Registry
                      </span>
                    </div>

                    {/* 2. Business Entity */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">
                        Business Entity
                      </span>
                      <span className="text-sm font-bold text-slate-900 block truncate">
                        {certificate.businessName}
                      </span>
                      <span className="text-[11px] text-slate-600 block truncate">
                        {certificate.ownerName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block truncate">
                        GSTIN: {certificate.gstin || '07AAACS1429B1Z8'}
                      </span>
                    </div>

                    {/* 3. Instrument */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">
                        Instrument
                      </span>
                      <span className="text-sm font-bold text-slate-900 block truncate">
                        {certificate.instrumentType}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 inline-block">
                        {certificate.accuracyClass || 'Class III NAWI'}
                      </span>
                    </div>

                    {/* 4. Manufacturer */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">
                        Manufacturer
                      </span>
                      <span className="text-sm font-bold text-slate-900 block truncate">
                        {certificate.manufacturer}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Approval: {certificate.modelApprovalNumber || 'IND-DLM-2024-AP-0912'}
                      </span>
                    </div>

                    {/* 5. Model */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">
                        Model
                      </span>
                      <span className="text-sm font-bold text-slate-900 block truncate">
                        {certificate.model}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Capacity: <strong>{certificate.capacity}</strong>
                      </span>
                    </div>

                    {/* 6. Serial Number */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">
                        Serial Number
                      </span>
                      <span className="font-mono text-base font-bold text-blue-700 block truncate">
                        {certificate.serialNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Division: {certificate.verificationDivision || 'e = 5 g, d = 1 g'}
                      </span>
                    </div>

                    {/* 7. Issue Date */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">
                        Issue Date
                      </span>
                      <span className="text-sm font-bold text-slate-900 block">
                        {certificate.issueDate}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Stamping Complete
                      </span>
                    </div>

                    {/* 8. Expiry Date */}
                    <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-1">
                      <span className="text-emerald-800 font-bold uppercase text-[10px] block">
                        Expiry Date
                      </span>
                      <span className="text-sm font-black text-emerald-900 block">
                        {certificate.validUntil}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded inline-block">
                        • Valid for Commercial Trade
                      </span>
                    </div>
                  </div>

                  {/* Registered Premises & Operating Address */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">
                      Registered Commercial Operating Location
                    </span>
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{certificate.businessAddress}</span>
                    </p>
                  </div>

                  {/* Cryptographic Ledger & Dynamic Vector QR Stamp */}
                  <div className="p-5 bg-slate-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-slate-800">
                    <div className="flex items-center gap-4">
                      {/* Dynamic Vector QR Code pointing to this verify page */}
                      <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">
                        <QRCodeSVG
                          value={currentUrl}
                          size={80}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                      <div className="space-y-1 overflow-hidden">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider block font-mono">
                          Cryptographic Fingerprint & Public Seal
                        </span>
                        <p className="font-mono text-[10px] text-slate-300 truncate max-w-xs sm:max-w-md">
                          {certificate.securityHash}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Applied Physical Seal ID: <strong className="font-mono text-blue-300">{certificate.sealNumber || 'MV-SEAL-2026-09412'}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyHash}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
                      >
                        {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedHash ? 'Hash Copied' : 'Copy Hash'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 2: EXPIRED CERTIFICATE STATE                       */}
          {/* ========================================================= */}
          {!notFound && certificate && certificate.status === 'EXPIRED' && (
            <div className="space-y-6">
              {/* Expired Status Banner */}
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-slate-50 border-2 border-amber-500 rounded-2xl p-6 sm:p-8 text-center text-amber-950 shadow-md space-y-3">
                <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md ring-4 ring-amber-100">
                  <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-900 font-mono bg-amber-200/70 px-3 py-0.5 rounded-full border border-amber-300 inline-block">
                    Statutory Registry Status: Overdue
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-950 font-heading">
                    ⚠️ CERTIFICATE EXPIRED
                  </h1>
                  <p className="text-xs sm:text-sm text-amber-900 font-medium max-w-lg mx-auto leading-relaxed">
                    The statutory verification validity period for this instrument has lapsed. Commercial transactions using this unverified instrument are unlawful under the Legal Metrology Act, 2009.
                  </p>
                </div>

                <div className="pt-1 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded bg-white border border-amber-300 text-amber-800 font-bold shadow-2xs">
                    Expired On: {certificate.validUntil}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold border border-rose-300">
                    MANDATORY RE-VERIFICATION OVERDUE
                  </span>
                </div>
              </div>

              {/* Expired Instrument Details Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Expired Instrument Record</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Certificate ID</span>
                    <span className="font-mono font-bold text-slate-900">{certificate.id}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Business / Trader</span>
                    <span className="font-bold text-slate-900">{certificate.businessName}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Instrument</span>
                    <span className="font-bold text-slate-900">{certificate.instrumentType}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Stamped Serial Number</span>
                    <span className="font-mono font-bold text-slate-900">{certificate.serialNumber}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Make & Model</span>
                    <span className="font-bold text-slate-900">{certificate.manufacturer} - {certificate.model}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Issue Date</span>
                    <span className="font-bold text-slate-900">{certificate.issueDate}</span>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl sm:col-span-2">
                    <span className="text-rose-700 block font-bold">Lapsed Expiry Date</span>
                    <span className="font-mono font-black text-rose-800 text-sm">{certificate.validUntil} (Expired)</span>
                  </div>
                </div>

                {/* Regulatory Directive Warning */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
                  <span className="font-bold block text-amber-900">Legal Metrology Directive (Rule 24):</span>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    The owner of this weighing / measuring system must immediately apply for re-verification through the trader portal or discontinue commercial use until fresh physical stamping and calibration tests are completed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STATE 3: REVOKED CERTIFICATE STATE                       */}
          {/* ========================================================= */}
          {!notFound && certificate && certificate.status === 'REVOKED' && (
            <div className="space-y-6">
              {/* Revoked Status Banner */}
              <div className="bg-gradient-to-r from-rose-50 via-red-50 to-slate-50 border-2 border-rose-600 rounded-2xl p-6 sm:p-8 text-center text-rose-950 shadow-md space-y-3">
                <div className="w-16 h-16 bg-rose-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md ring-4 ring-rose-100">
                  <XCircle className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-rose-800 font-mono bg-rose-200/70 px-3 py-0.5 rounded-full border border-rose-300 inline-block">
                    Official Regulatory Order: Revocation
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-rose-950 font-heading">
                    ✕ CERTIFICATE REVOKED / SUSPENDED
                  </h1>
                  <p className="text-xs sm:text-sm text-rose-900 font-medium max-w-lg mx-auto leading-relaxed">
                    This verification certificate has been formally revoked by order of the Legal Metrology Controller. Commercial use of this instrument is prohibited and punishable under law.
                  </p>
                </div>

                {/* Revocation Reason Box */}
                <div className="p-3 bg-white/90 border border-rose-300 rounded-xl max-w-xl mx-auto text-xs text-left space-y-1">
                  <span className="font-bold text-rose-800 uppercase text-[10px] block font-mono">
                    Official Statutory Ground for Revocation:
                  </span>
                  <p className="text-rose-900 font-semibold text-[11px]">
                    {certificate.revocationReason || 'Unapproved electronic bypass circuit detected during surprise audit.'}
                  </p>
                </div>
              </div>

              {/* Revoked Instrument Details */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Revoked Instrument Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Certificate ID</span>
                    <span className="font-mono font-bold text-slate-900">{certificate.id}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Business / Trader</span>
                    <span className="font-bold text-slate-900">{certificate.businessName}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Instrument</span>
                    <span className="font-bold text-slate-900">{certificate.instrumentType}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium">Serial Number</span>
                    <span className="font-mono font-bold text-slate-900">{certificate.serialNumber}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Manufacturer & Model</span>
                    <span className="font-bold text-slate-900">{certificate.manufacturer} — {certificate.model}</span>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl sm:col-span-2">
                    <span className="text-rose-700 block font-bold">Revocation Order Status</span>
                    <span className="font-mono font-bold text-rose-900 text-xs">VOID AB INITIO • Sealed for Investigation</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Demonstration Disclaimer (Required Safeguard) */}
      <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400 space-y-1">
        <p className="font-medium">
          METRA-VERIFY Legal Metrology Verification System • Smart India Hackathon (SIH) 2026 Evaluation
        </p>
        <p className="text-[11px] text-slate-400">
          This portal simulates statutory public verification under Section 24 of Legal Metrology Act, 2009. Data displayed is synthetic for demonstration purposes.
        </p>
      </div>
    </div>
  );
};

export default PublicVerification;
