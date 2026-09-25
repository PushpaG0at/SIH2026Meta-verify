import React from 'react';
import { Award, QrCode, Download, Eye, ExternalLink, ShieldCheck } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

export const CertificateCard = ({ certificate, onDownload }) => {
  if (!certificate) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/20 border border-blue-400/30 rounded-md">
            <Award className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-blue-300 block">
              Legal Metrology Certificate
            </span>
            <h4 className="text-sm font-bold tracking-tight font-mono">{certificate.id}</h4>
          </div>
        </div>
        <StatusBadge status={certificate.status} />
      </div>

      {/* Main Details */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-medium">Business / Licensee</p>
            <p className="text-slate-800 font-semibold mt-0.5">{certificate.businessName}</p>
          </div>
          <div>
            <p className="text-slate-400 font-medium">Instrument ID</p>
            <p className="text-slate-800 font-mono font-medium mt-0.5">{certificate.instrumentId}</p>
          </div>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Instrument Type:</span>
            <span className="font-medium text-slate-800">{certificate.instrumentType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Make & Model:</span>
            <span className="font-medium text-slate-800">{certificate.manufacturer} - {certificate.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Serial Number:</span>
            <span className="font-mono font-semibold text-slate-800">{certificate.serialNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Issued On:</span>
            <span className="font-medium text-slate-800">{certificate.issueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Valid Until:</span>
            <span className="font-semibold text-emerald-700">{certificate.validUntil}</span>
          </div>
        </div>

        {/* QR Code Placeholder Box */}
        <div className="bg-slate-50 rounded-lg p-3 border border-dashed border-slate-300 flex items-center gap-3">
          <div className="p-2 bg-white rounded-md border border-slate-200 shrink-0">
            <QrCode className="w-8 h-8 text-slate-700" />
          </div>
          <div className="text-[11px] leading-tight text-slate-500">
            <span className="font-semibold text-slate-700 block">Digital Tamper-Proof Seal</span>
            Cryptographic SHA-256 Hash on Public Registry
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <Link to={`/verify/${certificate.id}`}>
          <Button variant="outline" size="sm" leftIcon={ExternalLink}>
            Verify
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={() => onDownload && onDownload(certificate)}
          >
            PDF
          </Button>
          <Link
            to={
              typeof window !== 'undefined' && window.location.pathname.startsWith('/officer')
                ? `/officer/certificates/${certificate.id}`
                : `/business/certificates/${certificate.id}`
            }
          >
            <Button variant="primary" size="sm" leftIcon={Eye}>
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
