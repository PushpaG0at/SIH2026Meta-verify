import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Camera,
  QrCode,
  ArrowRight,
  Share2,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Lock,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { certificateService } from '../../services/certificateService';
import { useToast } from '../../context/ToastContext';

export const PublicVerification = () => {
  const { certificateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const queryParamId = searchParams.get('cert') || searchParams.get('uin') || searchParams.get('query') || searchParams.get('id');
  const targetId = certificateId || queryParamId || '';

  const [inputQuery, setInputQuery] = useState(targetId);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(Boolean(targetId));
  const [notFound, setNotFound] = useState(false);
  const [searchedId, setSearchedId] = useState(targetId);

  // QR Scanner Modal State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Copy Feedback
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (!targetId) {
      setCertificate(null);
      setNotFound(false);
      setLoading(false);
      setSearchedId('');
      setInputQuery('');
      return;
    }

    const fetchCert = async () => {
      setLoading(true);
      setNotFound(false);
      setSearchedId(targetId);
      setInputQuery(targetId);

      try {
        const result = await certificateService.verifyPublicCertificate(targetId);
        if (result) {
          setCertificate(result);
          setNotFound(false);
        } else {
          setNotFound(true);
          setCertificate(null);
        }
      } catch (err) {
        console.error('Public verify error:', err);
        setNotFound(true);
        setCertificate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCert();
  }, [certificateId, queryParamId]);

  // Handle Manual Form Search
  const handleSearch = (e) => {
    e?.preventDefault();
    const clean = inputQuery.trim();
    if (clean) {
      navigate(`/verify/${encodeURIComponent(clean)}`);
    }
  };

  // Open Camera QR Scanner
  const startCamera = async () => {
    setIsScannerOpen(true);
    setCameraError(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        setCameraError('Camera access is not supported in this browser environment.');
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err.message);
      setCameraError('Camera access unavailable. Use simulated scan chips or manual input.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScannerOpen(false);
  };

  const handleSimulatedScan = (scannedCertId) => {
    stopCamera();
    navigate(`/verify/${scannedCertId}`);
  };

  const handleCopyShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    toast?.info?.('Verification link copied to clipboard');
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Government Compliance Header */}
      <header className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-slate-200">
              Government of India • Department of Legal Metrology
            </span>
          </div>
          <span className="text-slate-400">National Public Certificate Registry</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Brand Header */}
        <div className="text-center mb-8 print:hidden">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-heading">
              METRA-VERIFY
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading tracking-tight mt-1">
            Verify a Certificate
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Check whether a weighing or measuring instrument certificate is valid.
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>No account required</span>
          </div>
        </div>

        {/* Verification Inputs (Shown always or when user wants to search) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 mb-8 print:hidden">
          {/* METHOD ONE — SCAN QR */}
          <div className="border border-slate-200 hover:border-slate-300 rounded-lg p-5 text-center bg-slate-50/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Scan Certificate QR
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Use your camera to verify the certificate instantly.
            </p>
            <button
              type="button"
              onClick={startCamera}
              className="py-2 px-5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Camera className="w-4 h-4" />
              <span>Scan QR Code</span>
            </button>
          </div>

          {/* METHOD TWO — ENTER CERTIFICATE ID */}
          <div>
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Or enter Certificate ID
              </span>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="e.g. MV-2026-000123"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="py-2 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Verify Certificate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[11px] text-slate-400 mt-2">
              Certificate ID can be found on the certificate or near the QR code.
            </p>

            {/* Quick Demo Test Chips */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Test examples:</span>
              <button
                type="button"
                onClick={() => navigate('/verify/MV-2026-000123')}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                MV-2026-000123 (Valid)
              </button>
              <button
                type="button"
                onClick={() => navigate('/verify/MV-2025-000089')}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                MV-2025-000089 (Expired)
              </button>
              <button
                type="button"
                onClick={() => navigate('/verify/MV-2026-000999')}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                MV-2026-000999 (Revoked)
              </button>
              <button
                type="button"
                onClick={() => navigate('/verify/METRA-CERT-2026-104928')}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                METRA-CERT-2026-104928
              </button>
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-xs">
            <div className="inline-block w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-800">
              Querying National Metrology Registry...
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Verifying cryptographic hash and certification records for #{targetId}
            </p>
          </div>
        )}

        {/* NOT FOUND RESULT */}
        {!loading && notFound && (
          <div className="bg-white border border-rose-200 rounded-xl p-6 sm:p-8 text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <XCircle className="w-6 h-6" />
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 mb-2">
              Status: Not Found
            </span>
            <h2 className="text-lg font-bold text-slate-900">Certificate Not Found</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              No active certificate matches ID{' '}
              <strong className="font-mono text-slate-800 font-semibold">{searchedId}</strong>.
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Please check the Certificate ID and try again.
            </p>
            <button
              type="button"
              onClick={() => {
                setInputQuery('');
                navigate('/verify');
              }}
              className="py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Try Another Search
            </button>
          </div>
        )}

        {/* VERIFICATION RESULT (VALID / EXPIRED / REVOKED) */}
        {!loading && certificate && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            {/* Status Header Banner */}
            {certificate.status === 'VALID' && (
              <div className="bg-emerald-600 text-white p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block">
                      Official Legal Metrology Status
                    </span>
                    <h2 className="text-base sm:text-lg font-bold font-heading">
                      ✓ Certificate Verified
                    </h2>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-emerald-800 font-extrabold text-xs tracking-wider uppercase shadow-xs">
                  VALID
                </span>
              </div>
            )}

            {certificate.status === 'EXPIRED' && (
              <div className="bg-amber-500 text-white p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-100 block">
                      Official Legal Metrology Status
                    </span>
                    <h2 className="text-base sm:text-lg font-bold font-heading">
                      Certificate Expired
                    </h2>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-amber-800 font-extrabold text-xs tracking-wider uppercase shadow-xs">
                  EXPIRED
                </span>
              </div>
            )}

            {certificate.status === 'REVOKED' && (
              <div className="bg-rose-600 text-white p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-100 block">
                      Official Legal Metrology Status
                    </span>
                    <h2 className="text-base sm:text-lg font-bold font-heading">
                      Certificate Revoked
                    </h2>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-rose-800 font-extrabold text-xs tracking-wider uppercase shadow-xs">
                  REVOKED
                </span>
              </div>
            )}

            {/* Certificate Details Table */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-6">
                <div>
                  <span className="text-slate-400 font-medium block">Certificate ID</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    {certificate.id || certificate.certificateNo}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Status</span>
                  <span
                    className={`font-extrabold uppercase ${
                      certificate.status === 'VALID'
                        ? 'text-emerald-700'
                        : certificate.status === 'EXPIRED'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {certificate.status}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Instrument</span>
                  <span className="font-semibold text-slate-800">
                    {certificate.instrumentType || certificate.instrument?.category || 'Electronic Weighing Scale'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Manufacturer</span>
                  <span className="font-semibold text-slate-800">
                    {certificate.manufacturer || certificate.brand || 'ABC WeighTech'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Model</span>
                  <span className="font-semibold text-slate-800">
                    {certificate.model || certificate.modelNo || 'WT-30'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Serial Number</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {certificate.serialNumber || certificate.serialNo || 'WT30-IN-48291'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Capacity</span>
                  <span className="font-semibold text-slate-800">
                    {certificate.capacity || '30 kg'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Issue Date</span>
                  <span className="font-semibold text-slate-800">
                    {certificate.issueDate || certificate.verificationDate || '12 Aug 2026'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Valid Until</span>
                  <span className="font-semibold text-slate-800">
                    {certificate.validUntil || certificate.nextVerificationDue || '11 Aug 2027'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Verified By</span>
                  <span className="font-semibold text-slate-800">
                    {certificate.verifyingOfficer || certificate.issuingAuthority || 'Legal Metrology Authority'}
                  </span>
                </div>
              </div>

              {/* Revocation Warning Box if revoked */}
              {certificate.status === 'REVOKED' && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <span className="font-bold block mb-0.5">Revocation Notice:</span>
                  <p>{certificate.revocationReason || 'Certificate withdrawn following inspection non-compliance under Rule 16.'}</p>
                </div>
              )}

              {/* QR Code & Tamper Seal Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                    <QRCodeSVG
                      value={certificate.qrPayload || window.location.href}
                      size={64}
                      level="M"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Cryptographic Evidence Seal
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block max-w-xs truncate">
                      SHA-256: {certificate.securityHash || certificate.evidenceHash || '36c3892f77b1de9b2...'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Tamper-evident verification record
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={handleCopyShare}
                    className="py-1.5 px-3 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedShare ? 'Copied' : 'Share'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="py-1.5 px-3 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Small Unobtrusive Return to Login Option */}
        <div className="mt-8 text-center text-xs text-slate-500 print:hidden">
          <span>Are you a registered stakeholder? </span>
          <Link
            to="/login"
            className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
          >
            Portal Login →
          </Link>
        </div>
      </main>

      {/* QR CAMERA SCANNER MODAL */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Scan Certificate QR
                </h3>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-square bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-white/40 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-emerald-400 rounded-lg animate-pulse" />
              </div>

              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/90 text-slate-200 p-4 flex flex-col items-center justify-center text-center text-xs">
                  <Camera className="w-8 h-8 text-slate-500 mb-2" />
                  <p>{cameraError}</p>
                </div>
              )}
            </div>

            {/* Quick Demo Scan Shortcuts */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Or simulate scan for evaluation:
              </span>
              <button
                type="button"
                onClick={() => handleSimulatedScan('MV-2026-000123')}
                className="w-full py-1.5 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium text-left flex items-center justify-between"
              >
                <span>Valid Scale QR</span>
                <span className="font-mono text-[10px] text-emerald-700 font-bold">MV-2026-000123</span>
              </button>
              <button
                type="button"
                onClick={() => handleSimulatedScan('MV-2025-000089')}
                className="w-full py-1.5 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium text-left flex items-center justify-between"
              >
                <span>Expired Scale QR</span>
                <span className="font-mono text-[10px] text-amber-700 font-bold">MV-2025-000089</span>
              </button>
              <button
                type="button"
                onClick={() => handleSimulatedScan('MV-2026-000999')}
                className="w-full py-1.5 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium text-left flex items-center justify-between"
              >
                <span>Revoked Scale QR</span>
                <span className="font-mono text-[10px] text-rose-700 font-bold">MV-2026-000999</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 px-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white print:hidden">
        <p className="text-slate-600 font-medium">
          METRA-VERIFY • Digital verification for weighing & measuring instruments
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Legal Metrology Act, 2009 • Smart India Hackathon 2026 Prototype
        </p>
      </footer>
    </div>
  );
};

export default PublicVerification;
