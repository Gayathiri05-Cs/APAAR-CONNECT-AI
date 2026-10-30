/**
 * APAAR CONNECT AI - Central Student Academic Registry
 * Searchable, filterable, sortable, paginated table with CRUD operations,
 * CSV export, and quick profile inspection.
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { StudentRecord, Institution, AdmissionCategory } from '../types';
import { PROGRAMMES } from '../data/defaultData';
import { exportToCsv } from '../utils/csvParser';
import { formatApaarId } from '../utils/validationEngine';

interface StudentRegistryPageProps {
  students: StudentRecord[];
  institutions: Institution[];
  onAddStudent: () => void;
  onEditStudent: (student: StudentRecord) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudentProfile: (student: StudentRecord) => void;
}

export const StudentRegistryPage: React.FC<StudentRegistryPageProps> = ({
  students,
  institutions,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onSelectStudentProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('ALL');
  const [selectedProgramme, setSelectedProgramme] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof StudentRecord>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Student to delete confirmation
  const [studentToDelete, setStudentToDelete] = useState<StudentRecord | null>(null);

  // Filtered & Sorted Records
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      const clean = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !clean ||
        s.name.toLowerCase().includes(clean) ||
        (s.apaarId && s.apaarId.toLowerCase().includes(clean)) ||
        s.studentId.toLowerCase().includes(clean) ||
        s.institutionName.toLowerCase().includes(clean);

      // Filters
      const matchesInst = selectedInstitution === 'ALL' || s.institutionId === selectedInstitution;
      const matchesProg = selectedProgramme === 'ALL' || s.programmeId === selectedProgramme;
      const matchesStatus = selectedStatus === 'ALL' || s.verificationStatus === selectedStatus;
      const matchesCategory = selectedCategory === 'ALL' || s.admissionCategory === selectedCategory;

      return matchesSearch && matchesInst && matchesProg && matchesStatus && matchesCategory;
    });
  }, [students, searchQuery, selectedInstitution, selectedProgramme, selectedStatus, selectedCategory]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });
  }, [filteredStudents, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedStudents.slice(start, start + itemsPerPage);
  }, [sortedStudents, currentPage]);

  const toggleSort = (field: keyof StudentRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportCsv = () => {
    const rows = sortedStudents.map((s) => ({
      'Student Name': s.name,
      'APAAR ID': s.apaarId || 'NOT_ASSIGNED',
      'Student Roll No': s.studentId,
      'Institution': s.institutionName,
      'Programme': s.programmeName,
      'Academic Year': s.academicYear,
      'Semester': s.semester,
      'Admission Category': s.admissionCategory,
      'Admission Date': s.admissionDate,
      'Verification Status': s.verificationStatus,
      'ABC Credits': s.abcCreditsEarned,
      'CGPA': s.cgpa || 8.0,
    }));
    exportToCsv(`APAAR_Students_Export_${new Date().toISOString().split('T')[0]}`, rows);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" /> FLAGGED
          </span>
        );
      case 'INVALID':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" /> INVALID
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>APAAR Central Student Registry</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/30 text-cyan-300 font-mono">
              {students.length} Records Loaded
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete national repository of student academic credentials with APAAR, roll number, and verification state.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#152349] hover:bg-[#1d2f60] border border-[#233560] text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onAddStudent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="p-4 rounded-xl bg-[#121c3b] border border-[#213564] space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, APAAR ID, roll no..."
              className="w-full bg-[#152244] border border-[#24355a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Institution Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedInstitution}
              onChange={(e) => {
                setSelectedInstitution(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Institutions (8)</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Programme Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedProgramme}
              onChange={(e) => {
                setSelectedProgramme(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Programmes</option>
              {PROGRAMMES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name.split(' ')[1]}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Categories</option>
              <option value="General">General</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
              <option value="Supernumerary-TFW">Supernumerary (TFW)</option>
              <option value="Supernumerary-PMSSS">Supernumerary (PMSSS)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#152244] border border-[#24355a] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="FLAGGED">Flagged for Review</option>
              <option value="INVALID">Invalid APAAR</option>
              <option value="PENDING">Pending Linkage</option>
            </select>
          </div>
        </div>

        {/* Clear filter shortcut if any filter active */}
        {(searchQuery ||
          selectedInstitution !== 'ALL' ||
          selectedProgramme !== 'ALL' ||
          selectedStatus !== 'ALL' ||
          selectedCategory !== 'ALL') && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>
              Showing {filteredStudents.length} of {students.length} filtered students
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedInstitution('ALL');
                setSelectedProgramme('ALL');
                setSelectedStatus('ALL');
                setSelectedCategory('ALL');
                setCurrentPage(1);
              }}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0e172e] text-[11px] uppercase font-bold text-slate-400 tracking-wider border-b border-[#213564]">
              <tr>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('apaarId')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>APAAR ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Institutional Roll</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Programme</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2f58]">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching student records found. Try adjusting your search query or filters.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-[#152349]/50 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <span
                            onClick={() => onSelectStudentProfile(s)}
                            className="font-bold text-white hover:text-cyan-300 cursor-pointer block"
                          >
                            {s.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            DOB: {s.dob} • {s.gender}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium">
                      {s.apaarId ? (
                        <span className="text-cyan-300 font-semibold">{formatApaarId(s.apaarId)}</span>
                      ) : (
                        <span className="text-slate-500 italic">Not Linked</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">{s.studentId}</td>

                    <td className="py-3 px-4">
                      <span className="truncate block max-w-[140px]" title={s.institutionName}>
                        {s.institutionName.split(' ')[0]} {s.institutionName.split(' ')[1] || ''}
                      </span>
                      <span className="text-[10px] text-slate-500">{s.state}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-blue-900/40 text-cyan-300 text-[10px]">
                        {s.programmeName.replace('B.Tech ', '')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] ${
                          s.admissionCategory.startsWith('Supernumerary')
                            ? 'text-purple-300 font-semibold'
                            : 'text-slate-300'
                        }`}
                      >
                        {s.admissionCategory}
                      </span>
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(s.verificationStatus)}</td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectStudentProfile(s)}
                          className="p-1.5 rounded-lg bg-[#18264e] hover:bg-[#203366] text-cyan-300 transition-colors cursor-pointer"
                          title="View Complete Profile & QR"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditStudent(s)}
                          className="p-1.5 rounded-lg bg-[#18264e] hover:bg-[#203366] text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Student Information"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(s)}
                          className="p-1.5 rounded-lg bg-[#18264e] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Demo Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-5 py-3 bg-[#0e172e] border-t border-[#213564] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing{' '}
            <strong className="text-white">
              {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </strong>{' '}
            to{' '}
            <strong className="text-white">
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
            </strong>{' '}
            of <strong className="text-white">{filteredStudents.length}</strong> students
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`p-1.5 rounded-lg border border-[#213564] transition-colors ${
                currentPage <= 1
                  ? 'opacity-40 cursor-not-allowed text-slate-600'
                  : 'text-slate-300 hover:text-white hover:bg-[#152349] cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`p-1.5 rounded-lg border border-[#213564] transition-colors ${
                currentPage >= totalPages
                  ? 'opacity-40 cursor-not-allowed text-slate-600'
                  : 'text-slate-300 hover:text-white hover:bg-[#152349] cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101b35] border border-red-500/40 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Delete Demo Record?</h3>
                <p className="text-xs text-slate-400">This action can be reversed via Reset Baseline.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Are you sure you want to remove <strong>{studentToDelete.name}</strong> (Roll:{' '}
              <span className="font-mono text-cyan-300">{studentToDelete.studentId}</span>) from the central
              academic registry?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#233560]">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 rounded-xl bg-[#162244] hover:bg-[#1e2e5c] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
