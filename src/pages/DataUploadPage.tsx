/**
 * APAAR CONNECT AI - Bulk Student Data Upload Module
 * Drag & drop CSV ingestion, column mapping, live preview,
 * pre-submission validation, and instant SIH Test Batch loader.
 */

import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Sparkles,
  FileText,
  RefreshCw,
  Eye,
  Check,
} from 'lucide-react';
import { StudentRecord, Institution } from '../types';
import { parseCsvString, ParsedCsvRow, exportToCsv } from '../utils/csvParser';
import { getSampleCsvTemplate } from '../utils/storage';
import { validateApaarIdFormat } from '../utils/validationEngine';

interface DataUploadPageProps {
  onIngestBatch: (newStudents: Partial<StudentRecord>[]) => void;
  institutions: Institution[];
  onNavigateToValidation: () => void;
}

export const DataUploadPage: React.FC<DataUploadPageProps> = ({
  onIngestBatch,
  institutions,
  onNavigateToValidation,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [csvRawText, setCsvRawText] = useState<string>('');
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    name: 'student_name',
    apaarId: 'apaar_id',
    studentId: 'student_id',
    institution: 'institution',
    programme: 'programme',
    academicYear: 'academic_year',
    admissionCategory: 'admission_category',
    admissionDate: 'admission_date',
    dob: 'dob',
    gender: 'gender',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [summaryReport, setSummaryReport] = useState<{
    totalUploaded: number;
    validCount: number;
    flaggedCount: number;
  } | null>(null);

  // Download official CSV template
  const handleDownloadTemplate = () => {
    const templateContent = getSampleCsvTemplate();
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AICTE_APAAR_Upload_Template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process raw CSV string
  const processCsv = (text: string) => {
    setCsvRawText(text);
    const result = parseCsvString(text);
    setParsedHeaders(result.headers);
    setParsedRows(result.rows);
    setUploadCompleted(false);
    setSummaryReport(null);

    // Auto-map column candidates
    const mapping: Record<string, string> = { ...columnMapping };
    result.headers.forEach((h) => {
      const lower = h.toLowerCase().trim();
      if (lower.includes('name')) mapping.name = h;
      else if (lower.includes('apaar')) mapping.apaarId = h;
      else if (lower.includes('roll') || lower.includes('student_id')) mapping.studentId = h;
      else if (lower.includes('inst')) mapping.institution = h;
      else if (lower.includes('prog')) mapping.programme = h;
      else if (lower.includes('year') || lower.includes('ay')) mapping.academicYear = h;
      else if (lower.includes('cat')) mapping.admissionCategory = h;
      else if (lower.includes('dob') || lower.includes('birth')) mapping.dob = h;
      else if (lower.includes('gender')) mapping.gender = h;
    });
    setColumnMapping(mapping);
  };

  // File drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processCsv(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  // File input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          processCsv(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  // Instant SIH Test Batch Loader
  const handleLoadSihBatch = () => {
    const sihDemoCsv = `student_name,apaar_id,student_id,institution,programme,academic_year,admission_category,admission_date,dob,gender
"Bhavya Swaminathan","8491-0294-8172","DITS-2024-CSE-141","Delhi Institute of Technology & Science","B.Tech Computer Science & Engineering","2024-2025","General","2024-08-16","2005-08-14","Female"
"Rishabh Kulshreshtha","4821-9034-7182","DITS-2024-CSE-142","Delhi Institute of Technology & Science","B.Tech Computer Science & Engineering","2024-2025","General","2024-08-16","2005-03-21","Male"
"Pooja Nandini Roy","","CAEC-2024-ME-045","Chennai Autonomous Engineering College","B.Tech Mechanical Engineering","2024-2025","SC","2024-08-16","2005-02-14","Female"
"Kartik Somnath Verma","1234-5678-ABCD","KERI-2024-ECE-099","Kolkata Engineering & Research Institute","B.Tech Electronics & Communication Engineering","2024-2025","General","2024-08-16","2004-11-20","Male"
"Aditi Namboodiri","9182-3849-1029","MITE-2024-CSE-145","Maharashtra Institute of Technology & Engineering","B.Tech Computer Science & Engineering","2024-2025","Supernumerary-TFW","2024-08-16","2005-06-19","Female"
"Siddharth Hegde","9999-9999-9999","GTA-2024-IT-089","Gujarat Technological Academy","B.Tech Information Technology","2024-2025","OBC-NCL","2024-08-16","2005-09-02","Male"
"Niharika Sen","6301-9284-8201","BCET-2024-AIDS-051","Bangalore College of Engineering & Technology","B.Tech Artificial Intelligence & Data Science","2024-2025","General","2024-08-16","2005-07-22","Female"
"Farhan Akhtar Mir","4820-1928-3019","DITS-2024-CSE-146","Delhi Institute of Technology & Science","B.Tech Computer Science & Engineering","2024-2025","Supernumerary-PMSSS","2024-08-16","2004-10-05","Male"
`;
    processCsv(sihDemoCsv);
  };

  // Submit and ingest into state
  const handleSubmitBatch = () => {
    if (parsedRows.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(15);

    setTimeout(() => {
      setUploadProgress(60);
      setTimeout(() => {
        setUploadProgress(100);

        const newStudents: Partial<StudentRecord>[] = parsedRows.map((r, idx) => {
          const rawName = r[columnMapping.name] || `Student ${idx + 1}`;
          const rawApaar = r[columnMapping.apaarId] || '';
          const rawRoll = r[columnMapping.studentId] || `ROLL-${Date.now()}-${idx}`;
          const rawInst = r[columnMapping.institution] || 'Delhi Institute of Technology & Science';
          const rawProg = r[columnMapping.programme] || 'B.Tech Computer Science & Engineering';
          const rawCat = r[columnMapping.admissionCategory] || 'General';
          const rawAy = r[columnMapping.academicYear] || '2024-2025';
          const rawDob = r[columnMapping.dob] || '2005-06-15';
          const rawGender = (r[columnMapping.gender] as any) || 'Male';

          const instObj = institutions.find((i) => i.name.toLowerCase().includes(rawInst.toLowerCase())) || institutions[0];

          // Initial verification state based on APAAR format
          let status: any = 'VERIFIED';
          if (!rawApaar) status = 'PENDING';
          else {
            const check = validateApaarIdFormat(rawApaar);
            if (!check.isValid) status = 'INVALID';
          }

          return {
            id: `STU-UP-${Date.now()}-${idx}`,
            name: rawName,
            apaarId: rawApaar || undefined,
            studentId: rawRoll,
            institutionId: instObj.id,
            institutionName: instObj.name,
            programmeId: 'PROG-CSE',
            programmeName: rawProg,
            academicYear: rawAy,
            semester: 1,
            admissionCategory: rawCat as any,
            admissionDate: '2024-08-16',
            dob: rawDob,
            gender: rawGender,
            verificationStatus: status,
            digilockerSynced: status === 'VERIFIED',
            abcCreditsEarned: 20,
            cgpa: 8.0,
            state: instObj.state,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

        onIngestBatch(newStudents);
        setIsProcessing(false);
        setUploadCompleted(true);
        setSummaryReport({
          totalUploaded: newStudents.length,
          validCount: newStudents.filter((s) => s.verificationStatus === 'VERIFIED').length,
          flaggedCount: newStudents.filter((s) => s.verificationStatus !== 'VERIFIED').length,
        });
      }, 500);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#121c3b] border border-[#213564] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
              <span>Institutional Student Data Ingestion</span>
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-600/30 text-cyan-300 font-medium">
              CSV / Excel Batch Processor
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload institutional student cohorts for automated APAAR verification, duplicate detection,
            and intake monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#152349] hover:bg-[#1d2f60] border border-[#233560] text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download CSV Template</span>
          </button>

          <button
            onClick={handleLoadSihBatch}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Load SIH Test Batch</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center relative ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/20 shadow-2xl'
            : 'border-[#233560] bg-[#101b35] hover:border-cyan-500/50'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-[#152244] border border-[#24355a] flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-blue-500/10">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="font-bold text-base text-white mb-1">
          Drag & Drop Admissions CSV File Here
        </h3>
        <p className="text-xs text-slate-400 max-w-md mb-4">
          Supported files: UTF-8 formatted CSV or plain text with standard comma delimiters.
        </p>

        <label className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Browse Files from Computer</span>
          <input type="file" accept=".csv,.txt" onChange={handleFileInput} className="hidden" />
        </label>
      </div>

      {/* Pre-Submission Preview & Column Mapping */}
      {parsedRows.length > 0 && (
        <div className="space-y-4 animate-in fade-in zoom-in-95">
          {/* Summary bar */}
          <div className="p-4 rounded-xl bg-[#131f42] border border-[#213564] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Batch Preview: {parsedRows.length} Student Rows Detected
                </h4>
                <p className="text-xs text-slate-400">
                  Verify column mapping and check preview before committing to central registry.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setParsedRows([]);
                  setCsvRawText('');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#162244] hover:bg-[#1d2d5a] text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={handleSubmitBatch}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Ingestion ({uploadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <span>Commit & Validate {parsedRows.length} Records</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table Preview */}
          <div className="rounded-xl bg-[#121c3b] border border-[#213564] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#0e172e] border-b border-[#213564] text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Parsed Dataset Preview (First 8 Rows)</span>
              <span className="text-cyan-400 font-mono">Total {parsedRows.length} records ready</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#101b35] text-[11px] text-slate-400 border-b border-[#1e2f58]">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">APAAR ID</th>
                    <th className="py-2.5 px-3">Roll / ID</th>
                    <th className="py-2.5 px-3">Institution</th>
                    <th className="py-2.5 px-3">Programme</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Pre-Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2f58]">
                  {parsedRows.slice(0, 8).map((row, idx) => {
                    const name = row[columnMapping.name] || 'Unknown';
                    const apaar = row[columnMapping.apaarId] || '';
                    const roll = row[columnMapping.studentId] || `STU-${idx}`;
                    const inst = row[columnMapping.institution] || 'AICTE Inst';
                    const prog = row[columnMapping.programme] || 'B.Tech';
                    const cat = row[columnMapping.admissionCategory] || 'General';

                    // Quick pre-check
                    let statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
                    let statusText = 'Format Valid';
                    if (!apaar) {
                      statusIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
                      statusText = 'Missing APAAR';
                    } else if (!validateApaarIdFormat(apaar).isValid) {
                      statusIcon = <XCircle className="w-3.5 h-3.5 text-red-400" />;
                      statusText = 'Invalid Format';
                    }

                    return (
                      <tr key={idx} className="hover:bg-[#152349]/50">
                        <td className="py-2.5 px-3 font-semibold text-white">{name}</td>
                        <td className="py-2.5 px-3 font-mono text-cyan-300">{apaar || '—'}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-300">{roll}</td>
                        <td className="py-2.5 px-3 truncate max-w-[150px]">{inst}</td>
                        <td className="py-2.5 px-3 truncate max-w-[150px]">{prog}</td>
                        <td className="py-2.5 px-3">{cat}</td>
                        <td className="py-2.5 px-3">
                          <span className="flex items-center gap-1 text-[11px]">
                            {statusIcon}
                            <span className="text-slate-300">{statusText}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Ingestion Completion Dialog / Summary */}
      {uploadCompleted && summaryReport && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#102436] to-cyan-950/30 border border-emerald-500/40 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Check className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  Batch Successfully Ingested into Central Registry!
                </h3>
                <p className="text-xs text-slate-300">
                  {summaryReport.totalUploaded} records processed and mapped to AICTE National Database.
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToValidation}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/30"
            >
              <span>View in Validation Centre</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#0e172e] border border-[#1e2f58]">
              <span className="text-slate-400 text-[11px] block">Total Ingested</span>
              <span className="text-xl font-bold text-white font-mono">{summaryReport.totalUploaded}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e172e] border border-emerald-500/30">
              <span className="text-emerald-400 text-[11px] block">Valid & Synced</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">{summaryReport.validCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e172e] border border-amber-500/30">
              <span className="text-amber-400 text-[11px] block">Flagged for Review</span>
              <span className="text-xl font-bold text-amber-400 font-mono">{summaryReport.flaggedCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
