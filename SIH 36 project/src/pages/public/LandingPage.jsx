import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Cpu,
  Smartphone,
  Award,
  Layers,
  FileCheck,
  Lock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Users,
  Eye,
  Activity,
  FileText,
  Building2,
  Scale,
  MapPin,
  Clock,
  ExternalLink,
  QrCode,
  Shield,
  Zap,
  BarChart3,
  Check,
  Bot,
  Camera
} from 'lucide-react';
import {
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  StatusBadge,
  RiskBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Alert
} from '../../components/ui';

export const LandingPage = () => {
  const [certQuery, setCertQuery] = useState('MV-2026-000123');
  const navigate = useNavigate();

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (certQuery.trim()) {
      navigate(`/verify/${certQuery.trim()}`);
    }
  };

  const steps = [
    {
      num: '01',
      title: 'Digital Instrument Registration',
      subtitle: 'Onboarding & Asset Minting',
      desc: 'Traders register statutory instrument specifications (Make, Model Approval, Serial Plate, Capacity, Accuracy Class). The system issues an immutable Digital Instrument ID (e.g. MV-INS-000123).',
      icon: Scale,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      num: '02',
      title: 'AI Pre-check & OCR Validation',
      subtitle: 'Automated Document Scrutiny',
      desc: 'Deep OCR extracts statutory text from manufacturer invoices and test certificates, performing database cross-comparison to detect model mismatches and compute an advisory risk score.',
      icon: Bot,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      num: '03',
      title: 'Field Telematics & On-Site Audit',
      subtitle: 'Mobile Geofenced Verification',
      desc: 'Authorized field inspectors visit the premises with an offline-capable mobile checklist, recording observed standard test weight readings against Maximum Permissible Error (MPE) tolerances with GPS geofencing.',
      icon: Camera,
      color: 'from-blue-700 to-cyan-600'
    },
    {
      num: '04',
      title: 'Officer Adjudication & Certificate',
      subtitle: 'Cryptographic QR Seal Issuance',
      desc: 'Authorized verification officers review AI comparisons and field evidence to approve, reject, or request corrections. Upon approval, a cryptographically signed QR certificate is published.',
      icon: Award,
      color: 'from-emerald-600 to-teal-600'
    }
  ];

  const problemComparisons = [
    {
      feature: 'Certificate Authenticity',
      legacy: 'Paper stamps easily forged, copied, or physically tampered with.',
      metra: 'Cryptographically hashed SHA-256 digital certificate with universal QR verification.'
    },
    {
      feature: 'Field Verification Audit',
      legacy: 'Manual paper logbooks with zero physical telematics or location proof.',
      metra: 'Mandatory GPS geofence locking, timestamped telemetry, and photo evidence.'
    },
    {
      feature: 'Document Verification',
      legacy: 'Tedious manual review prone to missed discrepancies and delays.',
      metra: 'AI-assisted OCR pre-check flags model, serial, and class anomalies in seconds.'
    },
    {
      feature: 'Consumer Transparency',
      legacy: 'Shoppers have no method to confirm if a retail billing scale is calibrated.',
      metra: 'Any citizen scans the QR sticker on the scale with any phone camera to see validity.'
    },
    {
      feature: 'Re-verification Tracking',
      legacy: 'Unmonitored expiry dates causing unexpected penalties or uncalibrated trade.',
      metra: 'Automated expiry alerts, trader self-service renewals, and centralized state index.'
    }
  ];

  const trustPillars = [
    {
      icon: Lock,
      title: 'Cryptographic SHA-256 Signatures',
      desc: 'Each approved verification record is sealed with a unique cryptographic hash, guaranteeing that certificate parameters cannot be altered post-issuance.'
    },
    {
      icon: MapPin,
      title: 'GPS Geofenced Telematics',
      desc: 'Inspectors cannot submit field calibration reports unless their mobile device GPS telematics coordinates match the registered trader premises within a strict boundary.'
    },
    {
      icon: QrCode,
      title: 'Physical Tamper-Proof QR Labels',
      desc: 'Approved instruments receive a durable QR sticker linking directly to the public registry, enabling instant verification by enforcement squads and consumers.'
    },
    {
      icon: Activity,
      title: 'Immutable Audit Trail',
      desc: 'Every event—from document upload to inspector measurements and officer signature—is permanently recorded in a non-repudiable audit ledger.'
    }
  ];

  const roles = [
    {
      id: 'business',
      role: 'Business & Traders',
      badge: 'Self-Service Compliance',
      headline: 'Seamless compliance, zero counter queues',
      desc: 'Register commercial weighing devices, upload statutory purchase invoices, track verification progress in real time through an 8-step visual timeline, and download digital certificates.',
      stats: '3-min registration • Instant renewal tracking',
      action: 'Open Business Portal',
      link: '/business/dashboard',
      icon: Building2,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'inspector',
      role: 'Field Inspectors',
      badge: 'Mobile Telematics Desk',
      headline: 'Field verification with offline-ready telematics',
      desc: 'Mobile-first tool optimized for field audits. Interactive statutory checklist, live GPS geofence acquisition, standard test weight error calculations against MPE limits, and photo evidence capture.',
      stats: 'Geofenced audits • MPE error calculator',
      action: 'Open Inspector Desk',
      link: '/inspector/dashboard',
      icon: Camera,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'officer',
      role: 'Verification Officers',
      badge: 'Statutory Regulatory Desk',
      headline: 'High-density adjudication with decision support',
      desc: 'Unified regulatory console. Review OCR comparisons, inspect field telematics and test weight errors, request corrections, and approve applications with confirmation modals to issue certificates.',
      stats: 'Automated pre-check • 1-click certificate issue',
      action: 'Open Officer Desk',
      link: '/officer/dashboard',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      id: 'citizen',
      role: 'Citizens & Consumers',
      badge: 'Public Marketplace Trust',
      headline: 'Instant verification at the point of sale',
      desc: 'Scan physical QR stickers affixed to grocery scales, jewelry balances, fuel dispensers, or weighbridges to immediately confirm statutory validity, preventing retail short-weighing fraud.',
      stats: 'Zero app required • Instant camera scan',
      action: 'Try Public Verification',
      link: '/verify/MV-2026-000123',
      icon: QrCode,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  const benefits = [
    {
      title: 'Consumer Protection',
      desc: 'Protects citizens from short-weighing and volume fraud in retail markets, grocery mandis, and fuel stations.',
      icon: Users,
      metric: '100% Public Access'
    },
    {
      title: 'Anti-Counterfeiting',
      desc: 'Eliminates forged paper certificates and duplicate serial numbers through unique digital cryptographic hashes.',
      icon: Shield,
      metric: 'Zero Paper Forgery'
    },
    {
      title: 'Inspector Accountability',
      desc: 'Mandatory GPS geofencing and audit timestamps ensure physical visits are verified and authenticated.',
      icon: MapPin,
      metric: 'Geofenced Audits'
    },
    {
      title: 'Rapid Turnaround',
      desc: 'AI pre-check and automated OCR reduce clerical document scrutiny turnaround time by over 70%.',
      icon: Zap,
      metric: '70% Faster Cycles'
    },
    {
      title: 'Ease of Doing Business',
      desc: 'Traders manage all equipment, applications, and legal certifications online without manual department visits.',
      icon: TrendingUp,
      metric: 'Paperless Filing'
    },
    {
      title: 'National Governance',
      desc: 'Real-time visibility across jurisdictions, compliance rates, overdue re-verifications, and risk clusters.',
      icon: BarChart3,
      metric: 'State-wide Visibility'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* =========================================================================
          SECTION 2: HERO SECTION
          ========================================================================= */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-b border-slate-800">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* SIH 2026 Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Smart India Hackathon 2026 • Legal Metrology Digital Transformation</span>
            </div>

            {/* Main Headline */}
            <Heading level="h1" className="text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold tracking-tight leading-tight">
              Digital Verification for a More{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                Trusted Marketplace
              </span>
            </Heading>

            {/* Subtext */}
            <Text variant="lead" className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              METRA-VERIFY connects businesses, inspectors, authorized officers and citizens through a secure digital verification lifecycle.
            </Text>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/business/dashboard">
                <Button variant="primary" size="lg" rightIcon={ArrowRight} className="w-full sm:w-auto shadow-lg shadow-blue-500/20">
                  Get Started
                </Button>
              </Link>
              <Link to="/verify/MV-2026-000123">
                <Button variant="outlineDark" size="lg" className="w-full sm:w-auto" leftIcon={ShieldCheck}>
                  Verify Certificate
                </Button>
              </Link>
            </div>

            {/* Quick Public Search Bar Box */}
            <div className="pt-6 max-w-xl mx-auto">
              <form
                onSubmit={handleVerifySubmit}
                className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 flex items-center shadow-xl gap-2"
              >
                <div className="pl-3 text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={certQuery}
                  onChange={(e) => setCertQuery(e.target.value)}
                  placeholder="Enter Certificate ID (e.g. MV-2026-000123)"
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none px-2 py-1 font-mono"
                />
                <Button type="submit" variant="primary" size="sm" className="shrink-0">
                  Verify Now
                </Button>
              </form>

              {/* Sample Quick Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
                <span>Demo Search Records:</span>
                <button
                  type="button"
                  onClick={() => setCertQuery('MV-2026-000123')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700 hover:bg-slate-700 font-mono text-[10px]"
                >
                  MV-2026-000123 (Valid)
                </button>
                <button
                  type="button"
                  onClick={() => setCertQuery('MV-2025-000089')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700 font-mono text-[10px]"
                >
                  MV-2025-000089 (Expired)
                </button>
                <button
                  type="button"
                  onClick={() => setCertQuery('MV-2026-000999')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700 hover:bg-slate-700 font-mono text-[10px]"
                >
                  MV-2026-000999 (Revoked)
                </button>
              </div>
            </div>

            {/* 4 Credibility Metrics */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-white">100%</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Tamper-Proof Audit Trail</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-white">&lt; 1 sec</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Public QR Verification</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-white">GPS</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Geofenced Field Audits</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-white">AI-OCR</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated Pre-check</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: PROBLEM STATEMENT
          ========================================================================= */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="space-y-8">
          {/* SIH Callout Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <AlertTriangle className="w-4 h-4" />
                  SIH 2026 Problem Statement
                </div>
                <Heading level="h2" className="text-xl sm:text-2xl">
                  "Development of an Online Verification System for Weighing and Measuring Instruments."
                </Heading>
                <Text variant="body" className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Traditional legal metrology relies on manual paper certificates, handwritten verification stamping, and disconnected field visits. This introduces significant systemic vulnerabilities: forged calibration certificates, unmonitored measurement drift, absence of location audits, and zero visibility for consumers at retail billing counters.
                </Text>
              </div>

              <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto">
                <div className="bg-white p-3 rounded-lg border border-blue-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Eliminates Paper Forgery</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mandatory Field Geofencing</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-blue-200 text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Universal Public QR Inspection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legacy vs METRA-VERIFY Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <Heading level="h3" size="text-lg">Traditional Verification vs. METRA-VERIFY</Heading>
              <Text variant="muted">Direct architectural comparison between manual practices and our digital trust platform</Text>
            </div>
            <Table>
              <TableHeader>
                <TableRow hover={false}>
                  <TableHead className="w-1/4">Key Dimension</TableHead>
                  <TableHead className="w-3/8 text-rose-700">Traditional Paper Process</TableHead>
                  <TableHead className="w-3/8 text-emerald-700">METRA-VERIFY Digital Lifecycle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problemComparisons.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold text-slate-900">{item.feature}</TableCell>
                    <TableCell className="text-slate-600 text-xs">
                      <div className="flex items-start gap-1.5 text-rose-700">
                        <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{item.legacy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-800 text-xs">
                      <div className="flex items-start gap-1.5 text-emerald-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                        <span>{item.metra}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HOW IT WORKS
          ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Layers className="w-3.5 h-3.5" />
            <span>End-to-End Operational Lifecycle</span>
          </div>
          <Heading level="h2" size="text-2xl sm:text-3xl">How METRA-VERIFY Works</Heading>
          <Text variant="muted">A four-stage digital governance lifecycle from instrument registration to consumer verification</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-2xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                      {s.num}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    {s.subtitle}
                  </span>
                  <Heading level="h4" size="text-base" className="mb-2">
                    {s.title}
                  </Heading>
                  <Text variant="small" className="text-slate-600 leading-relaxed">
                    {s.desc}
                  </Text>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Phase {s.num}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: DIGITAL TRUST CHAIN
          ========================================================================= */}
      <section id="trust-chain" className="bg-slate-900 text-white py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Non-Repudiation Architecture</span>
            </div>
            <Heading level="h2" className="text-2xl sm:text-4xl text-white">
              The METRA-VERIFY Digital Trust Chain
            </Heading>
            <Text variant="lead" className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
              Our architecture establishes an unbroken chain of custody from physical instrument stamping to consumer smartphone verification.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 w-fit">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-700/60 text-[11px] font-mono text-blue-300">
                    Proof Layer 0{idx + 1}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cryptographic Demonstration Block */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl text-slate-900 shrink-0">
                <QrCode className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">Live Cryptographic Fingerprint</span>
                <p className="font-mono text-xs text-slate-200">
                  SHA-256: 8f7d9a1e0b5c43d2e1f980123456789abcdef0123456789abcdef0123456789a
                </p>
                <p className="text-[11px] text-slate-400">
                  Anchored to Public Certificate MV-2026-000123 • Zero possibility of post-issuance tampering
                </p>
              </div>
            </div>

            <Link to="/verify/MV-2026-000123" className="shrink-0">
              <Button variant="primary" size="sm" rightIcon={ExternalLink}>
                Verify Public Record
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: AI ASSISTANCE (PRE-CHECK & DECISION SUPPORT)
          ========================================================================= */}
      <section id="ai-assistance" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Explanation */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
              <Bot className="w-4 h-4" />
              <span>Intelligent Pre-Check Engine</span>
            </div>

            <Heading level="h2" size="text-2xl sm:text-3xl">
              AI Decision Support Meets Statutory Rigor
            </Heading>

            <Text variant="body" className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Before an application is assigned to field inspectors or the officer queue, METRA-VERIFY automatically cross-references uploaded manufacturer invoices and type approval documents against registered statutory parameters.
            </Text>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Computer Vision OCR Extraction</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Extracts stamped serial numbers, model designations, and maximum capacity directly from PDFs and photographs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dynamic Risk Score Matrix (0-100)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Evaluates type-approval database status, historical calibration drift records, and documentation completeness to score risk.
                  </p>
                </div>
              </div>
            </div>

            {/* MANDATORY STATUTORY DISCLAIMER */}
            <Alert variant="warning" title="Statutory Legal Metrology Notice">
              AI provides decision support. Final verification is performed by authorized legal metrology personnel.
            </Alert>
          </div>

          {/* Right: Live Interactive AI Analysis Panel */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <Bot className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">AI Pre-check Comparison</h4>
                  <p className="text-[11px] text-blue-200">Statutory Parameter Cross-Check</p>
                </div>
              </div>
              <RiskBadge level="LOW" score={25} />
            </div>

            <div className="p-5 space-y-4">
              <Table>
                <TableHeader>
                  <TableRow hover={false}>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Database Value</TableHead>
                    <TableHead>Document Value</TableHead>
                    <TableHead className="text-center">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-xs">Serial Number</TableCell>
                    <TableCell className="font-mono text-xs">WS123456</TableCell>
                    <TableCell className="font-mono text-xs text-slate-900">WS123456</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success" size="sm" leftIcon={CheckCircle2}>MATCH</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-xs">Manufacturer</TableCell>
                    <TableCell className="font-mono text-xs">ABC Instruments</TableCell>
                    <TableCell className="font-mono text-xs text-slate-900">ABC Instruments</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success" size="sm" leftIcon={CheckCircle2}>MATCH</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-xs">Model</TableCell>
                    <TableCell className="font-mono text-xs">WS-500</TableCell>
                    <TableCell className="font-mono text-xs text-slate-900">WS-500</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success" size="sm" leftIcon={CheckCircle2}>MATCH</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold text-xs">Instrument Type</TableCell>
                    <TableCell className="font-mono text-xs">Digital Weighing Scale</TableCell>
                    <TableCell className="font-mono text-xs text-slate-900">Digital Weighing Scale</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="success" size="sm" leftIcon={CheckCircle2}>MATCH</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">Risk Evaluation Factors:</span>
                <p className="text-slate-600 text-[11px]">
                  • Stamped serial number matches manufacturer invoice format pattern.
                </p>
                <p className="text-slate-600 text-[11px]">
                  • Accuracy class (Class III NAWI) adheres strictly to retail schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: USER ROLES
          ========================================================================= */}
      <section id="user-roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Users className="w-3.5 h-3.5" />
            <span>Multi-Role Governance Matrix</span>
          </div>
          <Heading level="h2" size="text-2xl sm:text-3xl">Tailored Portals for Every Stakeholder</Heading>
          <Text variant="muted">Purpose-built environments designed around specific regulatory duties</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className={`p-3 rounded-xl border w-fit mb-4 ${r.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    {r.badge}
                  </span>
                  <Heading level="h4" size="text-base" className="mb-2">
                    {r.role}
                  </Heading>
                  <Text variant="small" className="text-slate-600 leading-relaxed mb-4">
                    {r.desc}
                  </Text>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    {r.stats}
                  </span>
                  <Link to={r.link} className="block">
                    <Button variant="outline" size="sm" className="w-full justify-between" rightIcon={ArrowRight}>
                      {r.action}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: BENEFITS
          ========================================================================= */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Measurable Impact</span>
          </div>
          <Heading level="h2" size="text-2xl sm:text-3xl">Systemic Benefits of METRA-VERIFY</Heading>
          <Text variant="muted">Tangible outcomes for consumers, traders, field personnel, and regulatory authorities</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {b.metric}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{b.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: CALL TO ACTION (CTA)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 text-center lg:text-left max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <span>Smart India Hackathon 2026</span>
            </div>
            <Heading level="h2" className="text-2xl sm:text-4xl text-white font-extrabold tracking-tight">
              Ready to Experience Next-Gen Legal Metrology?
            </Heading>
            <Text variant="lead" className="text-slate-300 text-xs sm:text-sm">
              Explore the demonstration platform with realistic synthetic records for Sharma Traders, mobile inspector checklists, and public QR certificate verification.
            </Text>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10 w-full sm:w-auto">
            <Link to="/business/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg">
                Explore Demo Portals
              </Button>
            </Link>
            <Link to="/verify/MV-2026-000123" className="w-full sm:w-auto">
              <Button variant="outlineDark" size="lg" className="w-full sm:w-auto">
                Verify Certificate
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
