import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Scale,
  Calendar,
  ShieldCheck,
  UserCheck,
  Award,
  ArrowLeft,
  ExternalLink,
  Download,
  AlertCircle,
  Clock,
  Eye
} from 'lucide-react';
import { applicationService } from '../../services/applicationService';
import ProgressStepper from '../../components/ui/ProgressStepper';
import StatusBadge from '../../components/ui/StatusBadge';
import RiskBadge from '../../components/ui/RiskBadge';
import Button from '../../components/ui/Button';
import AIAnalysisCard from '../../components/ai/AIAnalysisCard';
import EvidenceCard from '../../components/inspections/EvidenceCard';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

export const ApplicationDetailPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApp = async () => {
      setLoading(true);
      try {
        const data = await applicationService.getApplicationById(id || 'MV-APP-000123');
        setApplication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  if (loading) return <LoadingState message="Loading verification application dossier..." />;
  if (error || !application) return <ErrorState message={error || 'Application record not found.'} />;

  const getStepIndex = (status) => {
    switch (status) {
      case 'DRAFT': return 1;
      case 'DOCUMENTS': return 2;
      case 'AI_PRECHECK':
      case 'AI_REVIEWED': return 3;
      case 'SUBMITTED': return 4;
      case 'INSPECTION':
      case 'INSPECTION_ASSIGNED': return 5;
      case 'INSPECTION_COMPLETED':
      case 'OFFICER_REVIEW':
      case 'CORRECTION_REQUESTED': return 6;
      case 'OFFICER_REJECTED':
      case 'REJECTED': return 7;
      case 'OFFICER_APPROVED':
      case 'APPROVED': return 8; // reaches final certificate step
      default: return 4;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top breadcrumb & navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/business/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>

        {application.certificateId && (
          <Link to={`/business/certificates/${application.certificateId}`}>
            <Button variant="success" size="sm" leftIcon={Award}>
              View Issued Certificate ({application.certificateId})
            </Button>
          </Link>
        )}
      </div>

      {/* Main Status & Stepper Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {application.id}
              </span>
              <StatusBadge status={application.status} />
              <RiskBadge level={application.riskLevel} score={application.riskScore} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading mt-1.5">
              Verification Application Dossier
            </h2>
            <p className="text-xs text-slate-500">
              Submitted on {application.submissionDate} by {application.businessName}
            </p>
          </div>

          <div className="text-left md:text-right text-xs space-y-1">
            <span className="text-slate-400 font-medium block">Instrument Reference</span>
            <Link
              to={`/business/instruments/${application.instrumentId}`}
              className="font-mono font-bold text-blue-600 hover:underline flex items-center md:justify-end gap-1"
            >
              {application.instrumentId}
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
            <p className="text-slate-700 font-medium">{application.instrumentType}</p>
          </div>
        </div>

        {/* Visual 8-Step Lifecycle Stepper */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Verification Lifecycle Progression
          </h4>
          <ProgressStepper currentStep={getStepIndex(application.status)} />
        </div>
      </div>

      {/* Two Column Grid: Assignments & Uploaded Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personnel & Stakeholder Assignment */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Assigned Regulatory Personnel
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Field Inspector:</span>
              <span className="font-medium text-slate-900">{application.assignedInspector || 'Pending Field Schedule'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Adjudicating Officer:</span>
              <span className="font-medium text-slate-900">{application.assignedOfficer || 'State Legal Metrology Desk'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled Date:</span>
              <span className="font-medium text-slate-900">{application.inspection?.scheduledDate || 'To be notified'}</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-blue-600" />
            Uploaded Statutory Documents
          </h4>
          <div className="divide-y divide-slate-100">
            {application.documents?.map((doc, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{doc.name}</p>
                  <p className="text-[10px] text-slate-400">{doc.size} • {doc.uploadedAt}</p>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Pre-check Analysis Panel */}
      {application.ocrComparison && (
        <AIAnalysisCard
          riskScore={application.riskScore}
          riskLevel={application.riskLevel}
          riskFactors={application.riskFactors}
          ocrComparison={application.ocrComparison}
        />
      )}

      {/* Field Inspection Telematics & Measurements (if inspection commenced) */}
      {application.inspection && application.inspection.checklist && (
        <EvidenceCard
          inspectorName={application.inspection.inspectorName}
          timestamp={application.inspection.completedDate || 'Audit in progress'}
          gpsCoordinates={application.inspection.gpsCoordinates}
          measurements={application.inspection.measurements}
          remarks={application.inspection.remarks}
        />
      )}
    </div>
  );
};

export default ApplicationDetailPage;
