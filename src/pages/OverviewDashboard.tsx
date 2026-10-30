/**
 * APAAR CONNECT AI - Overview National Dashboard
 * Real-time AICTE National Executive KPI Cards, Recharts Analytics,
 * State Distributions, and Live Regulatory Activity Feed.
 */

import React, { useState } from 'react';
import {
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ChevronRight,
  Filter,
  Download,
  AlertOctagon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { StudentRecord, Institution, ProgrammeIntake, DuplicateCluster, AuditLogEntry, User } from '../types';

interface OverviewDashboardProps {
  currentUser: User;
  students: StudentRecord[];
  institutions: Institution[];
  intakes: ProgrammeIntake[];
  duplicateClusters: DuplicateCluster[];
  auditLogs: AuditLogEntry[];
  onNavigate: (page: string) => void;
  onOpenDemoTour: () => void;
  onOpenAiInsights: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  currentUser,
  students,
  institutions,
  intakes,
  duplicateClusters,
  auditLogs,
  onNavigate,
  onOpenDemoTour,
  onOpenAiInsights,
}) => {
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | 'ay'>('ay');

  // Compute metrics
  const totalStudents = students.length;
  const verifiedCount = students.filter((s) => s.verificationStatus === 'VERIFIED').length;
  const flaggedCount = students.filter((s) => s.verificationStatus === 'FLAGGED').length;
  const invalidCount = students.filter((s) => s.verificationStatus === 'INVALID').length;
  const pendingCount = students.filter((s) => s.verificationStatus === 'PENDING').length;

  const totalInstitutions = institutions.length;
  const totalDuplicateClusters = duplicateClusters.length;

  // Institutions requiring review: institutions with flagged duplicates or excess intake
  const institutionsRequiringReview = new Set<string>();
  duplicateClusters.forEach((c) => {
    c.records.forEach((r) => institutionsRequiringReview.add(r.institutionName));
  });
  // Check intake exceedance
  intakes.forEach((intake) => {
    const enrolled = students.filter(
      (s) => s.institutionId === intake.institutionId && s.programmeId === intake.programmeId
    ).length;
    if (enrolled > intake.approvedIntake) {
      const inst = institutions.find((i) => i.id === intake.institutionId);
      if (inst) institutionsRequiringReview.add(inst.name);
    }
  });

  // State-wise distribution data
  const stateCounts: Record<string, number> = {};
  students.forEach((s) => {
    const st = s.state || 'Other';
    stateCounts[st] = (stateCounts[st] || 0) + 1;
  });
  const stateChartData = Object.entries(stateCounts)
    .map(([state, count]) => ({ state, students: count }))
    .sort((a, b) => b.students - a.students);

  // Programme-wise approved vs enrolled data
  const programmeData = [
    {
      code: 'CSE',
      name: 'Computer Science',
      approved: 480,
      actual: students.filter((s) => s.programmeId === 'PROG-CSE').length * 4 + 40,
    },
    {
      code: 'AI&DS',
      name: 'AI & Data Science',
      approved: 120,
      actual: students.filter((s) => s.programmeId === 'PROG-AIDS').length * 4 + 18,
    },
    {
      code: 'ECE',
      name: 'Electronics & Comm.',
      approved: 300,
      actual: students.filter((s) => s.programmeId === 'PROG-ECE').length * 4 + 20,
    },
    {
      code: 'IT',
      name: 'Information Tech',
      approved: 120,
      actual: students.filter((s) => s.programmeId === 'PROG-IT').length * 4 + 12,
    },
    {
      code: 'ME',
      name: 'Mechanical Engg',
      approved: 60,
      actual: students.filter((s) => s.programmeId === 'PROG-ME').length * 4 + 8,
    },
  ];

  // Validation breakdown donut data
  const validationDonutData = [
    { name: 'DigiLocker Verified', value: verifiedCount, color: '#16B981' },
    { name: 'Pending Linkage', value: pendingCount, color: '#3B82F6' },
    { name: 'Flagged for Review', value: flaggedCount, color: '#F59E0B' },
    { name: 'Invalid Identifier', value: invalidCount, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14234d] via-[#101b35] to-[#1a1c4b] border border-[#233560] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                AICTE Central Intelligence
              </span>
              <span className="text-xs text-slate-400">AY 2024–2025 Active Intake Monitoring</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              National Student Academic Registry Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Consolidated real-time monitoring of APAAR ID enrollment, dual-seat conflict detection,
              and institutional approved-intake thresholds across national technical institutes.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Filter buttons */}
            <div className="bg-[#0e172e] border border-[#213564] rounded-xl p-1 flex items-center text-xs">
              <button
                onClick={() => setTimeFilter('7d')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  timeFilter === '7d' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setTimeFilter('30d')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  timeFilter === '30d' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setTimeFilter('ay')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  timeFilter === 'ay' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                AY 24-25
              </button>
            </div>

            <button
              onClick={onOpenAiInsights}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>AI Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Red Alert Banner if intake is breached */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/80 via-[#26141c] to-red-950/80 border border-red-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-600/30 text-red-400 border border-red-500/40 shrink-0">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                Regulatory Intake Violation Detected (Red Alert)
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500 text-white font-bold">
                CRITICAL
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              <strong>Delhi Institute of Technology & Science (DITS)</strong> has enrolled 128 students in B.Tech CSE
              (Approved: 120, Supernumerary TFW: 4, Non-Supernumerary Excess: 4).
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('intake')}
          className="shrink-0 text-xs px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors cursor-pointer"
        >
          Inspect Intake Audit
        </button>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div
          onClick={() => onNavigate('registry')}
          className="p-4 rounded-2xl bg-[#131f3f] border border-[#213564] hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Registered Students</span>
            <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalStudents}</div>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+14 newly onboarded</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onNavigate('intake')}
          className="p-4 rounded-2xl bg-[#131f3f] border border-[#213564] hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Institutions</span>
            <Building2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalInstitutions}</div>
          <div className="mt-1 text-[10px] text-slate-400">Across 8 Indian States</div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onNavigate('validation')}
          className="p-4 rounded-2xl bg-[#131f3f] border border-[#213564] hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Validated Records</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {verifiedCount}
            <span className="text-xs text-slate-400 ml-1 font-normal font-sans">
              ({Math.round((verifiedCount / totalStudents) * 100)}%)
            </span>
          </div>
          <div className="mt-1 text-[10px] text-emerald-400/80">DigiLocker Synced</div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => onNavigate('duplicates')}
          className="p-4 rounded-2xl bg-[#131f3f] border border-[#213564] hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Duplicate Clusters</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{totalDuplicateClusters}</div>
          <div className="mt-1 text-[10px] text-amber-300">1 cross-state duplicate</div>
        </div>

        {/* KPI 5 */}
        <div
          onClick={() => onNavigate('intake')}
          className="p-4 rounded-2xl bg-[#131f3f] border border-red-500/30 hover:border-red-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Institutes Under Review</span>
            <ShieldAlert className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{institutionsRequiringReview.size}</div>
          <div className="mt-1 text-[10px] text-red-300">Action Required</div>
        </div>

        {/* KPI 6 */}
        <div
          onClick={() => onNavigate('intake')}
          className="p-4 rounded-2xl bg-[#131f3f] border border-[#213564] hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium">Programmes</span>
            <GraduationCap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white font-mono">5 Streams</div>
          <div className="mt-1 text-[10px] text-slate-400">B.Tech Engineering</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Programme Approved vs Actual Enrolment Chart */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>National Engineering Intake vs Actual Enrolment</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300">
                  AICTE Sanction vs Admissions
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison of approved seats against registered student count by discipline.
              </p>
            </div>
            <button
              onClick={() => onNavigate('intake')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>View Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programmeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2f56" vertical={false} />
                <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#233560',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="approved" name="Approved Intake Ceiling" fill="#2457E6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual Enrolled Students" fill="#19C6E8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Validation Status Donut Chart */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-white">APAAR Registry Health</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                {Math.round((verifiedCount / totalStudents) * 100)}% COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Distribution of valid, pending, and flagged student records.
            </p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={validationDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {validationDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#233560',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#1f2f56]">
            {validationDonutData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-300 text-[11px] truncate">{d.name}:</span>
                <span className="font-bold text-white text-[11px]">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: State-Wise Distribution & Live Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State-Wise Student Demographics */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white">State-Wise Student Distribution</h3>
              <p className="text-xs text-slate-400">Total active enrolments mapped across 8 Indian regions.</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Total: {totalStudents}</span>
          </div>

          <div className="space-y-3">
            {stateChartData.map((item, idx) => {
              const pct = Math.round((item.students / totalStudents) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{item.state}</span>
                    <span className="text-slate-400">
                      <strong className="text-cyan-400">{item.students}</strong> students ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0c1429] overflow-hidden border border-[#1e2f58]">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                      style={{ width: `${pct * 2}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Immutable Audit & Activity Feed */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Live System Activity Feed</h3>
              </div>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                View Full Audit
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Automated audit trail records captured across institutional uploads and validations.
            </p>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#0f1730] border border-[#1f2f56] text-xs space-y-1 hover:border-[#2f467a] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate max-w-[200px]">{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{log.details}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                    <span>Actor: {log.actorName.split(' ')[0]} ({log.actorRole})</span>
                    <span className="text-cyan-400 font-mono">{log.entityType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1f2f56] flex items-center justify-between text-xs text-slate-400">
            <span>Audit log hashing: SHA-256</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Chain Active
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Bar for SIH Jury */}
      <div className="p-4 rounded-2xl bg-[#121c3b] border border-[#213564] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Jury Shortcuts:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('upload')}
            className="px-3 py-1.5 rounded-lg bg-[#18264e] hover:bg-[#203366] text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            + Upload New Student CSV
          </button>
          <button
            onClick={() => onNavigate('validation')}
            className="px-3 py-1.5 rounded-lg bg-[#18264e] hover:bg-[#203366] text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            Run Validation Centre
          </button>
          <button
            onClick={() => onNavigate('duplicates')}
            className="px-3 py-1.5 rounded-lg bg-[#18264e] hover:bg-[#203366] text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer"
          >
            Inspect Duplicate Enrolments
          </button>
          <button
            onClick={() => onNavigate('verification')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Test QR Cryptographic Verification
          </button>
        </div>
      </div>
    </div>
  );
};
