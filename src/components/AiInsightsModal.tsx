/**
 * APAAR CONNECT AI - AICTE Intelligence & Insights Panel
 * Analyzes active student and institutional datasets to surface high-risk anomalies,
 * seat poaching patterns, and regulatory action recommendations.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  AlertOctagon,
  Building2,
  ShieldCheck,
  TrendingUp,
  Brain,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { StudentRecord, Institution, ProgrammeIntake, DuplicateCluster } from '../types';

interface AiInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentRecord[];
  institutions: Institution[];
  intakes: ProgrammeIntake[];
  duplicateClusters: DuplicateCluster[];
}

export const AiInsightsModal: React.FC<AiInsightsModalProps> = ({
  isOpen,
  onClose,
  students,
  institutions,
  intakes,
  duplicateClusters,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customSummary, setCustomSummary] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time analysis of the current dataset
  const total = students.length;
  const missingApaar = students.filter((s) => !s.apaarId || s.apaarId.trim() === '').length;
  const invalidApaar = students.filter((s) => s.verificationStatus === 'INVALID').length;
  const crossInstDups = duplicateClusters.filter((c) => c.matchType === 'EXACT_APAAR' && c.confidenceScore === 100);

  // Check intake breaches
  const breachedIntakes = intakes.filter((intake) => {
    const enrolledCount = students.filter(
      (s) => s.institutionId === intake.institutionId && s.programmeId === intake.programmeId
    ).length;
    // Base approved intake
    return enrolledCount > intake.approvedIntake;
  });

  const generateDynamicAiBrief = async () => {
    setIsGenerating(true);
    // Simulating deep semantic analysis with model heuristics
    setTimeout(() => {
      setCustomSummary(
        `AICTE EXECUTIVE BRIEFING (GENERATED ON ${new Date().toLocaleDateString('en-IN')})
        
Key Findings:
1. Cross-State Dual Enrolment Vector: A definitive match was detected involving APAAR ID 4821-9034-7182 between Delhi (DITS) and Maharashtra (MITE). The student secured admission under General quota in both universities within a 48-hour window, suggesting systemic seat blocking during Centralized Seat Allocation (CSAB).
2. Regulatory Intake Warning: DITS New Delhi B.Tech CSE has exceeded authorized student intake by 8 students. While 4 are classified under Supernumerary TFW, 4 remain non-supernumerary, representing a regulatory violation under AICTE Approval Process Handbook (APH) norms.
3. DigiLocker Sync Bottleneck: Approximately ${Math.round((missingApaar / total) * 100)}% of enrolled records lack active APAAR linking. Regional Office Lucknow and Ahmedabad report lowest compliance.

Recommended Immediate Actions:
• Dispatch automated Stage-1 Nodal Query to Registrars of DITS New Delhi and MITE Pune.
• Temporarily freeze migration certificates for flagged APAAR clusters until student submits self-declaration.
• Instruct state admission directorates to reconcile final mop-up rounds with APAAR registry.`
      );
      setIsGenerating(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101b35] border border-cyan-500/40 rounded-2xl max-w-3xl w-full text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-[#17254f] to-purple-900 px-6 py-4 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">AICTE Regulatory AI Insights Engine</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-semibold">
                  Rule-Based + GenAI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated multi-dataset correlation across admissions, intake, and student records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Top Heuristic Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#142145] border border-red-500/30">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Critical Intake Breaches</span>
                <AlertOctagon className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{breachedIntakes.length} Programmes</div>
              <p className="text-[11px] text-red-300 mt-1">DITS New Delhi (CSE) over ceiling</p>
            </div>

            <div className="p-4 rounded-xl bg-[#142145] border border-amber-500/30">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Cross-Institution Duplicates</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{crossInstDups.length} Confirmed</div>
              <p className="text-[11px] text-amber-300 mt-1">100% confidence match</p>
            </div>

            <div className="p-4 rounded-xl bg-[#142145] border border-cyan-500/30">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>APAAR Registration Gap</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{missingApaar + invalidApaar} Records</div>
              <p className="text-[11px] text-cyan-300 mt-1">Requires DigiLocker sync</p>
            </div>
          </div>

          {/* Detailed Intelligence Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Active System Anomaly Analysis
            </h4>

            {/* Item 1 */}
            <div className="p-4 rounded-xl bg-[#131f42] border border-[#213564] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-cyan-300">
                  Dual Enrolment Seat Poaching Risk
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
                  HIGH SEVERITY
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Student <strong className="text-white">Aditya Narayan Verma</strong> (APAAR:{' '}
                <span className="font-mono text-cyan-300">4821-9034-7182</span>) holds an active seat at{' '}
                <span className="text-white">Delhi Institute of Technology & Science</span> (CSE) and simultaneously at{' '}
                <span className="text-white">Maharashtra Institute of Technology & Engineering</span> (CSE) in AY 2024–2025.
              </p>
              <div className="mt-2 text-[11px] text-slate-400 bg-[#0e172e] p-2.5 rounded-lg border border-[#1e2f58]">
                <strong>AICTE Protocol Recommendation:</strong> Trigger Section 12-A Show Cause Notice to both institutions.
                The candidate must surrender one allocation within 7 business days to vacate the blocked seat for waiting list applicants.
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-4 rounded-xl bg-[#131f42] border border-[#213564] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-amber-300">
                  Approved Intake Non-Supernumerary Excess
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                  INTAKE BREACH
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Delhi Institute of Technology & Science</strong> has 128 enrolled students in
                B.Tech CSE against approved ceiling of 120. Analysis reveals 4 students enrolled under legitimate TFW (Tuition Fee Waiver),
                leaving <strong>4 unaccounted excess enrolments</strong>.
              </p>
              <div className="mt-2 text-[11px] text-slate-400 bg-[#0e172e] p-2.5 rounded-lg border border-[#1e2f58]">
                <strong>AICTE Protocol Recommendation:</strong> Request institution admission register audit. Non-supernumerary
                excess students cannot be issued AICTE-accredited graduation tokens without council sanction.
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-4 rounded-xl bg-[#131f42] border border-[#213564] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-purple-300">
                  Data Quality & Excel Truncation Pattern
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold">
                  DATA GOVERNANCE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Validation engine detected 3 records with corrupted APAAR formats in KERI Kolkata and UPIT Lucknow.
                Analysis indicates institution clerks used Microsoft Excel without text-column formatting, dropping leading zeros
                or auto-formatting 12-digit numbers into exponential scientific notation.
              </p>
            </div>
          </div>

          {/* AI Generated Briefing Section */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#152349] to-[#1c2150] border border-cyan-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="font-bold text-xs text-cyan-300 uppercase tracking-wider">
                  Executive AI Briefing (LLM Assisted)
                </span>
              </div>
              <button
                onClick={generateDynamicAiBrief}
                disabled={isGenerating}
                className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white bg-blue-600/40 hover:bg-blue-600/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Analyzing...' : 'Generate New Brief'}</span>
              </button>
            </div>

            {customSummary ? (
              <pre className="font-mono text-[11px] text-slate-200 whitespace-pre-wrap bg-[#0c1429] p-3.5 rounded-lg border border-[#1e2f58] leading-relaxed">
                {customSummary}
              </pre>
            ) : (
              <p className="text-xs text-slate-400">
                Click &quot;Generate New Brief&quot; to synthesize an executive summary across the current student database,
                regulatory policies, and intake thresholds.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0d162e] border-t border-[#1e2f58] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="text-[11px]">
            * AICTE Decision Support: Insights must be verified by Regional Nodal Officers before formal action.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#162347] hover:bg-[#1d2d5a] text-slate-200 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
