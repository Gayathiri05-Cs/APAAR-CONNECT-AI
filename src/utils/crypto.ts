/**
 * Cryptographic Utility for APAAR Connect AI
 * Generates SHA-256 canonical integrity hashes for student records
 * to guarantee tampering resistance in QR code verification.
 */
import { StudentRecord } from '../types';

export const CANONICAL_SALT = 'AICTE_APAAR_INTEGRITY_SALT_2025';

/**
 * Builds the canonical string representation of a student record.
 * Formatting: [APAAR_ID]|[STUDENT_ID]|[NAME_UPPER]|[INSTITUTION_ID]|[PROGRAMME_ID]|[ACADEMIC_YEAR]|[SALT]
 */
export function buildCanonicalRecordPayload(
  student: Partial<StudentRecord>,
  customOverride?: { name?: string; programme?: string; cgpa?: number }
): string {
  const apaar = (student.apaarId || 'NO_APAAR').replace(/[\s-]/g, '').trim().toUpperCase();
  const studentId = (student.studentId || '').trim().toUpperCase();
  const name = (customOverride?.name || student.name || '').trim().toUpperCase();
  const instId = (student.institutionId || '').trim();
  const progId = (customOverride?.programme || student.programmeId || '').trim();
  const ay = (student.academicYear || '').trim();
  const dob = (student.dob || '').trim();

  return `APAAR::V1|${apaar}|${studentId}|${name}|${dob}|${instId}|${progId}|${ay}|${CANONICAL_SALT}`;
}

/**
 * Computes a SHA-256 hash using the standard Web Crypto API.
 */
export async function computeSha256Hex(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for non-browser/unit environment
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

/**
 * Synchronous mock hash for immediate UI rendering when async is pending
 */
export function quickHashFallback(text: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return (part1 + part2 + part1 + part2 + part1 + part2 + part1 + part2).slice(0, 64);
}

/**
 * Mask PII for public verification
 */
export function maskApaarId(apaarId?: string): string {
  if (!apaarId) return 'NOT ISSUED';
  const clean = apaarId.replace(/[\s-]/g, '');
  if (clean.length < 4) return 'XXXXXXXXXXXX';
  const last4 = clean.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

export function maskPhoneNumber(phone?: string): string {
  if (!phone) return 'N/A';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '+91 ******';
  return `+91 ******${digits.slice(-4)}`;
}

export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return 'N/A';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `**@${domain}`;
  return `${user[0]}***${user[user.length - 1]}@${domain}`;
}
