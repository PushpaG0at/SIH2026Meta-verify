import React, { useState } from 'react';
import {
  Bot,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  FileText,
  FileCheck,
  Cpu,
  ScanLine,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import RiskBadge from '../ui/RiskBadge';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export const AIAnalysisCard = ({
  documentName = 'Purchase_Invoice_WS123456.pdf',
  documentSize = '1.8 MB',
  documentUploadedAt = '01 Sep 2026, 10:15 AM',
  riskScore: initialRiskScore = 25,
  riskLevel: initialRiskLevel = 'LOW',
  riskFactors: initialRiskFactors = [
    'Serial number matches manufacturer invoice format pattern',
    'Model approval record verified in national legal metrology repository',
    'Capacity ratings and class tolerances adhere strictly to retail schedule',
    'Zero historical recalibration drift violations recorded for this make'
  ],
  ocrComparison: initialOcrComparison = [
    { field: 'Serial Number', dbValue: 'WS123456', docValue: 'WS123456', result: 'MATCH' },
    { field: 'Manufacturer', dbValue: 'ABC Instruments Ltd.', docValue: 'ABC Instruments Ltd.', result: 'MATCH' },
    { field: 'Model', dbValue: 'WS-500 Industrial Precision', docValue: 'WS-500 Industrial Precision', result: 'MATCH' },
    { field: 'Instrument Type', dbValue: 'Digital Weighing Scale', docValue: 'Digital Weighing Scale', result: 'MATCH' },
    { field: 'Max Capacity', dbValue: '50 kg', docValue: '50 kg', result: 'MATCH' }
  ],
  disclaimer = 'AI provides decision support. Final verification is performed by authorized personnel.',
  allowSimulation = true,
  className = ''
}) => {
  // Support interactive simulation mode for live SIH hackathon evaluation
  const [simulationMode, setSimulationMode] = useState('normal'); // 'normal' | 'mismatch'

  // Normal vs Mismatch scenarios
  const isSimulatedMismatch = simulationMode === 'mismatch';

  const riskScore = isSimulatedMismatch ? 78 : initialRiskScore;
  const riskLevel = isSimulatedMismatch ? 'HIGH' : initialRiskLevel;

  const riskFactors = isSimulatedMismatch
    ? [
        'CRITICAL: Serial number discrepancy between invoice plate (WS999888) and registered database record (WS123456)',
        'Manufacturer model series approved, but stamped plate indicates potential unit substitution',
        'Physical verification audit flagged for mandatory on-site serial plate examination',
        'Recommendation: Officer adjudication required prior to dispatching field inspector'
      ]
    : initialRiskFactors;

  const ocrComparison = isSimulatedMismatch
    ? [
        { field: 'Serial Number', dbValue: 'WS123456', docValue: 'WS999888', result: 'MISMATCH' },
        { field: 'Manufacturer', dbValue: 'ABC Instruments Ltd.', docValue: 'ABC Instruments Ltd.', result: 'MATCH' },
        { field: 'Model', dbValue: 'WS-500 Industrial Precision', docValue: 'WS-500 Industrial Precision', result: 'MATCH' },
        { field: 'Instrument Type', dbValue: 'Digital Weighing Scale', docValue: 'Digital Weighing Scale', result: 'MATCH' },
        { field: 'Max Capacity', dbValue: '50 kg', docValue: '30 kg', result: 'MISMATCH' }
      ]
    : initialOcrComparison;

  const rawOcrSnippet = isSimulatedMismatch
    ? 'INVOICE_ID: INV-2026-9041 | MAKE: ABC INSTRUMENTS LTD. | MODEL: WS-500 | SERIAL_NO: WS999888 | CAPACITY: 30kg | CLASS: III'
    : 'INVOICE_ID: INV-2026-4402 | MAKE: ABC INSTRUMENTS LTD. | MODEL: WS-500 | SERIAL_NO: WS123456 | CAPACITY: 50kg | CLASS: III';

  return (
    <div
      className={`bg-white rounded-2xl border ${
        isSimulatedMismatch ? 'border-rose-300 ring-2 ring-rose-100' : 'border-blue-200/90'
      } shadow-md overflow-hidden transition-all ${className}`}
    >
      {/* Top Banner Header */}
      <div
        className={`px-5 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isSimulatedMismatch
            ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900'
            : 'bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl border ${
              isSimulatedMismatch
                ? 'bg-rose-500/20 border-rose-400/30 text-rose-300'
                : 'bg-blue-500/20 border-blue-400/30 text-blue-300'
            }`}
          >
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold tracking-tight text-white font-heading">
                AI Pre-check & OCR Scrutiny Engine
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono text-[10px] font-bold">
                SYNTHETIC ADVISORY
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Automated document computer vision & cross-database anomaly assessment
            </p>
          </div>
        </div>

        {/* Risk Score & Level Widget */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-300 block">
              Risk Score
            </span>
            <span
              className={`font-mono text-base font-extrabold ${
                isSimulatedMismatch ? 'text-rose-300' : 'text-emerald-300'
              }`}
            >
              {riskScore}/100
            </span>
          </div>
          <RiskBadge level={riskLevel} score={riskScore} size="md" />
        </div>
      </div>

      {/* Interactive Anomaly Simulator for Evaluators */}
      {allowSimulation && (
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-700">SIH Hackathon Evaluator Control:</span>
            <span className="text-slate-500 hidden md:inline">
              Test normal OCR verification vs. discrepancy detection
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setSimulationMode('normal')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                simulationMode === 'normal'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Normal (LOW - 25/100)
            </button>
            <button
              type="button"
              onClick={() => setSimulationMode('mismatch')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                simulationMode === 'mismatch'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Simulate Mismatch (HIGH - 78/100)
            </button>
          </div>
        </div>
      )}

      {/* Main Body Grid */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* 1. DOCUMENT UPLOADED SECTION */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Document Uploaded
              </h5>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
              OCR PROCESSED
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-slate-900 block">
                  {documentName}
                </span>
                <span className="text-[11px] text-slate-500">
                  {documentSize} • Scanned Tax Invoice & Statutory Warranty Plate • Uploaded{' '}
                  {documentUploadedAt}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded self-start sm:self-auto border border-blue-100">
              Confidence: 99.4%
            </span>
          </div>
        </div>

        {/* 2. OCR EXTRACTION SECTION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <ScanLine className="w-4 h-4 text-indigo-600" />
              <span>OCR Extraction Stream</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Engine: Deep-Vision OCR v2.4
            </span>
          </div>

          <div className="p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5 overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between text-slate-400 text-[10px] pb-1 border-b border-slate-800">
              <span>RAW EXTRACTED TEXT BUFFER</span>
              <span className="text-emerald-400">STATUS: COMPLETE</span>
            </div>
            <p className="text-blue-300 leading-relaxed break-all">
              {rawOcrSnippet}
            </p>
          </div>
        </div>

        {/* 3. FIELD COMPARISON & MATCH/MISMATCH TABLE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <ArrowRightLeft className="w-4 h-4 text-blue-600" />
              <span>Field Comparison & Validation</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Database Registry vs. OCR Document
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Parameter</th>
                  <th className="px-4 py-3">Database Value</th>
                  <th className="px-4 py-3">Document Value (OCR)</th>
                  <th className="px-4 py-3 text-center">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {ocrComparison.map((item, idx) => {
                  const isMatch = item.result === 'MATCH' || item.status === 'MATCH';
                  return (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        !isMatch ? 'bg-rose-50/50 hover:bg-rose-50' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900">{item.field}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{item.dbValue}</td>
                      <td
                        className={`px-4 py-3 font-mono font-bold ${
                          !isMatch ? 'text-rose-700' : 'text-slate-900'
                        }`}
                      >
                        {item.docValue}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isMatch ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> MATCH
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-300 animate-pulse">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> MISMATCH
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. RISK SCORE, RISK LEVEL & RISK FACTORS */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  isSimulatedMismatch ? 'text-rose-600' : 'text-amber-600'
                }`}
              />
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Risk Analysis & Evaluation Factors
              </h5>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Calculated Advisory Risk:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  isSimulatedMismatch
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {riskLevel} ({riskScore}/100)
              </span>
            </div>
          </div>

          <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc marker:text-blue-500 leading-relaxed">
            {riskFactors.map((factor, fIdx) => (
              <li
                key={fIdx}
                className={
                  factor.startsWith('CRITICAL')
                    ? 'font-bold text-rose-700 list-none -ml-4 flex items-start gap-1.5'
                    : ''
                }
              >
                {factor.startsWith('CRITICAL') && (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. MANDATORY STATUTORY DISCLAIMER (EXACT STRING REQUIRED) */}
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-xs shadow-2xs">
          <Info className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
              Legal Metrology Compliance Safeguard
            </span>
            <p className="font-semibold text-amber-900 leading-relaxed">
              "AI provides decision support. Final verification is performed by authorized personnel."
            </p>
            <p className="text-[11px] text-amber-800/80">
              Statutory verification authority rests solely with appointed legal metrology officers under the Legal Metrology Act, 2009.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisCard;
