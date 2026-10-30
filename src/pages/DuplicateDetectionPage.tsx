/**
 * APAAR CONNECT AI - Duplicate Detection Centre
 * Multi-factor matching engine with confidence scoring, side-by-side comparative inspection,
 * and AICTE regulatory resolution workflows.
 */

import React, { useState } from 'react';
import {
  CopyCheck,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Check,
  X,
  FileSpreadsheet,
  Building,
  GraduationCap,
  Calendar,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { DuplicateCluster, StudentRecord } from '../types';
import { formatApaarId } from '../utils/validationEngine';
import { exportToCsv } from '../utils/csvParser';

interface DuplicateDetectionPageProps {
  duplicateClusters: DuplicateCluster[];
  onResolveCluster: (clusterId: string, action: 'REVOKED' | 'FALSE_POSITIVE', note: string) => void;
  onSelectStudentProfile: (student: StudentRecord) => void;
}

export const DuplicateDetectionPage: React.FC<DuplicateDetectionPageProps> = ({
  duplicateClusters,
  onResolveCluster,
  onSelectStudentProfile,
}) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>(
    duplicateClusters[0]?.id || ''
  );
  const [resolutionNote, setResolutionNote] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('OPEN');

  const activeCluster =
    duplicateClusters.find((c) => c.id === selectedClusterId) || duplicateClusters[0];

  const filteredClusters = duplicateClusters.filter((c) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'OPEN') return c.status === 'OPEN' || c.status === 'INVESTIGATING';
    return c.status === 'RESOLVED_REVOKED' || c.status === 'FALSE_POSITIVE';
  });

  const handleExportCsv = () => {
    const rows = duplicateClusters.map((c) => ({
      'Cluster ID': c.id,
      'Match Type': c.matchType,
      'Confidence Score (%)': c.confidenceScore,
      'Reason': c.reason,
      'Student Count': c.records.length,
      'Institutions Involved': c.records.map((r) => r.institutionName).join('; '),
      'Status': c.status,
      'Flagged Date': c.flaggedDate,
    }));
    exportToCsv(`Duplicate_Enrolment_Audit_${new Date().toISOString().split('T')[0]}`, rows);
  };

  const getConfidenceBadge = (score: number) => {
    if (score === 100) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-400 border border-red-500/40">
          100% EXACT APAAR MATCH
        </span>
      );
    }
    if (score >= 85) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
          {score}% HIGH IDENTITY PROBABILITY
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
        {score}% POSSIBLE MATCH
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <CopyCheck className="w-5 h-5 text-amber-400" />
              <span>Multi-Factor Duplicate Enrolment Centre</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              Cross-Institution Surveillance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Detects concurrent enrollments across different AICTE institutions in the same academic year,
            preventing fraudulent seat blocking and enforcing national single-seat admission compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#152349] hover:bg-[#1d2f60] border border-[#233560] text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Duplicate Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cluster Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              Flagged Cases ({filteredClusters.length})
            </span>
            <div className="flex items-center gap-1 bg-[#101b35] p-1 rounded-lg border border-[#233560]">
              <button
                onClick={() => setStatusFilter('OPEN')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  statusFilter === 'OPEN' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                  statusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredClusters.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-[#121c3b] rounded-2xl border border-[#213564]">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
                <p className="font-semibold text-white text-xs">No active duplicate clusters</p>
              </div>
            ) : (
              filteredClusters.map((cluster) => {
                const isSelected = cluster.id === activeCluster?.id;
                const is100 = cluster.confidenceScore === 100;

                return (
                  <div
                    key={cluster.id}
                    onClick={() => {
                      setSelectedClusterId(cluster.id);
                      setResolutionNote('');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#17254e] to-[#1c2956] border-cyan-400 shadow-lg ring-1 ring-cyan-400/30'
                        : 'bg-[#121c3b] border-[#213564] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold font-mono text-cyan-300">
                        {cluster.id}
                      </span>
                      {getConfidenceBadge(cluster.confidenceScore)}
                    </div>

                    <h4 className="font-bold text-white text-xs mb-1">
                      {cluster.records[0]?.name}
                    </h4>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {cluster.reason}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{cluster.records.length} Institutions Involved</span>
                      <span
                        className={`font-bold ${
                          cluster.status === 'OPEN' ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {cluster.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Side-by-Side Comparison Dossier */}
        <div className="lg:col-span-8">
          {activeCluster ? (
            <div className="p-6 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-2xl space-y-6">
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#213564] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      CASE #{activeCluster.id}
                    </span>
                    {getConfidenceBadge(activeCluster.confidenceScore)}
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    Candidate Identity Comparison Dossier
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Regulatory comparison between concurrent enrolment records across universities.
                  </p>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-400">Flagged Date:</span>
                  <div className="font-mono text-white font-semibold">{activeCluster.flaggedDate}</div>
                </div>
              </div>

              {/* Side-by-Side Cards Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCluster.records.map((rec, idx) => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-2xl bg-[#142145] border border-[#233560] relative space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#233560] pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                        Record A{idx + 1}: {rec.institutionName.split(' ')[0]}
                      </span>
                      <button
                        onClick={() => onSelectStudentProfile(rec)}
                        className="text-[10px] text-cyan-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <span>Full Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base">{rec.name}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Roll: <span className="text-slate-200">{rec.studentId}</span>
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#0e172e] border border-[#1e2f58] space-y-1 text-xs">
                      <div className="text-slate-400 text-[10px] uppercase">Declared APAAR ID</div>
                      <div className="font-mono font-bold text-cyan-300">
                        {rec.apaarId ? formatApaarId(rec.apaarId) : 'BLANK / UNREGISTERED'}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{rec.institutionName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{rec.programmeName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Admitted: {rec.admissionDate} ({rec.academicYear})</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#233560] flex items-center justify-between text-xs">
                      <span className="text-slate-400">Category: {rec.admissionCategory}</span>
                      <span className="text-slate-400">DOB: {rec.dob}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AICTE Regulatory Analysis Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#17254e] via-[#1a2550] to-[#17254e] border border-cyan-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Regulatory Finding & Rule Evaluation</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{activeCluster.reason}</p>
                <p className="text-[11px] text-slate-400">
                  <strong>AICTE APH Clause 8.4:</strong> No candidate shall hold active concurrent regular
                  degree enrolment in two AICTE-approved institutions in the same academic session.
                </p>
              </div>

              {/* Decision & Action Workflow */}
              <div className="p-4 rounded-xl bg-[#0f1730] border border-[#213564] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Administrative Resolution Action</span>
                </h4>

                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Enter AICTE inquiry note or confirmation details (e.g., student surrendered seat at DITS on 2024-09-01)..."
                  rows={2}
                  className="w-full bg-[#152244] border border-[#24355a] rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() =>
                      onResolveCluster(
                        activeCluster.id,
                        'FALSE_POSITIVE',
                        resolutionNote || 'Verified as authorized institutional transfer'
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-[#162244] hover:bg-[#1d2d5a] text-slate-300 border border-[#2b3e70] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Mark as Authorized Transfer / False Positive
                  </button>

                  <button
                    onClick={() =>
                      onResolveCluster(
                        activeCluster.id,
                        'REVOKED',
                        resolutionNote || 'Duplicate admission confirmed; redundant seat revoked.'
                      )
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Duplicate (Revoke 2nd Enrolment)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-[#121c3b] rounded-2xl border border-[#213564]">
              Select a cluster from the left panel to inspect the comparative dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
