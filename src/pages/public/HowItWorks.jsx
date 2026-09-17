import React from 'react';
import {
  ShieldCheck,
  Scale,
  Camera,
  Bot,
  Award,
  QrCode,
  Lock,
  CheckCircle2,
  FileText,
  Users,
  Building,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export const HowItWorks = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <ShieldCheck className="w-4 h-4" />
          <span>System Architecture & Operational Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          How METRA-VERIFY Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          An end-to-end overview of the digital verification lifecycle for commercial weighing and measuring instruments, from self-service trader filing to field telemetry and public consumer audit.
        </p>
      </div>

      {/* 4 Multi-Tier Workflow Pillars */}
      <div className="space-y-12">
        {/* Tier 1: Business */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
              <Building className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 uppercase">Pillar 1 • Trader Lifecycle</span>
            <h3 className="text-xl font-bold text-slate-900">Instrument Registration & Application</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Traders onboard measuring equipment by registering statutory specs (Serial Number, Make, Model Approval ID, Capacity, Accuracy Class). Once entered, a persistent Digital Instrument ID is minted.
            </p>
          </div>
          <div className="lg:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Direct Document Upload:</strong> Upload invoices, manufacturer type approval documents, and baseline test sheets.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Real-time Progress Tracking:</strong> Transparent 8-step stepper updates traders at each audit phase.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Centralized License Repository:</strong> All active and expiring verification certificates are accessible in one portal.
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: AI Pre-Check */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Pillar 2 • Advisory AI Engine</span>
            <h3 className="text-xl font-bold text-slate-900">OCR Extraction & Anomaly Pre-check</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated computer vision inspects uploaded statutory certificates and invoices to confirm that the serial plate, model number, and capacity ratings match declared specs prior to scheduling field staff.
            </p>
          </div>
          <div className="lg:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Dynamic Risk Scoring:</strong> Applications receive an advisory risk tier (Low, Medium, High) to prioritize inspections.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Strict Ethical Governance:</strong> AI acts solely as decision support. No application is auto-rejected or legally certified without human officer review.
              </div>
            </div>
          </div>
        </div>

        {/* Tier 3: Field Inspector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 uppercase">Pillar 3 • Physical Telematics</span>
            <h3 className="text-xl font-bold text-slate-900">Geofenced Field Inspection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Field inspectors conduct rigorous on-site verification using standard reference test weights (Class E2, F1, M1), recording observed deviations, lead seal attachments, and geotagged photographic proof.
            </p>
          </div>
          <div className="lg:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Mandatory Geofence Matching:</strong> Inspector coordinates are audited against the trader's registered location coordinates.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Zero-Drift & Eccentricity Tests:</strong> Standard multi-point weight readings are submitted with automatic MPE calculation.
              </div>
            </div>
          </div>
        </div>

        {/* Tier 4: Public QR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit">
              <QrCode className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Pillar 4 • Citizen Protection</span>
            <h3 className="text-xl font-bold text-slate-900">Public QR Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every legally approved instrument receives a unique cryptographic certificate ID and physical QR sticker. Consumers, traders, and enforcement squads can verify validity instantaneously on any smartphone.
            </p>
          </div>
          <div className="lg:col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Instant Status Flags:</strong> Displays Valid, Expired, Revoked, or Unregistered warnings in high contrast.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Fraud Deterrence:</strong> Eliminates forged paper certificates in retail marketplaces, mandis, and fuel stations.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold font-heading">Experience the Interactive Prototype</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Try the demonstration environment with synthetic trader profiles, test inspection checklists, and public verification records.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/business/dashboard">
            <Button variant="primary" size="md">
              Launch Business Portal
            </Button>
          </Link>
          <Link to="/verify/MV-2026-000123">
            <Button variant="outlineDark" size="md">
              Test Public Verification
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
