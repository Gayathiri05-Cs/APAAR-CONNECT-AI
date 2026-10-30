/**
 * Intelligent APAAR Validation & Duplicate Detection Engine
 * Aligned with AICTE Guidelines & National Academic Depository Standards
 */

import { StudentRecord, ValidationIssue, DuplicateCluster } from '../types';

/**
 * Checks if a string is a valid 12-digit APAAR/ABC ID.
 * Returns { isValid: boolean, error?: string }
 */
export function validateApaarIdFormat(rawApaar?: string): { isValid: boolean; reason?: string } {
  if (!rawApaar || rawApaar.trim() === '') {
    return { isValid: false, reason: 'APAAR ID is missing.' };
  }

  const clean = rawApaar.replace(/[\s-]/g, '');

  if (!/^\d+$/.test(clean)) {
    return { isValid: false, reason: 'APAAR ID must contain only digits (found non-numeric characters).' };
  }

  if (clean.length !== 12) {
    return { isValid: false, reason: `APAAR ID must be exactly 12 digits (found ${clean.length} digits).` };
  }

  // Reject all identical digits e.g. 000000000000, 999999999999
  if (/^(\d)\1{11}$/.test(clean)) {
    return { isValid: false, reason: 'APAAR ID cannot consist of 12 repeating identical digits.' };
  }

  // Reject trivial dummy sequences
  if (clean === '123456789012' || clean === '012345678901' || clean === '987654321098') {
    return { isValid: false, reason: 'APAAR ID matches known dummy placeholder sequence.' };
  }

  return { isValid: true };
}

/**
 * Formats 12 digits into standard XXXX-XXXX-XXXX format
 */
export function formatApaarId(raw?: string): string {
  if (!raw) return 'NOT ISSUED';
  const clean = raw.replace(/[\s-]/g, '');
  if (clean.length !== 12) return raw;
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}`;
}

/**
 * Calculates Jaro-Winkler-like string similarity between two names
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = str1.trim().toLowerCase().replace(/[^a-z]/g, '');
  const s2 = str2.trim().toLowerCase().replace(/[^a-z]/g, '');

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  let matches = 0;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }

  return matches / longer.length;
}

/**
 * Runs complete validation across a set of student records
 */
export function runValidationEngine(records: StudentRecord[]): {
  issues: ValidationIssue[];
  duplicateClusters: DuplicateCluster[];
  summary: {
    totalRecords: number;
    validCount: number;
    amberCount: number;
    redCount: number;
    duplicateCount: number;
    complianceScore: number;
  };
} {
  const issues: ValidationIssue[] = [];
  const duplicateClusters: DuplicateCluster[] = [];

  // Group maps for duplicate detection
  const apaarMap = new Map<string, StudentRecord[]>();
  const institutionalIdMap = new Map<string, StudentRecord[]>(); // key: instId + "_" + studentId

  for (const record of records) {
    let hasRed = false;
    let hasAmber = false;

    // 1. Mandatory fields
    if (!record.name || record.name.trim().length < 2) {
      issues.push({
        id: `ISSUE-${record.id}-NAME`,
        studentId: record.studentId,
        recordRef: record.id,
        studentName: record.name || 'Unknown',
        institutionName: record.institutionName,
        severity: 'RED',
        code: 'MISSING_MANDATORY_FIELD',
        description: 'Mandatory field "Student Name" is missing or too short.',
        recommendation: 'Update student record with full legal name as per secondary school certificate.',
        timestamp: new Date().toISOString(),
        status: 'PENDING',
      });
      hasRed = true;
    }

    if (!record.studentId || record.studentId.trim() === '') {
      issues.push({
        id: `ISSUE-${record.id}-ID`,
        studentId: record.studentId,
        recordRef: record.id,
        studentName: record.name,
        institutionName: record.institutionName,
        severity: 'RED',
        code: 'MISSING_MANDATORY_FIELD',
        description: 'Institutional Roll/Registration number is missing.',
        recommendation: 'Provide valid institution student ID number.',
        timestamp: new Date().toISOString(),
        status: 'PENDING',
      });
      hasRed = true;
    }

    // 2. APAAR format check
    if (!record.apaarId || record.apaarId.trim() === '') {
      issues.push({
        id: `ISSUE-${record.id}-NO-APAAR`,
        studentId: record.studentId,
        recordRef: record.id,
        studentName: record.name,
        institutionName: record.institutionName,
        severity: 'AMBER',
        code: 'MISSING_APAAR',
        description: 'APAAR ID not registered for enrolled student.',
        recommendation: 'Initiate APAAR ID generation on ABC portal via Aadhaar DigiLocker consent.',
        timestamp: new Date().toISOString(),
        status: 'PENDING',
      });
      hasAmber = true;
    } else {
      const formatResult = validateApaarIdFormat(record.apaarId);
      if (!formatResult.isValid) {
        issues.push({
          id: `ISSUE-${record.id}-INV-APAAR`,
          studentId: record.studentId,
          recordRef: record.id,
          studentName: record.name,
          institutionName: record.institutionName,
          severity: 'RED',
          code: 'INVALID_APAAR_FORMAT',
          description: `Invalid APAAR format: ${formatResult.reason}`,
          recommendation: 'Verify 12-digit APAAR card generated from Academic Bank of Credits (ABC).',
          timestamp: new Date().toISOString(),
          status: 'PENDING',
        });
        hasRed = true;
      } else {
        // Collect for duplicate check
        const cleanApaar = record.apaarId.replace(/[\s-]/g, '');
        if (!apaarMap.has(cleanApaar)) {
          apaarMap.set(cleanApaar, []);
        }
        apaarMap.get(cleanApaar)!.push(record);
      }
    }

    // Collect institutional ID collision check
    if (record.institutionId && record.studentId) {
      const key = `${record.institutionId}_${record.studentId.trim().toUpperCase()}`;
      if (!institutionalIdMap.has(key)) {
        institutionalIdMap.set(key, []);
      }
      institutionalIdMap.get(key)!.push(record);
    }
  }

  // 3. Duplicate APAAR analysis (Local & Cross-Institution)
  for (const [cleanApaar, recList] of apaarMap.entries()) {
    if (recList.length > 1) {
      const distinctInstitutions = new Set(recList.map((r) => r.institutionId));
      const isCrossInstitution = distinctInstitutions.size > 1;

      for (const rec of recList) {
        issues.push({
          id: `ISSUE-${rec.id}-DUP-APAAR`,
          studentId: rec.studentId,
          recordRef: rec.id,
          studentName: rec.name,
          institutionName: rec.institutionName,
          severity: 'RED',
          code: isCrossInstitution ? 'DUPLICATE_APAAR_CROSS_INSTITUTION' : 'DUPLICATE_APAAR_LOCAL',
          description: isCrossInstitution
            ? `Critical: Same APAAR ID (${formatApaarId(cleanApaar)}) enrolled across ${recList.length} distinct institutions in academic year ${rec.academicYear}.`
            : `Duplicate APAAR ID (${formatApaarId(cleanApaar)}) declared for multiple students within ${rec.institutionName}.`,
          recommendation: isCrossInstitution
            ? 'Issue AICTE Nodal Notice for dual enrolment verification and seat seat surrender.'
            : 'Check admission clerk records for incorrect APAAR allocation or identity collision.',
          timestamp: new Date().toISOString(),
          status: 'PENDING',
        });
      }

      duplicateClusters.push({
        id: `CLUSTER-APAAR-${cleanApaar.slice(-6)}`,
        confidenceScore: 100,
        matchType: 'EXACT_APAAR',
        records: recList,
        reason: isCrossInstitution
          ? `Exact APAAR match (${formatApaarId(cleanApaar)}) detected across multiple AICTE institutions.`
          : `Exact APAAR match (${formatApaarId(cleanApaar)}) duplicated within ${recList[0].institutionName}.`,
        flaggedDate: new Date().toISOString().split('T')[0],
        status: 'OPEN',
      });
    }
  }

  // 4. Institutional Roll Number collisions
  for (const [key, recList] of institutionalIdMap.entries()) {
    if (recList.length > 1) {
      for (const rec of recList) {
        issues.push({
          id: `ISSUE-${rec.id}-DUP-ROLL`,
          studentId: rec.studentId,
          recordRef: rec.id,
          studentName: rec.name,
          institutionName: rec.institutionName,
          severity: 'RED',
          code: 'DUPLICATE_STUDENT_ID',
          description: `Duplicate institutional roll number '${rec.studentId}' assigned to ${recList.length} students.`,
          recommendation: 'Re-assign unique institutional registration numbers before final AICTE approval.',
          timestamp: new Date().toISOString(),
          status: 'PENDING',
        });
      }
    }
  }

  // 5. Multi-factor duplicate matching (Same Name + Same DOB across institutions)
  for (let i = 0; i < records.length; i++) {
    for (let j = i + 1; j < records.length; j++) {
      const r1 = records[i];
      const r2 = records[j];

      // Skip if already in exact APAAR cluster
      const clean1 = (r1.apaarId || '').replace(/[\s-]/g, '');
      const clean2 = (r2.apaarId || '').replace(/[\s-]/g, '');
      if (clean1 && clean2 && clean1 === clean2) continue;

      // Check name similarity + same DOB
      if (r1.dob && r2.dob && r1.dob === r2.dob) {
        const nameSim = calculateStringSimilarity(r1.name, r2.name);
        if (nameSim >= 0.85) {
          const confidence = Math.round(nameSim * 95);
          issues.push({
            id: `ISSUE-FUZZY-${r1.id}-${r2.id}`,
            studentId: `${r1.studentId} & ${r2.studentId}`,
            recordRef: r1.id,
            studentName: `${r1.name} / ${r2.name}`,
            institutionName: `${r1.institutionName} & ${r2.institutionName}`,
            severity: 'AMBER',
            code: 'SUSPICIOUS_IDENTITY_MATCH',
            description: `High identity match (${confidence}%): Same DOB (${r1.dob}) & matching name across ${r1.institutionName} and ${r2.institutionName}.`,
            recommendation: 'Requires AICTE Nodal Officer verification to ensure student is not concurrently enrolled without APAAR linkage.',
            timestamp: new Date().toISOString(),
            status: 'PENDING',
          });

          duplicateClusters.push({
            id: `CLUSTER-SUSP-${r1.id.slice(0, 4)}-${r2.id.slice(0, 4)}`,
            confidenceScore: confidence,
            matchType: 'NAME_DOB_HIGH_PROBABILITY',
            records: [r1, r2],
            reason: `Probable identity overlap: Identical Date of Birth (${r1.dob}) and ${Math.round(nameSim * 100)}% name match between "${r1.name}" (${r1.institutionName}) and "${r2.name}" (${r2.institutionName}).`,
            flaggedDate: new Date().toISOString().split('T')[0],
            status: 'OPEN',
          });
        }
      }
    }
  }

  // Calculate high-level summary
  const redIssueRecordIds = new Set(issues.filter((i) => i.severity === 'RED').map((i) => i.recordRef));
  const amberIssueRecordIds = new Set(issues.filter((i) => i.severity === 'AMBER').map((i) => i.recordRef));

  let redCount = 0;
  let amberCount = 0;
  let validCount = 0;

  for (const r of records) {
    if (redIssueRecordIds.has(r.id)) {
      redCount++;
    } else if (amberIssueRecordIds.has(r.id)) {
      amberCount++;
    } else {
      validCount++;
    }
  }

  const complianceScore = records.length > 0 ? Math.round((validCount / records.length) * 100) : 100;

  return {
    issues,
    duplicateClusters,
    summary: {
      totalRecords: records.length,
      validCount,
      amberCount,
      redCount,
      duplicateCount: duplicateClusters.length,
      complianceScore,
    },
  };
}
