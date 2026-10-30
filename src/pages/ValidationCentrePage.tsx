/**
 * APAAR CONNECT AI - Automated APAAR Validation Centre
 * Rule-based validation engine interface with Green, Amber, Red categorization,
 * interactive issue breakdown, recommended AICTE actions, and batch validation trigger.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  RefreshCw,
  Filter,
  FileSpreadsheet,
  Check,
  Wrench,
  Search,
  ExternalLink,
  ChevronDown,
  Info,
} from 'lucide-react';
import { StudentRecord, ValidationIssue } from '../types';
import { exportToCsv } from '../utils/csvParser';
import { formatApaarId } from '../utils/validationEngine';

interface ValidationCentrePageProps {
  students: StudentRecord[];
  issues: ValidationIssue[];
  onRunValidation: () => void;
  onResolveIssue: (issueId: string, correctiveNote?: string) => void;
  onEditStudent: (student: StudentRecord) => void;
  onNavigateToDuplicates: () => void;
}

export const ValidationCentrePage: React.FC<ValidationCentrePageProps> = ({
  students,
  issues,
  onRunValidation,
  onResolveIssue,
  onEditStudent,
  onNavigateToDuplicates,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'RED' | 'AMBER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setProgress] = useState(100);

  // Group counts
  const redIssues = issues.filter((i) => i.severity === 'RED' && i.status === 'PENDING');
  const amberIssues = issues.filter((i) => i.severity === 'AMBER' && i.status === 'PENDING');
  const resolvedIssues = issues.filter((i) => i.status === 'RESOLVED');

  const redRecordIds = new Set(redIssues.map((i) => i.recordRef));
  const amberRecordIds = new Set(amberIssues.map((i) => i.recordRef));

  const validRecordCount = students.filter(
    (s) => !redRecordIds.has(s.id) && !amberRecordIds.has(s.id)
  ).length;

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    if (issue.status === 'RESOLVED') return false;
    const matchesSev = severityFilter === 'ALL' || issue.severity === severityFilter;
    const cleanSearch = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      issue.studentName.toLowerCase().includes(cleanSearch) ||
      issue.studentId.toLowerCase().includes(cleanSearch) ||
      issue.institutionName.toLowerCase().includes(cleanSearch) ||
      issue.description.toLowerCase().includes(cleanSearch);
    return matchesSev && matchesSearch;
  });

  const handleTriggerValidation = () => {
    setIsValidating(true);
    setProgress(20);
    setTimeout(() => {
      setProgress(65);
      setTimeout(() => {
        setProgress(100);
        onRunValidation();
        setIsValidating(false);
      }, 400);
    }, 300);
  };

  const handleExportValidationReport = () => {
    const rows = issues.map((i) => ({
      'Issue ID': i.id,
      'Severity': i.severity,
      'Rule Code': i.code,
      'Student Name': i.studentName,
      'Roll / Ref': i.studentId,
      'Institution': i.institutionName,
      'Description': i.description,
      'Recommended Action': i.recommendation,
      'Timestamp': i.timestamp,
      'Status': i.status,
    }));
    exportToCsv(`APAAR_Validation_Audit_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Automated APAAR Validation Centre</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              Rule Engine v2.4 Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            AICTE automated validation pipeline executing 7 standard checks: format verification, 12-digit
            checksum, mandatory fields, duplicate roll numbers, and cross-institutional conflict detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportValidationReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#152349] hover:bg-[#1d2f60] border border-[#233560] text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Audit Log</span>
          </button>

          <button
            onClick={handleTriggerValidation}
            disabled={isValidating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
            <span>{isValidating ? 'Running Engine...' : 'Run Full Validation'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar when running */}
      {isValidating && (
        <div className="p-4 rounded-xl bg-[#152244] border border-cyan-500/40 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>Executing 7-point AICTE Validation Matrix on {students.length} student records...</span>
            <span className="font-mono font-bold">{validationProgress}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#0c1429] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${validationProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 4 Outcome Metric Cards (GREEN, AMBER, RED, RESOLVED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GREEN */}
        <div
          onClick={() => setSeverityFilter('ALL')}
          className="p-5 rounded-2xl bg-[#121c3b] border border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Valid Records (Green)</span>
            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{validRecordCount}</div>
          <div className="mt-1 text-[11px] text-emerald-300">
            {Math.round((validRecordCount / students.length) * 100)}% Pass Compliance
          </div>
        </div>

        {/* AMBER */}
        <div
          onClick={() => setSeverityFilter('AMBER')}
          className={`p-5 rounded-2xl bg-[#121c3b] border transition-all cursor-pointer group ${
            severityFilter === 'AMBER'
              ? 'border-amber-400 ring-2 ring-amber-400/20'
              : 'border-amber-500/30 hover:border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Requires Review (Amber)</span>
            <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{amberIssues.length}</div>
          <div className="mt-1 text-[11px] text-amber-300">Missing APAAR / Pending Consent</div>
        </div>

        {/* RED */}
        <div
          onClick={() => setSeverityFilter('RED')}
          className={`p-5 rounded-2xl bg-[#121c3b] border transition-all cursor-pointer group ${
            severityFilter === 'RED'
              ? 'border-red-400 ring-2 ring-red-400/20'
              : 'border-red-500/30 hover:border-red-500'
          }`}
        >
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Invalid Records (Red)</span>
            <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-extrabold text-red-400 font-mono">{redIssues.length}</div>
          <div className="mt-1 text-[11px] text-red-300">Critical Format / Duplicate Violations</div>
        </div>

        {/* RESOLVED */}
        <div className="p-5 rounded-2xl bg-[#121c3b] border border-blue-500/30">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Resolved Cases</span>
            <Check className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{resolvedIssues.length}</div>
          <div className="mt-1 text-[11px] text-blue-300">Corrected in Current Session</div>
        </div>
      </div>

      {/* Rules Breakdown Checklist Bar */}
      <div className="p-4 rounded-xl bg-[#131f42] border border-[#213564] text-xs">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-cyan-300">
          AICTE Active Regulatory Rules Evaluated:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-slate-300">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0e172e] border border-[#1e2f58]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>12-Digit Format & Checksum</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0e172e] border border-[#1e2f58]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Duplicate APAAR Detection</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0e172e] border border-[#1e2f58]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Multi-Factor Identity Matching</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#0e172e] border border-[#1e2f58]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Institutional Roll Number Collision</span>
          </div>
        </div>
      </div>

      {/* Issue Table & Filter Bar */}
      <div className="rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl overflow-hidden">
        {/* Header row with search and filter tabs */}
        <div className="p-4 bg-[#0e172e] border-b border-[#213564] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Flagged Issues Queue ({filteredIssues.length})
            </span>
            <div className="flex items-center gap-1 bg-[#142145] p-1 rounded-lg border border-[#233560] text-xs">
              <button
                onClick={() => setSeverityFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  severityFilter === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({issues.filter((i) => i.status === 'PENDING').length})
              </button>
              <button
                onClick={() => setSeverityFilter('RED')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  severityFilter === 'RED' ? 'bg-red-600 text-white font-bold' : 'text-red-400 hover:text-white'
                }`}
              >
                Critical Red ({redIssues.length})
              </button>
              <button
                onClick={() => setSeverityFilter('AMBER')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  severityFilter === 'AMBER' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400 hover:text-white'
                }`}
              >
                Review Amber ({amberIssues.length})
              </button>
            </div>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues by name, roll, code..."
              className="w-full bg-[#152244] border border-[#24355a] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Issue Cards List */}
        <div className="divide-y divide-[#1e2f58]">
          {filteredIssues.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
              <p className="font-bold text-white text-sm">No Pending Issues in this Category</p>
              <p className="text-xs text-slate-400 mt-1">
                All records matching the selected severity have been verified or resolved.
              </p>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const isRed = issue.severity === 'RED';
              const targetStudent = students.find((s) => s.id === issue.recordRef);

              return (
                <div
                  key={issue.id}
                  className="p-4 sm:p-5 hover:bg-[#152349]/40 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                          isRed
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {issue.code.replace(/_/g, ' ')}
                      </span>
                      <span className="font-bold text-white text-sm">{issue.studentName}</span>
                      <span className="text-xs font-mono text-cyan-300">({issue.studentId})</span>
                      <span className="text-xs text-slate-400">• {issue.institutionName}</span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {issue.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-[#0e172e] border border-[#1e2f58] text-xs text-cyan-200/90 flex items-start gap-2">
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">AICTE Recommended Action:</strong>{' '}
                        {issue.recommendation}
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center md:flex-col gap-2 shrink-0 md:min-w-[140px] justify-end">
                    {targetStudent && (
                      <button
                        onClick={() => onEditStudent(targetStudent)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#18264e] hover:bg-[#203366] text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Correct Record</span>
                      </button>
                    )}

                    {issue.code.includes('DUPLICATE') && (
                      <button
                        onClick={onNavigateToDuplicates}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#18264e] hover:bg-[#203366] text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Duplicate Hub</span>
                      </button>
                    )}

                    <button
                      onClick={() => onResolveIssue(issue.id, 'Verified by Nodal Officer')}
                      className="w-full px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
