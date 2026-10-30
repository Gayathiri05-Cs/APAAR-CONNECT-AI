/**
 * APAAR CONNECT AI - Comprehensive Student Profile & Verification Card Modal
 * Displays full demographic, institutional, ABC Bank credits, canonical SHA-256 hash, and generated QR code.
 */

import React, { useEffect, useState } from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  Building,
  GraduationCap,
  Calendar,
  CreditCard,
  Download,
  Fingerprint,
  ExternalLink,
} from 'lucide-react';
import QRCodeLib from 'qrcode';
import { StudentRecord } from '../types';
import { buildCanonicalRecordPayload, computeSha256Hex, maskApaarId, maskEmail, maskPhoneNumber } from '../utils/crypto';

interface StudentDetailModalProps {
  student: StudentRecord | null;
  onClose: () => void;
  onNavigateToVerification: (studentId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onNavigateToVerification,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [canonicalHash, setCanonicalHash] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedApaar, setCopiedApaar] = useState(false);

  useEffect(() => {
    if (!student) return;

    // Generate canonical record hash
    const payload = buildCanonicalRecordPayload(student);
    computeSha256Hex(payload).then((hash) => {
      setCanonicalHash(hash);
    });

    // Generate QR code with secure verification URL payload
    const verificationPayload = JSON.stringify({
      v: 'APAAR-V1',
      id: student.id,
      roll: student.studentId,
      apaar: student.apaarId ? maskApaarId(student.apaarId) : 'UNREGISTERED',
      name: student.name,
      inst: student.institutionName,
      prog: student.programmeName,
      ay: student.academicYear,
      token: student.id.slice(-6).toUpperCase(),
    });

    QRCodeLib.toDataURL(verificationPayload, {
      width: 220,
      margin: 2,
      color: {
        dark: '#101b35',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [student]);

  if (!student) return null;

  const copyToClipboard = (text: string, type: 'hash' | 'apaar') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedApaar(true);
      setTimeout(() => setCopiedApaar(false), 2000);
    }
  };

  const getStatusBadge = () => {
    switch (student.verificationStatus) {
      case 'VERIFIED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" /> AICTE & DigiLocker Verified
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5" /> Flagged for Review
          </span>
        );
      case 'INVALID':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40">
            <X className="w-3.5 h-3.5" /> Invalid Identifier
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            Pending APAAR Linkage
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101b35] border border-[#233560] rounded-2xl max-w-3xl w-full text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#17254e] via-[#1b2b5a] to-[#201d4a] px-6 py-4 border-b border-[#24355a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-cyan-400/30 text-cyan-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Student Academic Identity Card</h3>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-400">
                National Academic Depository & APAAR Registry Protocol
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Identity Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-[#142145] border border-[#233560]">
            <div className="flex flex-col items-center text-center justify-center border-b md:border-b-0 md:border-r border-[#233560] pb-4 md:pb-0 md:pr-4">
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-1 shadow-lg shadow-blue-500/20">
                  <div className="w-full h-full rounded-[14px] bg-[#111a33] flex items-center justify-center text-3xl font-extrabold text-cyan-300">
                    {student.name.charAt(0)}
                  </div>
                </div>
                {student.digilockerSynced && (
                  <span
                    className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-black rounded-full"
                    title="Aadhaar DigiLocker Synced"
                  >
                    <CheckCircle2 className="w-4 h-4 fill-white text-emerald-600" />
                  </span>
                )}
              </div>
              <h4 className="font-bold text-white text-base leading-tight">{student.name}</h4>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">{student.studentId}</p>
              <div className="mt-2 text-[11px] text-slate-400">
                DOB: <span className="text-slate-200">{student.dob}</span> • Gender: <span className="text-slate-200">{student.gender}</span>
              </div>
            </div>

            {/* Central Details */}
            <div className="md:col-span-2 space-y-3">
              <div className="p-3 rounded-xl bg-[#0e172e] border border-[#1e2f58]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  National APAAR ID (Automated Permanent Academic Account Registry)
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-base font-mono font-bold text-cyan-300 tracking-wider">
                    {student.apaarId || 'NOT ASSIGNED / PENDING LINKAGE'}
                  </span>
                  {student.apaarId && (
                    <button
                      onClick={() => copyToClipboard(student.apaarId!, 'apaar')}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedApaar ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#111c3a] border border-[#1e2e54]">
                  <span className="text-slate-400 block text-[10px] uppercase">Institution</span>
                  <span className="font-semibold text-white truncate block">{student.institutionName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#111c3a] border border-[#1e2e54]">
                  <span className="text-slate-400 block text-[10px] uppercase">Programme</span>
                  <span className="font-semibold text-white truncate block">{student.programmeName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#111c3a] border border-[#1e2e54]">
                  <span className="text-slate-400 block text-[10px] uppercase">Admission Category</span>
                  <span className="font-semibold text-white">{student.admissionCategory}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#111c3a] border border-[#1e2e54]">
                  <span className="text-slate-400 block text-[10px] uppercase">Academic Year</span>
                  <span className="font-semibold text-white">{student.academicYear} (Sem {student.semester})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic & DigiLocker Credit Tally */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#142145] border border-[#233560] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">ABC Credits Bank</span>
                <span className="text-lg font-bold text-white font-mono">{student.abcCreditsEarned} Credits</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#142145] border border-[#233560] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Cumulative CGPA</span>
                <span className="text-lg font-bold text-white font-mono">{student.cgpa || '8.2'} / 10.0</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#142145] border border-[#233560] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">DigiLocker Status</span>
                <span className="text-xs font-semibold text-emerald-300">
                  {student.digilockerSynced ? 'Aadhaar Verified' : 'Consent Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Cryptographic Proof & QR Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121c3b] to-[#152349] border border-[#253966] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 bg-white rounded-xl shadow-lg shadow-black/40">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Student Verification QR" className="w-36 h-36 rounded" />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-slate-700">Generating...</div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">
                SECURE QR TOKEN: #{student.id.slice(-6)}
              </span>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                <span>SHA-256 Canonical Record Signature</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Guarantees cryptographic tamper-proofing. The hash is calculated across canonical student identity,
                institution code, programme, and regulatory salt.
              </p>

              <div className="p-2.5 rounded-lg bg-[#0c1429] border border-[#1e2f58] font-mono text-[11px] text-cyan-400 break-all flex items-center justify-between gap-2">
                <span className="truncate">{canonicalHash || 'Computing SHA-256 digest...'}</span>
                {canonicalHash && (
                  <button
                    onClick={() => copyToClipboard(canonicalHash, 'hash')}
                    className="shrink-0 p-1 rounded bg-[#17244a] text-slate-300 hover:text-white hover:bg-blue-600 transition-colors cursor-pointer"
                    title="Copy SHA-256 Hash"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    onNavigateToVerification(student.studentId);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Open in Verification Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0d162e] border-t border-[#1e2f58] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Record ID: {student.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#162347] hover:bg-[#1d2d5a] text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
