/**
 * APAAR CONNECT AI - Add / Edit Student Record Modal
 * Validates 12-digit APAAR format on the fly and prevents common entry mistakes.
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { StudentRecord, Institution, AdmissionCategory } from '../types';
import { validateApaarIdFormat } from '../utils/validationEngine';
import { PROGRAMMES } from '../data/defaultData';

interface AddEditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Partial<StudentRecord>) => void;
  initialData?: StudentRecord | null;
  institutions: Institution[];
}

export const AddEditStudentModal: React.FC<AddEditStudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  institutions,
}) => {
  const [name, setName] = useState('');
  const [apaarId, setApaarId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dob, setDob] = useState('2005-06-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [institutionId, setInstitutionId] = useState('');
  const [programmeId, setProgrammeId] = useState('PROG-CSE');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [semester, setSemester] = useState(3);
  const [admissionCategory, setAdmissionCategory] = useState<AdmissionCategory>('General');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 9876543210');
  const [apaarError, setApaarError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setApaarId(initialData.apaarId || '');
      setStudentId(initialData.studentId);
      setDob(initialData.dob || '2005-06-15');
      setGender(initialData.gender);
      setInstitutionId(initialData.institutionId);
      setProgrammeId(initialData.programmeId);
      setAcademicYear(initialData.academicYear);
      setSemester(initialData.semester || 1);
      setAdmissionCategory(initialData.admissionCategory);
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
    } else {
      setName('');
      setApaarId('');
      setStudentId(`DITS-2024-CSE-${Math.floor(100 + Math.random() * 899)}`);
      setDob('2005-05-20');
      setGender('Male');
      setInstitutionId(institutions[0]?.id || 'INST-01');
      setProgrammeId('PROG-CSE');
      setAcademicYear('2024-2025');
      setSemester(3);
      setAdmissionCategory('General');
      setEmail('');
      setPhone('+91 98112 00000');
    }
  }, [initialData, institutions, isOpen]);

  // Live validation on APAAR
  const handleApaarChange = (val: string) => {
    setApaarId(val);
    if (!val.trim()) {
      setApaarError(null);
      return;
    }
    const check = validateApaarIdFormat(val);
    if (!check.isValid) {
      setApaarError(check.reason || 'Invalid APAAR format');
    } else {
      setApaarError(null);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedInst = institutions.find((i) => i.id === institutionId) || institutions[0];
    const selectedProg = PROGRAMMES.find((p) => p.id === programmeId) || PROGRAMMES[0];

    const studentData: Partial<StudentRecord> = {
      ...(initialData || {}),
      name: name.trim(),
      apaarId: apaarId.trim() || undefined,
      studentId: studentId.trim(),
      dob,
      gender,
      institutionId: selectedInst.id,
      institutionName: selectedInst.name,
      programmeId: selectedProg.id,
      programmeName: selectedProg.name,
      academicYear,
      semester: Number(semester),
      admissionCategory,
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, '.')}@${selectedInst.code.toLowerCase()}.ac.in`,
      phone,
      state: selectedInst.state,
      verificationStatus: apaarId && !apaarError ? 'VERIFIED' : 'PENDING',
      updatedAt: new Date().toISOString(),
    };

    onSave(studentData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101b35] border border-[#233560] rounded-2xl max-w-2xl w-full text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#17254e] via-[#1b2b5a] to-[#201d4a] px-6 py-4 border-b border-[#24355a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-cyan-400/30 text-cyan-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {initialData ? 'Edit Student Record' : 'Register New Student'}
              </h3>
              <p className="text-xs text-slate-400">
                National Academic Registry Enrolment Form
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Student Name */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Full Name (as per Certificate) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Institutional Roll Number */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Institutional Roll / Student ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. DITS-2024-CSE-045"
                className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* APAAR ID */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">
                  APAAR ID (12-Digit Academic Account Number)
                </label>
                <span className="text-[10px] text-slate-400">Optional at intake; mandatory for degree</span>
              </div>
              <input
                type="text"
                value={apaarId}
                onChange={(e) => handleApaarChange(e.target.value)}
                placeholder="e.g. 4821-9034-7182"
                className={`w-full bg-[#152244] border rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none ${
                  apaarError
                    ? 'border-red-500/80 focus:border-red-400'
                    : apaarId
                    ? 'border-emerald-500/60 focus:border-emerald-400'
                    : 'border-[#24355a] focus:border-cyan-400'
                }`}
              />
              {apaarError ? (
                <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {apaarError}
                </p>
              ) : apaarId ? (
                <p className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Valid 12-digit format verified
                </p>
              ) : null}
            </div>

            {/* Institution */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Institution</label>
              <select
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                {institutions.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.shortName} ({i.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Programme */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Programme</label>
              <select
                value={programmeId}
                onChange={(e) => setProgrammeId(e.target.value)}
                className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                {PROGRAMMES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Admission Category */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Admission Category</label>
              <select
                value={admissionCategory}
                onChange={(e) => setAdmissionCategory(e.target.value as AdmissionCategory)}
                className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="General">General (Merit)</option>
                <option value="OBC-NCL">OBC-NCL</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
                <option value="Supernumerary-TFW">Supernumerary: Tuition Fee Waiver (TFW 5%)</option>
                <option value="Supernumerary-PMSSS">Supernumerary: PMSSS (J&K Special)</option>
                <option value="Supernumerary-Sports">Supernumerary: Sports / Cultural</option>
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="2024-2025">2024-2025 (Active)</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2025-2026">2025-2026 (Upcoming)</option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#233560] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#162244] hover:bg-[#1d2d58] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {initialData ? 'Update Record' : 'Save Student Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
