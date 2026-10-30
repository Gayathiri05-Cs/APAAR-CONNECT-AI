/**
 * APAAR CONNECT AI - System Settings & Governance Parameters
 * Configures regulatory tolerances, supernumerary caps, academic sessions,
 * and provides 1-click Demo Database Reset & Backup.
 */

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Download,
  Save,
  CheckCircle2,
  Shield,
  Sliders,
  Sparkles,
  Database,
  Lock,
} from 'lucide-react';
import { StudentRecord, Institution, ProgrammeIntake } from '../types';

interface SettingsPageProps {
  onResetData: () => void;
  students: StudentRecord[];
  institutions: Institution[];
  intakes: ProgrammeIntake[];
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onResetData,
  students,
  institutions,
  intakes,
}) => {
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [tfwCapPercentage, setTfwCapPercentage] = useState(5);
  const [pmsssAllowance, setPmsssAllowance] = useState(2);
  const [duplicateSensitivity, setDuplicateSensitivity] = useState<'STRICT' | 'STANDARD' | 'LENIENT'>('STRICT');
  const [enableGeminiSummaries, setEnableGeminiSummaries] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportDatabaseJson = () => {
    const fullBackup = {
      version: 'APAAR-CONNECT-AI-V1',
      exportedAt: new Date().toISOString(),
      students,
      institutions,
      intakes,
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `APAAR_Connect_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-cyan-400" />
              <span>Regulatory Policies & System Settings</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-600/30 text-cyan-300 font-semibold border border-blue-500/30">
              National Policy Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Configure council intake thresholds, supernumerary seat ceilings, validation strictness parameters,
            and manage local prototype demonstration state.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportDatabaseJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#152349] hover:bg-[#1d2f60] border border-[#233560] text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Database JSON</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>System governance parameters saved successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Academic Year & Sanction Policies */}
          <div className="p-5 rounded-2xl bg-[#121c3b] border border-[#213564] space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Academic Year & Intake Policies</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Active National Academic Session
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                >
                  <option value="2024-2025">AY 2024–2025 (Active Admissions)</option>
                  <option value="2023-2024">AY 2023–2024 (Archived)</option>
                  <option value="2025-2026">AY 2025–2026 (Upcoming Cycle)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tuition Fee Waiver (TFW) Supernumerary Cap (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={tfwCapPercentage}
                  onChange={(e) => setTfwCapPercentage(Number(e.target.value))}
                  className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  AICTE standard: 5% over and above the approved base intake for meritorious, economically weaker students.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  PMSSS (J&K Special Scholarship) Allowance per Programme
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={pmsssAllowance}
                  onChange={(e) => setPmsssAllowance(Number(e.target.value))}
                  className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  AICTE allows 2 supernumerary seats in engineering colleges for Prime Minister&apos;s Special Scholarship Scheme.
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: AI Validation & Duplicate Sensitivity */}
          <div className="p-5 rounded-2xl bg-[#121c3b] border border-[#213564] space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Validation Strictness & Algorithms</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Duplicate Matching Threshold
                </label>
                <select
                  value={duplicateSensitivity}
                  onChange={(e) => setDuplicateSensitivity(e.target.value as any)}
                  className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="STRICT">Strict (Exact APAAR + Fuzzy Name &gt;85% + DOB Match)</option>
                  <option value="STANDARD">Standard (Exact APAAR + Exact Name & DOB)</option>
                  <option value="LENIENT">Lenient (Only Exact 12-Digit APAAR Matches)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableGeminiSummaries}
                    onChange={(e) => setEnableGeminiSummaries(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#152244] border-[#24355a]"
                  />
                  <div>
                    <span className="font-bold text-white text-xs block">
                      Enable Gemini AI Executive Briefings
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Synthesize automated regulatory narrative summaries using generative intelligence.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Demo Reset */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#181122] to-red-950/40 border border-red-500/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-red-400 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-red-400" />
              <span>Reset Prototype Demonstration Database</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Restores the synthetic dataset to the initial SIH baseline (105+ students across 8 institutions,
              including the pre-configured dual enrolment case and DITS excess intake red alert).
            </p>
          </div>

          <button
            onClick={onResetData}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
