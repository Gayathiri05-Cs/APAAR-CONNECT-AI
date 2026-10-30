/**
 * APAAR CONNECT AI - Core Data Types
 * AICTE-aligned Student Academic Identity & Compliance System
 */

export type UserRole = 'aicte_admin' | 'institution_admin' | 'verifier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string; // empty for AICTE admin
  institutionName?: string;
  designation: string;
  avatarUrl?: string;
}

export type AdmissionCategory =
  | 'General'
  | 'OBC-NCL'
  | 'SC'
  | 'ST'
  | 'EWS'
  | 'Supernumerary-TFW'      // Tuition Fee Waiver (up to 5% over approved intake)
  | 'Supernumerary-PMSSS'    // Prime Minister's Special Scholarship Scheme (J&K)
  | 'Supernumerary-KM'       // Kashmiri Migrant
  | 'Supernumerary-Sports';

export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'INVALID';

export interface StudentRecord {
  id: string; // Internal UUID
  apaarId?: string; // 12-digit APAAR/ABC ID (e.g. "4829-1029-4721")
  studentId: string; // Institutional Roll/Enrolment ID
  name: string;
  dob: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  institutionId: string;
  institutionName: string;
  programmeId: string;
  programmeName: string;
  academicYear: string; // e.g. "2024-2025"
  semester: number;
  admissionCategory: AdmissionCategory;
  admissionDate: string;
  email: string;
  phone: string;
  state: string;
  verificationStatus: VerificationStatus;
  digilockerSynced: boolean;
  abcCreditsEarned: number;
  cgpa?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Institution {
  id: string;
  code: string; // e.g. "AICTE-DL-0104"
  name: string;
  shortName: string;
  type: 'Central University' | 'State Autonomous' | 'Deemed Institute' | 'Affiliated College';
  state: string;
  city: string;
  nodalOfficer: string;
  officerEmail: string;
  officerPhone: string;
  nirfRank?: number;
}

export interface ProgrammeIntake {
  id: string;
  institutionId: string;
  programmeId: string;
  programmeName: string;
  academicYear: string;
  approvedIntake: number; // Regulatory ceiling
  supernumeraryCap: number; // Approved supernumerary seats (e.g., TFW + PMSSS)
}

export interface ValidationIssue {
  id: string;
  studentId: string;
  recordRef: string;
  studentName: string;
  institutionName: string;
  severity: 'RED' | 'AMBER' | 'GREEN';
  code:
    | 'MISSING_APAAR'
    | 'INVALID_APAAR_FORMAT'
    | 'DUPLICATE_APAAR_LOCAL'
    | 'DUPLICATE_APAAR_CROSS_INSTITUTION'
    | 'DUPLICATE_STUDENT_ID'
    | 'SUSPICIOUS_IDENTITY_MATCH'
    | 'MISSING_MANDATORY_FIELD';
  description: string;
  recommendation: string;
  timestamp: string;
  status: 'PENDING' | 'RESOLVED' | 'IGNORED';
}

export interface DuplicateCluster {
  id: string;
  confidenceScore: number; // 0 to 100%
  matchType: 'EXACT_APAAR' | 'NAME_DOB_HIGH_PROBABILITY' | 'LOCAL_ID_COLLISION';
  records: StudentRecord[];
  reason: string;
  flaggedDate: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED_REVOKED' | 'FALSE_POSITIVE';
  notes?: string;
  resolutionNote?: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  institutionId?: string;
  institutionName?: string;
  programmeName?: string;
  timestamp: string;
  category: 'INTAKE_EXCESS' | 'DUPLICATE_ENROLMENT' | 'VALIDATION_ERROR' | 'SUBMISSION_PENDING' | 'SECURITY_MISMATCH';
  isRead: boolean;
  isResolved: boolean;
  actionUrl?: string;
  dispatchLog?: {
    emailSent: boolean;
    smsSent: boolean;
    dispatchTime: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  actorEmail: string;
  action: string;
  entityType: 'STUDENT' | 'BATCH_UPLOAD' | 'VALIDATION' | 'DUPLICATE' | 'INTAKE' | 'AUTH' | 'REPORT';
  entityId: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE';
  ipAddress: string;
}

export interface VerificationResult {
  isValid: boolean;
  verificationId: string;
  timestamp: string;
  student: StudentRecord | null;
  canonicalPayload: string;
  computedHash: string;
  storedHash: string;
  hashMatched: boolean;
  isTampered: boolean;
  remarks: string[];
}
