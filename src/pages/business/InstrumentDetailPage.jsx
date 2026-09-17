import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Scale,
  Calendar,
  MapPin,
  Award,
  FileText,
  Clock,
  ArrowLeft,
  CheckCircle2,
  PlusCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { instrumentService } from '../../services/instrumentService';
import { applicationService } from '../../services/applicationService';
import { certificateService } from '../../services/certificateService';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Timeline from '../../components/ui/Timeline';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

export const InstrumentDetailPage = () => {
  const { id } = useParams();
  const [instrument, setInstrument] = useState(null);
  const [relatedApplications, setRelatedApplications] = useState([]);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const inst = await instrumentService.getInstrumentById(id || 'MV-INS-000123');
        setInstrument(inst);

        const apps = await applicationService.getApplications();
        const related = apps.filter((a) => a.instrumentId === inst.id);
        setRelatedApplications(related);

        if (inst.activeCertificateId) {
          const cert = await certificateService.getCertificateById(inst.activeCertificateId);
          setCertificate(cert);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingState message="Loading instrument specification record..." />;
  if (error || !instrument) return <ErrorState message={error || 'Instrument record not found.'} />;

  const historyEvents = [
    {
      title: 'Periodic Verification Certificate Issued',
      description: `Certificate #MV-2026-000123 approved by Dr. Anita Deshmukh. Validity 12 months.`,
      date: '08 Sep 2026',
      status: 'completed',
      actor: 'Authorized Verification Officer'
    },
    {
      title: 'Physical Field Inspection Completed',
      description: 'Inspector Vikram Singh verified 10kg, 25kg, 50kg standard weight calibration. Zero drift.',
      date: '05 Sep 2026',
      status: 'completed',
      actor: 'Field Inspector (INSP-NZ-4082)'
    },
    {
      title: 'AI Document Pre-check Passed',
      description: 'OCR extracted serial number WS123456 with zero discrepancies. Assessed as Low Risk (25/100).',
      date: '01 Sep 2026',
      status: 'completed',
      actor: 'Automated AI Pre-check Engine'
    },
    {
      title: 'Initial Instrument Registration',
      description: `Device onboarded by Rajesh Sharma (Sharma Traders & Co.). Stamped serial: ${instrument.serialNumber}`,
      date: instrument.purchaseDate || '12 Apr 2025',
      status: 'completed',
      actor: 'Business Licensee'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back button & top actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/business/instruments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Instruments</span>
        </Link>
        <Link to={`/business/applications/new?instrumentId=${instrument.id}`}>
          <Button variant="primary" size="sm" leftIcon={PlusCircle}>
            Apply for Re-verification
          </Button>
        </Link>
      </div>

      {/* Main Spec Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {instrument.id}
                </span>
                <StatusBadge status={instrument.status} size="sm" />
              </div>
              <h2 className="text-xl font-black text-slate-900 font-heading mt-1">
                {instrument.instrumentType}
              </h2>
              <p className="text-xs text-slate-500">
                {instrument.manufacturer} • Model: {instrument.model}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right text-xs space-y-1">
            <p className="text-slate-400 font-medium">Registered Owner</p>
            <p className="text-slate-900 font-bold">{instrument.businessName}</p>
            <p className="text-slate-500">{instrument.ownerName}</p>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Serial Number</span>
            <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{instrument.serialNumber}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Capacity</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{instrument.capacity}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Accuracy Class</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">{instrument.accuracyClass}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Division / Resolution</span>
            <span className="font-semibold text-slate-900 mt-0.5 block">{instrument.verificationDivision || 'e = 5 g'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Purchase Date</span>
            <span className="text-slate-800 mt-0.5 block">{instrument.purchaseDate}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Next Due Verification</span>
            <span className="font-bold text-emerald-700 mt-0.5 block">{instrument.nextDueCheck}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-slate-400 font-medium block">Registered Installation Site</span>
            <span className="text-slate-800 mt-0.5 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {instrument.location}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Certificate & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Active Verification Certificate</h3>
            </div>
            {certificate && <StatusBadge status={certificate.status} size="sm" />}
          </div>

          {certificate ? (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Certificate ID:</span>
                  <span className="font-mono font-bold text-slate-900">{certificate.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Validity Period:</span>
                  <span className="font-semibold text-emerald-800">{certificate.issueDate} → {certificate.validUntil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issuing Officer:</span>
                  <span className="font-medium text-slate-800">{certificate.issuingOfficer}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link to={`/verify/${certificate.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full" leftIcon={ExternalLink}>
                    Public QR Verification
                  </Button>
                </Link>
                <Link to={`/business/certificates/${certificate.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full">
                    View Full Certificate
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No active certificate on record. Submit a verification application to obtain digital legal certification.
            </div>
          )}
        </div>

        {/* Related Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Verification Applications</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">({relatedApplications.length})</span>
          </div>

          <div className="divide-y divide-slate-100">
            {relatedApplications.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <Link
                    to={`/business/applications/${app.id}`}
                    className="font-mono font-bold text-blue-600 hover:underline"
                  >
                    {app.id}
                  </Link>
                  <p className="text-[11px] text-slate-400 mt-0.5">Submitted: {app.submissionDate}</p>
                </div>
                <StatusBadge status={app.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification History / Lifecycle Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-6">
          Official Verification Audit History
        </h3>
        <Timeline items={historyEvents} />
      </div>
    </div>
  );
};

export default InstrumentDetailPage;
