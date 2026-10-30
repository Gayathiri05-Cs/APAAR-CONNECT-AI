/**
 * APAAR CONNECT AI - Smart India Hackathon (SIH) Jury Guided Walkthrough
 * 8-Step interactive tour covering the entire AICTE problem statement workflow.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Users,
  UploadCloud,
  ShieldCheck,
  CopyCheck,
  BarChart3,
  QrCode,
  PieChart,
  RotateCcw,
  X,
  Play,
} from 'lucide-react';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStep: (pageId: string) => void;
  onResetDemoData: () => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToStep,
  onResetDemoData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      step: 1,
      title: 'National Enrolment Intelligence (AICTE Dashboard)',
      targetPage: 'overview',
      icon: LayoutIcon,
      badge: 'Step 1 of 8',
      summary: 'Centralized bird’s-eye view of all registered students, participating institutions, and key compliance metrics.',
      details: [
        'Real-time KPI cards: 100+ synthetic students across 8 premier engineering institutions.',
        'Intake utilization breakdown: Active enrollment vs AICTE regulatory ceiling.',
        'State-wise geographical distribution across Delhi, Maharashtra, Karnataka, Tamil Nadu, and more.',
        'Live system activity feed with immutable event tracking.',
      ],
      callToAction: 'View National Overview',
    },
    {
      step: 2,
      title: 'APAAR Central Student Registry',
      targetPage: 'registry',
      icon: Users,
      badge: 'Step 2 of 8',
      summary: 'Single pane of glass for all student academic identities with instant search, multi-filters, and profile drawer.',
      details: [
        'Explore individual student profiles, DigiLocker linkage, and Academic Bank of Credits (ABC) credit records.',
        'Filter by Institution, Engineering Programme, Admission Category, and Verification Status.',
        'Export compliant CSV datasets for state regulatory reporting.',
        'Add new student or edit demo profiles with instantaneous validation.',
      ],
      callToAction: 'Inspect Student Registry',
    },
    {
      step: 3,
      title: 'Student Data Upload & Bulk CSV Ingestion',
      targetPage: 'upload',
      icon: UploadCloud,
      badge: 'Step 3 of 8',
      summary: 'Robust CSV upload engine for institutional nodal officers to upload admissions with instant column mapping.',
      details: [
        'Drag-and-drop CSV ingestion with automatic header matching.',
        'Download official AICTE sample CSV template.',
        'Instant "Load SIH Test Batch" button to simulate an institutional upload with mixed valid and faulty records.',
        'Pre-submission preview and error summary report generation.',
      ],
      callToAction: 'Go to Data Upload Engine',
    },
    {
      step: 4,
      title: 'Automated APAAR Validation Engine',
      targetPage: 'validation',
      icon: ShieldCheck,
      badge: 'Step 4 of 8',
      summary: 'Rule-based verification checking 12-digit format, checksum, missing values, and institutional integrity.',
      details: [
        'Categorization into Green (Valid), Amber (Requires Review), and Red (Critical Invalid).',
        'Exposes why records fail (e.g., repeating digits like 9999-9999-9999, non-numeric characters, missing IDs).',
        'Actionable regulatory recommendations for institution nodal officers.',
        'One-click "Run Batch Validation" and "Auto-Resolve Known Fixes".',
      ],
      callToAction: 'Open Validation Centre',
    },
    {
      step: 5,
      title: 'Cross-Institution Duplicate Detection Engine',
      targetPage: 'duplicates',
      icon: CopyCheck,
      badge: 'Step 5 of 8',
      summary: 'High-precision multi-factor algorithm flagging concurrent enrolments and fraudulent seat blocking.',
      details: [
        'Exact APAAR match: Student "Aditya Narayan Verma" detected enrolled at both DITS Delhi and MITE Pune (100% confidence)!',
        'High-probability identity match: Matching Name + DOB across different colleges without APAAR declaration.',
        'Side-by-side comparative inspection card with admission timestamps.',
        'Regulatory resolution: Revoke redundant seat, flag for inquiry, or clear authorized lateral entry.',
      ],
      callToAction: 'Inspect Duplicate Detections',
    },
    {
      step: 6,
      title: 'Smart Enrolment & Approved-Intake Monitoring',
      targetPage: 'intake',
      icon: BarChart3,
      badge: 'Step 6 of 8',
      summary: 'Regulatory intake compliance dashboard with automatic RED ALERT generation for excess admissions.',
      details: [
        'Dynamic formula: Utilization = (Actual / Approved Intake) × 100.',
        'Critical distinction: Supernumerary seats (TFW up to 5%, PMSSS J&K quota) are segregated and not marked as illegal excess.',
        'Notice Red Alert on DITS New Delhi (B.Tech CSE): 128 actual vs 120 approved intake (4 TFW + 4 unauthorized excess!).',
        'Institution and Programme-wise comparison charts and seat utilization donuts.',
      ],
      callToAction: 'Monitor Approved Intake',
    },
    {
      step: 7,
      title: 'Secure Student Record Verification (QR & SHA-256)',
      targetPage: 'verification',
      icon: QrCode,
      badge: 'Step 7 of 8',
      summary: 'Cryptographic proof-of-authenticity portal for employers, universities, and document verifiers.',
      details: [
        'Generates real QR Code with opaque verification payload.',
        'Real-time SHA-256 hash calculation using Web Crypto API from canonical student attributes.',
        'Interactive "Simulate Record Tampering" toggle: Altering student details immediately breaks the cryptographic signature!',
        'Privacy-preserving data masking (e.g. APAAR XXXXXXXX7182) and official certificate preview.',
      ],
      callToAction: 'Try Cryptographic Verification',
    },
    {
      step: 8,
      title: 'AICTE Analytics & Official Report Generation',
      targetPage: 'analytics',
      icon: PieChart,
      badge: 'Step 8 of 8',
      summary: 'Executive analytics suite with interactive Recharts visualizations and printable audit reports.',
      details: [
        'State-wise compliance breakdown and engineering discipline distribution.',
        'Admission category demographics (General, OBC, SC, ST, EWS, Supernumerary).',
        'Generate and download official PDF/Print-ready AICTE Compliance Briefing.',
        'Complete chronological audit trail for government oversight.',
      ],
      callToAction: 'View Reports & Analytics',
    },
  ];

  const current = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      onNavigateToStep(tourSteps[nextIdx].targetPage);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      onNavigateToStep(tourSteps[prevIdx].targetPage);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStep(index);
    onNavigateToStep(tourSteps[index].targetPage);
  };

  function LayoutIcon(props: any) {
    return <Sparkles {...props} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101b35] border border-cyan-500/40 rounded-2xl max-w-3xl w-full text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-[#152349] to-purple-900 px-6 py-4 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                Smart India Hackathon 2024–2025
              </span>
              <h2 className="text-lg font-bold text-white">SIH Jury Guided Demonstration</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Navigation Dots */}
        <div className="px-6 py-3 bg-[#0d162e] border-b border-[#1e2f58] flex items-center justify-between gap-1 overflow-x-auto">
          {tourSteps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => handleJumpToStep(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                idx === currentStep
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : idx < currentStep
                  ? 'bg-[#152348] text-emerald-400 hover:bg-[#1a2c5a]'
                  : 'bg-[#152244] text-slate-400 hover:bg-[#1b2b54]'
              }`}
            >
              {idx < currentStep ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-black/40 text-[10px] flex items-center justify-center font-bold">
                  {s.step}
                </span>
              )}
              <span className="hidden sm:inline">Step {s.step}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {current.badge}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              AICTE Core Requirement
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
          <p className="text-sm text-cyan-100/90 leading-relaxed mb-4">
            {current.summary}
          </p>

          <div className="p-4 rounded-xl bg-[#142145] border border-[#233560] space-y-2 mb-6">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              What Jury Can Observe In This Step:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {current.details.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onNavigateToStep(current.targetPage);
                  onClose();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{current.callToAction}</span>
              </button>
              <button
                onClick={onResetDemoData}
                className="p-2.5 rounded-xl bg-[#16244a] hover:bg-[#1d2f60] border border-[#2b3e70] text-amber-300 text-xs transition-colors flex items-center gap-1.5"
                title="Reset to initial state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset Baseline</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                disabled={currentStep === 0}
                onClick={handlePrev}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentStep === 0
                    ? 'opacity-40 cursor-not-allowed bg-[#131e3d] text-slate-500'
                    : 'bg-[#152349] hover:bg-[#1d2f60] text-slate-200 border border-[#2b3e70] cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                disabled={currentStep === tourSteps.length - 1}
                onClick={handleNext}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  currentStep === tourSteps.length - 1
                    ? 'opacity-40 cursor-not-allowed bg-[#131e3d] text-slate-500'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 cursor-pointer'
                }`}
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
