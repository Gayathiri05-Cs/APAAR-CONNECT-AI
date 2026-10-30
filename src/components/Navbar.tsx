/**
 * APAAR CONNECT AI - Top Navigation Bar
 * Features role-switching, SIH Guided Demo launcher, global student search,
 * unread alerts notification drawer, and demo reset option.
 */

import React, { useState } from 'react';
import {
  Shield,
  Search,
  Bell,
  Sparkles,
  HelpCircle,
  RotateCcw,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { User, UserRole, StudentRecord } from '../types';
import { DEMO_USERS } from '../data/defaultData';

interface NavbarProps {
  currentUser: User;
  onSwitchRole: (user: User) => void;
  onOpenDemoTour: () => void;
  onOpenAiInsights: () => void;
  onResetData: () => void;
  onLogout: () => void;
  unreadAlertCount: number;
  onNavigate: (page: string) => void;
  allStudents: StudentRecord[];
  onSelectStudentProfile: (student: StudentRecord) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchRole,
  onOpenDemoTour,
  onOpenAiInsights,
  onResetData,
  onLogout,
  unreadAlertCount,
  onNavigate,
  allStudents,
  onSelectStudentProfile,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StudentRecord[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Quick live student search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const clean = query.toLowerCase().trim();
    const matches = allStudents
      .filter(
        (s) =>
          s.name.toLowerCase().includes(clean) ||
          (s.apaarId && s.apaarId.includes(clean)) ||
          s.studentId.toLowerCase().includes(clean) ||
          s.institutionName.toLowerCase().includes(clean)
      )
      .slice(0, 6);
    setSearchResults(matches);
    setShowSearchResults(true);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'aicte_admin':
        return { label: 'AICTE Admin (National)', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
      case 'institution_admin':
        return { label: 'College Admin', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/40' };
      case 'verifier':
        return { label: 'Authorized Verifier', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/40' };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0d162e]/95 backdrop-blur-md border-b border-[#1e2e56] text-white">
        {/* Demonstration Disclaimer Bar */}
        <div className="bg-gradient-to-r from-blue-950 via-[#101b35] to-blue-950 border-b border-blue-900/40 px-4 py-1 text-xs text-center flex items-center justify-center gap-2 text-cyan-300">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>
            <strong>SIH DEMO ENVIRONMENT</strong>: Synthetic Student Data – Aligned with AICTE APAAR & DigiLocker Standards.
          </span>
          <button
            onClick={onResetData}
            className="ml-3 underline hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] text-amber-300"
            title="Reset system to clean initial demo state"
          >
            <RotateCcw className="w-3 h-3" /> Reset Demo State
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('overview')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#2457E6] to-[#19C6E8] flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20">
              <Shield className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#101B35]"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  APAAR CONNECT AI
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-600/30 text-cyan-300 border border-blue-500/30">
                  AICTE SIH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block leading-tight">
                One Student. One Trusted Academic Identity.
              </p>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                placeholder="Search by Student Name, APAAR ID, Roll No..."
                className="w-full bg-[#152244] border border-[#24355a] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Quick search popup results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#121d3b] border border-[#233560] rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-[#233560]">
                  Matching Students ({searchResults.length})
                </div>
                {searchResults.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelectStudentProfile(s);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="px-3 py-2 hover:bg-[#1a2952] cursor-pointer flex items-center justify-between border-b border-white/5 last:border-b-0"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {s.name}
                        {s.verificationStatus === 'VERIFIED' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {s.verificationStatus === 'FLAGGED' && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {s.apaarId ? `APAAR: ${s.apaarId}` : 'NO APAAR'} • {s.institutionName.split(' ')[0]}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-cyan-300">
                      {s.programmeName.split(' ')[1] || 'B.Tech'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SIH Guided Demo Button */}
            <button
              onClick={onOpenDemoTour}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#2457E6] to-[#7257E8] hover:from-[#1b46c2] hover:to-[#5e43d3] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 border border-blue-400/30 transition-all cursor-pointer glow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span className="hidden sm:inline">SIH Guided</span> Demo
            </button>

            {/* AI Insights Button */}
            <button
              onClick={onOpenAiInsights}
              className="hidden lg:flex items-center gap-1.5 bg-[#152244] hover:bg-[#1c2c58] text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Insights</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => onNavigate('alerts')}
              className="relative p-2 rounded-lg bg-[#152244] hover:bg-[#1b2c58] border border-[#233560] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Alerts and Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[9px] flex items-center justify-center animate-bounce">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* Help / SIH Problem Statement */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-lg bg-[#152244] hover:bg-[#1b2c58] border border-[#233560] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="AICTE Problem Statement Overview"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${badge.bg}`}
              >
                <span>{badge.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-[#121d3b] border border-[#233560] rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#233560]">
                    Switch Demo Persona
                  </div>
                  {DEMO_USERS.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        onSwitchRole(u);
                        setShowRoleDropdown(false);
                      }}
                      className={`px-3 py-2 cursor-pointer transition-colors flex items-center justify-between ${
                        currentUser.role === u.role ? 'bg-blue-600/30 text-white font-semibold' : 'text-slate-300 hover:bg-[#19284e]'
                      }`}
                    >
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {u.role.replace('_', ' ')} {u.institutionName ? `• ${u.institutionName.split(' ')[0]}` : ''}
                        </div>
                      </div>
                      {currentUser.role === u.role && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 rounded-full border border-cyan-500/40 hover:border-cyan-400 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-[#121d3b] border border-[#233560] rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-3 border-b border-[#233560]">
                    <p className="font-bold text-white text-sm">{currentUser.name}</p>
                    <p className="text-slate-400 text-xs">{currentUser.email}</p>
                    <p className="text-[11px] text-cyan-300 mt-1 font-medium">{currentUser.designation}</p>
                    {currentUser.institutionName && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-blue-300">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate">{currentUser.institutionName}</span>
                      </div>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onNavigate('settings');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#1a2a54] text-slate-200 transition-colors"
                    >
                      System Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onResetData();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#1a2a54] text-amber-300 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Database
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-2 border-t border-white/5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Help Modal - SIH & AICTE Problem Statement */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121d3b] border border-[#233560] rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#233560] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-300">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Smart India Hackathon (SIH)</h3>
                  <p className="text-xs text-slate-400">AICTE Problem Statement: APAAR ID Student Data Management</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed max-h-[65vh] overflow-y-auto pr-2">
              <div className="p-3.5 rounded-xl bg-[#17254b] border border-blue-500/20">
                <h4 className="font-bold text-white text-sm mb-1 text-cyan-300">Core Objectives Addressed:</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-200">
                  <li><strong>Centralized Student Registry</strong> with 12-digit APAAR format validation and ABC Bank linkages.</li>
                  <li><strong>Cross-Institution Duplicate Detection:</strong> Detect students concurrently enrolled in multiple AICTE institutions.</li>
                  <li><strong>Approved Intake Monitoring:</strong> Automatic red-alerts when non-supernumerary seats breach the regulatory ceiling.</li>
                  <li><strong>Cryptographic Verification:</strong> Tamper-evident verification with canonical SHA-256 hashes and QR verification.</li>
                  <li><strong>Role-Based Governance:</strong> AICTE National Admin, College Nodal Officers, and Public/Employer Verifiers.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Pre-Configured Demo Test Cases:</h4>
                <p className="text-slate-400">
                  This demo includes synthetic test cases to test each feature:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="p-2.5 rounded-lg bg-[#162243] border border-red-500/30">
                    <span className="font-semibold text-red-400 block mb-0.5">Dual Enrolment Case:</span>
                    Aditya Narayan Verma (APAAR: 4821-9034-7182) enrolled at both DITS Delhi & MITE Pune.
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#162243] border border-amber-500/30">
                    <span className="font-semibold text-amber-400 block mb-0.5">Excess Intake Case:</span>
                    DITS New Delhi CSE enrolled 128 students against 120 base approved intake.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#233560] flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold text-xs cursor-pointer"
              >
                Got It, Return to App
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
