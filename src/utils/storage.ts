/**
 * APAAR CONNECT AI - Local Persistence & State Manager
 * Ensures robust persistence across browser reloads while offering 1-click Demo Reset.
 */

import {
  StudentRecord,
  Institution,
  ProgrammeIntake,
  AlertNotification,
  AuditLogEntry,
  User,
  ValidationIssue,
  DuplicateCluster,
} from '../types';
import {
  DEMO_USERS,
  INSTITUTIONS,
  INITIAL_INTAKE_CONFIG,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  generateInitialStudents,
} from '../data/defaultData';
import { runValidationEngine } from './validationEngine';

const STORAGE_KEYS = {
  CURRENT_USER: 'apaar_current_user_v1',
  STUDENTS: 'apaar_students_data_v1',
  INSTITUTIONS: 'apaar_institutions_data_v1',
  INTAKES: 'apaar_intakes_data_v1',
  NOTIFICATIONS: 'apaar_notifications_data_v1',
  AUDIT_LOGS: 'apaar_audit_logs_data_v1',
  RESOLVED_DUPLICATES: 'apaar_resolved_duplicates_v1',
  ACADEMIC_YEAR: 'apaar_selected_ay_v1',
};

export function getCurrentUser(): User {
  if (typeof window === 'undefined') return DEMO_USERS[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse current user from storage:', e);
  }
  return DEMO_USERS[0]; // Default to AICTE Admin
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  addAuditLog({
    actorName: user.name,
    actorRole: user.role,
    actorEmail: user.email,
    action: 'USER_SESSION_SWITCHED',
    entityType: 'AUTH',
    entityId: user.id,
    details: `Active role changed to ${user.role.toUpperCase()} (${user.designation}).`,
    status: 'SUCCESS',
    ipAddress: '127.0.0.1 (Demo Session)',
  });
}

export function getStudents(): StudentRecord[] {
  if (typeof window === 'undefined') return generateInitialStudents();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse students from storage:', e);
  }
  const initial = generateInitialStudents();
  saveStudents(initial);
  return initial;
}

export function saveStudents(students: StudentRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function getInstitutions(): Institution[] {
  if (typeof window === 'undefined') return INSTITUTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse institutions:', e);
  }
  saveInstitutions(INSTITUTIONS);
  return INSTITUTIONS;
}

export function saveInstitutions(institutions: Institution[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(institutions));
}

export function getIntakeConfigs(): ProgrammeIntake[] {
  if (typeof window === 'undefined') return INITIAL_INTAKE_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTAKES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse intake configs:', e);
  }
  saveIntakeConfigs(INITIAL_INTAKE_CONFIG);
  return INITIAL_INTAKE_CONFIG;
}

export function saveIntakeConfigs(intakes: ProgrammeIntake[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.INTAKES, JSON.stringify(intakes));
}

export function getNotifications(): AlertNotification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse notifications:', e);
  }
  saveNotifications(INITIAL_NOTIFICATIONS);
  return INITIAL_NOTIFICATIONS;
}

export function saveNotifications(notifs: AlertNotification[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse audit logs:', e);
  }
  saveAuditLogs(INITIAL_AUDIT_LOGS);
  return INITIAL_AUDIT_LOGS;
}

export function saveAuditLogs(logs: AuditLogEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
}

export function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  const currentLogs = getAuditLogs();
  const newEntry: AuditLogEntry = {
    id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  const updated = [newEntry, ...currentLogs.slice(0, 99)]; // Keep latest 100
  saveAuditLogs(updated);
}

/**
 * Resets all demo data to pristine initial condition for SIH demonstration
 */
export function resetDemoData(): void {
  if (typeof window === 'undefined') return;
  const initialStudents = generateInitialStudents();
  saveStudents(initialStudents);
  saveInstitutions(INSTITUTIONS);
  saveIntakeConfigs(INITIAL_INTAKE_CONFIG);
  saveNotifications(INITIAL_NOTIFICATIONS);
  saveAuditLogs(INITIAL_AUDIT_LOGS);
  localStorage.removeItem(STORAGE_KEYS.RESOLVED_DUPLICATES);

  const user = getCurrentUser();
  addAuditLog({
    actorName: user.name,
    actorRole: user.role,
    actorEmail: user.email,
    action: 'DEMO_DATA_RESET_TO_BASELINE',
    entityType: 'STUDENT',
    entityId: 'ALL_COLLECTIONS',
    details: 'System restored to pristine Smart India Hackathon (SIH) demonstration baseline.',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1 (Local Reset)',
  });
}

/**
 * Generates sample CSV text for users to download
 */
export function getSampleCsvTemplate(): string {
  return `student_name,apaar_id,student_id,institution,programme,academic_year,admission_category,admission_date,dob,gender
"Aditi Ramesh Rao","7182-9012-3841","DITS-2024-CSE-130","Delhi Institute of Technology & Science","B.Tech Computer Science & Engineering","2024-2025","General","2024-08-16","2005-04-18","Female"
"Manish Suresh Gupta","","DITS-2024-CSE-131","Delhi Institute of Technology & Science","B.Tech Computer Science & Engineering","2024-2025","OBC-NCL","2024-08-16","2004-11-25","Male"
"Pooja Vinod Nair","4821-9034-7182","DITS-2024-CSE-132","Delhi Institute of Technology & Science","B.Tech Computer Science & Engineering","2024-2025","General","2024-08-16","2005-03-21","Female"
"Kunal Pradeep Shah","9999-9999-9999","DITS-2024-CSE-133","Delhi Institute of Technology & Science","B.Tech Computer Science & Engineering","2024-2025","EWS","2024-08-16","2005-07-09","Male"
"Tarun Balasubramanian","8302-1940-2819","DITS-2024-CSE-134","Delhi Institute of Technology & Science","B.Tech Computer Science & Engineering","2024-2025","Supernumerary-TFW","2024-08-16","2005-09-14","Male"
`;
}
