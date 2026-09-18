import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Scale,
  UploadCloud,
  Bot,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  AlertTriangle,
  FileText,
  PlusCircle
} from 'lucide-react';
import { instrumentService } from '../../services/instrumentService';
import { applicationService } from '../../services/applicationService';
import { aiService } from '../../services/aiService';
import Button from '../../components/ui/Button';
import FileUploader from '../../components/ui/FileUploader';
import AIAnalysisCard from '../../components/ai/AIAnalysisCard';
import ProgressStepper from '../../components/ui/ProgressStepper';

export const ApplicationNewPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedInstId = searchParams.get('instrumentId');

  const [step, setStep] = useState(1); // 1: Select Instrument, 2: Upload Documents, 3: AI Pre-check, 4: Submit Confirmation
  const [instruments, setInstruments] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const list = await instrumentService.getInstruments();
      setInstruments(list);
      if (preSelectedInstId) {
        const match = list.find((i) => i.id === preSelectedInstId);
        if (match) {
          setSelectedInstrument(match);
          setStep(2); // Jump straight to documents upload if pre-selected
        }
      } else if (list.length > 0) {
        setSelectedInstrument(list[0]);
      }
    };
    fetch();
  }, [preSelectedInstId]);

  const handleRunAiPreCheck = async () => {
    if (!selectedInstrument) return;
    setIsAiRunning(true);
    try {
      const analysis = await aiService.runPreCheck(selectedInstrument, uploadedFile);
      setAiResult(analysis);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiRunning(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        instrumentId: selectedInstrument.id,
        instrumentType: selectedInstrument.instrumentType,
        serialNumber: selectedInstrument.serialNumber,
        manufacturer: selectedInstrument.manufacturer
      };
      const createdApp = await applicationService.createApplication(payload);
      navigate(`/business/applications/${createdApp.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/business/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
      </div>

      {/* Visual Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <ProgressStepper currentStep={step} />
      </div>

      {/* Step 1: Select Instrument */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Select Instrument for Verification
            </h3>
            <p className="text-xs text-slate-500">
              Choose an already registered weighing or measuring instrument from your inventory
            </p>
          </div>

          {instruments.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">No Registered Instruments Found</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You must onboard a weighing scale or measuring instrument before filing a statutory verification application for it.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/business/instruments/new">
                  <Button variant="primary" size="sm" leftIcon={PlusCircle}>
                    Register Your First Instrument
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {instruments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedInstrument(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedInstrument?.id === item.id
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <Scale className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-600">{item.id}</span>
                      <h4 className="text-sm font-bold text-slate-900">{item.instrumentType}</h4>
                      <p className="text-xs text-slate-500">
                        {item.manufacturer} • Serial: {item.serialNumber} • Capacity: {item.capacity}
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="instrument_select"
                    checked={selectedInstrument?.id === item.id}
                    onChange={() => setSelectedInstrument(item)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <Link to="/business/instruments/new" className="text-xs font-semibold text-blue-600 hover:underline">
              + Register New Instrument first
            </Link>
            <Button
              variant="primary"
              size="md"
              disabled={!selectedInstrument}
              onClick={() => setStep(2)}
              rightIcon={ArrowRight}
            >
              Continue to Document Upload
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Upload Documents */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              Upload Verification Documents
            </h3>
            <p className="text-xs text-slate-500">
              Upload statutory purchase invoice, manufacturer model approval certificate, or baseline test data
            </p>
          </div>

          {/* Selected Instrument Summary Card */}
          {selectedInstrument && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-blue-600">{selectedInstrument.id}</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedInstrument.instrumentType}</p>
                <p className="text-slate-500">{selectedInstrument.manufacturer} • SN: {selectedInstrument.serialNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>
          )}

          {/* File Uploader */}
          <FileUploader
            label="Upload Manufacturer Invoice / Approval Certificate"
            sublabel="PDF or image showing device serial plate and model designation"
            onFileSelect={(file) => setUploadedFile(file)}
          />

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <Button variant="outline" size="md" onClick={() => setStep(1)} leftIcon={ArrowLeft}>
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleRunAiPreCheck}
              isLoading={isAiRunning}
              leftIcon={Bot}
              rightIcon={ArrowRight}
            >
              Run AI Pre-check & OCR
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: AI Pre-check Results & Confirmation */}
      {step === 3 && aiResult && (
        <div className="space-y-6">
          <AIAnalysisCard
            riskScore={aiResult.riskScore}
            riskLevel={aiResult.riskLevel}
            riskFactors={aiResult.riskFactors}
            ocrComparison={aiResult.comparison}
            disclaimer={aiResult.disclaimer}
          />

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-slate-900">
                Ready to submit application for statutory inspection?
              </h4>
              <p className="text-xs text-slate-500">
                A verification officer and field inspector will be scheduled automatically upon submission.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="md" onClick={() => setStep(2)} leftIcon={ArrowLeft}>
                Re-upload Docs
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleFinalSubmit}
                isLoading={isSubmitting}
                rightIcon={CheckCircle2}
              >
                Submit Application
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationNewPage;
