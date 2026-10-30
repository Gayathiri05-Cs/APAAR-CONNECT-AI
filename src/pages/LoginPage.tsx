/**
 * APAAR CONNECT AI - Role-Based Login System
 * Supports 3 Demo Personas: AICTE Admin, Institution Admin, and Authorized Verifier
 */

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Building2,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/defaultData';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('aicte_admin');
  const [email, setEmail] = useState('admin@apaarconnect.ai');
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'aicte_admin') {
      setEmail('admin@apaarconnect.ai');
      setPassword('Demo@123');
    } else if (role === 'institution_admin') {
      setEmail('college@apaarconnect.ai');
      setPassword('Demo@123');
    } else {
      setEmail('verifier@apaarconnect.ai');
      setPassword('Demo@123');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (user && password === 'Demo@123') {
      onLogin(user);
    } else if (user) {
      setError('Invalid password. Demo password is: Demo@123');
    } else {
      // Fallback matching role
      const matched = DEMO_USERS.find((u) => u.role === selectedRole);
      if (matched) onLogin(matched);
      else setError('Invalid credentials.');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = DEMO_USERS.find((u) => u.role === role);
    if (user) onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#0a1122] flex flex-col justify-center items-center p-4 relative overflow-hidden text-white">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#101b35]/90 border border-[#233560] rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative z-10">
        {/* Left Branding Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#121f45] via-[#101b35] to-[#1c1840] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#233560]">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2457E6] to-[#19C6E8] flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 mb-6">
              <Shield className="w-7 h-7 text-white" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">
              National Digital Governance
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              APAAR CONNECT AI
            </h1>
            <p className="text-xs text-cyan-200/80 font-medium mt-1 leading-relaxed">
              One Student. One Trusted Academic Identity. One Connected Ecosystem.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Automated 12-digit APAAR format verification & ABC Bank linkage.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Multi-factor cross-institution duplicate enrollment detection.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>AICTE approved-intake compliance with supernumerary tracking.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Tamper-evident SHA-256 cryptographic verification & QR portal.</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300">Smart India Hackathon Prototype</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Demonstration Environment – Synthetic Student Data – Not Connected to Official Systems.
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Access Academic Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your authorization role to explore tailored permissions and views.
            </p>
          </div>

          {/* Persona Selection Pills */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('aicte_admin')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'aicte_admin'
                  ? 'bg-blue-600/30 border-cyan-400 text-white shadow-md'
                  : 'bg-[#152349] border-[#223562] text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              <div className="text-[11px] font-bold">AICTE Admin</div>
              <div className="text-[9px] text-slate-400">National View</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('institution_admin')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'institution_admin'
                  ? 'bg-blue-600/30 border-cyan-400 text-white shadow-md'
                  : 'bg-[#152349] border-[#223562] text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <div className="text-[11px] font-bold">College Admin</div>
              <div className="text-[9px] text-slate-400">Institute View</div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('verifier')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'verifier'
                  ? 'bg-blue-600/30 border-cyan-400 text-white shadow-md'
                  : 'bg-[#152349] border-[#223562] text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <div className="text-[11px] font-bold">Verifier</div>
              <div className="text-[9px] text-slate-400">Audit & QR</div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Authorized Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#152244] border border-[#24355a] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Demo Password</label>
                <span className="text-[10px] text-cyan-300 font-mono">Preset: Demo@123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#152244] border border-[#24355a] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>Sign In to APAAR Connect AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Login for Jury */}
          <div className="mt-6 pt-5 border-t border-[#233560]">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Instant Jury 1-Click Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('aicte_admin')}
                className="py-1.5 px-2 rounded-lg bg-[#152349] hover:bg-[#1c2e60] border border-blue-500/30 text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Launch Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('institution_admin')}
                className="py-1.5 px-2 rounded-lg bg-[#152349] hover:bg-[#1c2e60] border border-blue-500/30 text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Launch College
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('verifier')}
                className="py-1.5 px-2 rounded-lg bg-[#152349] hover:bg-[#1c2e60] border border-blue-500/30 text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Launch Verifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
