/**
 * APAAR CONNECT AI
 * One Student. One Trusted Academic Identity. One Connected Ecosystem.
 *
 * Full-stack AICTE-aligned prototype for Smart India Hackathon (SIH)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { AddEditStudentModal } from './components/AddEditStudentModal';
import { AiInsightsModal } from './components/AiInsightsModal';

import { LoginPage } from './pages/LoginPage';
import { OverviewDashboard } from './pages/OverviewDashboard';
import { StudentRegistryPage } from './pages/StudentRegistryPage';
import { DataUploadPage } from './pages/DataUploadPage';
import { ValidationCentrePage } from './pages/ValidationCentrePage';
import { DuplicateDetectionPage } from './pages/DuplicateDetectionPage';
import { IntakeMonitoringPage } from './pages/IntakeMonitoringPage';
import { VerificationPortalPage } from './pages/VerificationPortalPage';
import { AnalyticsReportsPage } from './pages/AnalyticsReportsPage';
import { AlertsCentrePage } from './pages/AlertsCentrePage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { SettingsPage } from './pages/SettingsPage';

import {
  StudentRecord,
  Institution,
  ProgrammeIntake,
  AlertNotification,
  AuditLogEntry,
  User,
  ValidationIssue,
  DuplicateCluster,
} from './types';
import {
  getCurrentUser,
  setCurrentUser as saveCurrentUser,
  getStudents,
  saveStudents,
  getInstitutions,
  getIntakeConfigs,
  getNotifications,
  saveNotifications,
  getAuditLogs,
  addAuditLog,
  resetDemoData,
} from './utils/storage';
import { runValidationEngine } from './utils/validationEngine';

export default function App() {
  // Session & Authentication
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [activePage, setActivePage] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core Data
  const [students, setStudents] = useState<StudentRecord[]>(() => getStudents());
  const [institutions] = useState<Institution[]>(() => getInstitutions());
  const [intakes] = useState<ProgrammeIntake[]>(() => getIntakeConfigs());
  const [notifications, setNotifications] = useState<AlertNotification[]>(() => getNotifications());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => getAuditLogs());

  // Interactive Modals
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAiInsightsOpen, setIsAiInsightsOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentRecord | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null);
  const [verificationSearchId, setVerificationSearchId] = useState<string | undefined>(undefined);

  // Dynamic Validation Engine Execution
  const validationResult = useMemo(() => {
    return runValidationEngine(students);
  }, [students]);

  const [resolvedIssueIds, setResolvedIssueIds] = useState<Set<string>>(new Set());
  const [resolvedClusterIds, setResolvedClusterIds] = useState<Set<string>>(new Set());

  // Active issues considering resolved overrides
  const activeIssues = useMemo(() => {
    return validationResult.issues.map((i) => ({
      ...i,
      status: resolvedIssueIds.has(i.id) ? ('RESOLVED' as const) : i.status,
    }));
  }, [validationResult.issues, resolvedIssueIds]);

  const activeClusters = useMemo(() => {
    return validationResult.duplicateClusters.map((c) => ({
      ...c,
      status: resolvedClusterIds.has(c.id) ? ('RESOLVED_REVOKED' as const) : c.status,
    }));
  }, [validationResult.duplicateClusters, resolvedClusterIds]);

  // Intake breach check
  const hasIntakeBreach = useMemo(() => {
    return intakes.some((intake) => {
      const regularEnrolled = students.filter(
        (s) =>
          s.institutionId === intake.institutionId &&
          s.programmeId === intake.programmeId &&
          !s.admissionCategory.startsWith('Supernumerary')
      ).length;
      return regularEnrolled > intake.approvedIntake;
    });
  }, [intakes, students]);

  // Unread Alert Count
  const unreadAlertCount = notifications.filter((n) => !n.isRead).length;

  // Sync state helpers
  const handleStudentsChange = (updated: StudentRecord[]) => {
    setStudents(updated);
    saveStudents(updated);
  };

  const handleNotificationsChange = (updated: AlertNotification[]) => {
    setNotifications(updated);
    saveNotifications(updated);
  };

  // User Actions
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    setActivePage('overview');
  };

  const handleSwitchRole = (user: User) => {
    setCurrentUser(user);
    saveCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleResetData = () => {
    resetDemoData();
    const freshStudents = getStudents();
    setStudents(freshStudents);
    setNotifications(getNotifications());
    setAuditLogs(getAuditLogs());
    setResolvedIssueIds(new Set());
    setResolvedClusterIds(new Set());
    setActivePage('overview');
  };

  // Student CRUD
  const handleSaveStudent = (data: Partial<StudentRecord>) => {
    if (data.id && students.some((s) => s.id === data.id)) {
      // Edit
      const updated = students.map((s) => (s.id === data.id ? ({ ...s, ...data } as StudentRecord) : s));
      handleStudentsChange(updated);
      addAuditLog({
        actorName: currentUser?.name || 'Administrator',
        actorRole: currentUser?.role || 'aicte_admin',
        actorEmail: currentUser?.email || 'admin@apaarconnect.ai',
        action: 'STUDENT_RECORD_MODIFIED',
        entityType: 'STUDENT',
        entityId: data.id,
        details: `Updated details for student ${data.name} (Roll: ${data.studentId}).`,
        status: 'SUCCESS',
        ipAddress: '127.0.0.1 (UI Action)',
      });
      setAuditLogs(getAuditLogs());
    } else {
      // Add
      const newStudent: StudentRecord = {
        id: `STU-2025-${Date.now().toString().slice(-4)}`,
        name: data.name || 'New Student',
        apaarId: data.apaarId,
        studentId: data.studentId || `ROLL-${Date.now()}`,
        institutionId: data.institutionId || institutions[0].id,
        institutionName: data.institutionName || institutions[0].name,
        programmeId: data.programmeId || 'PROG-CSE',
        programmeName: data.programmeName || 'B.Tech Computer Science & Engineering',
        academicYear: data.academicYear || '2024-2025',
        semester: data.semester || 1,
        admissionCategory: data.admissionCategory || 'General',
        admissionDate: data.admissionDate || new Date().toISOString().split('T')[0],
        dob: data.dob || '2005-01-01',
        gender: data.gender || 'Male',
        email: data.email || 'student@domain.ac.in',
        phone: data.phone || '+91 98000 00000',
        state: data.state || 'National',
        verificationStatus: data.verificationStatus || 'PENDING',
        digilockerSynced: data.verificationStatus === 'VERIFIED',
        abcCreditsEarned: 24,
        cgpa: 8.2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newStudent, ...students];
      handleStudentsChange(updated);
      addAuditLog({
        actorName: currentUser?.name || 'Administrator',
        actorRole: currentUser?.role || 'aicte_admin',
        actorEmail: currentUser?.email || 'admin@apaarconnect.ai',
        action: 'STUDENT_RECORD_CREATED',
        entityType: 'STUDENT',
        entityId: newStudent.id,
        details: `Registered student ${newStudent.name} with APAAR ${newStudent.apaarId || 'None'}.`,
        status: 'SUCCESS',
        ipAddress: '127.0.0.1 (UI Action)',
      });
      setAuditLogs(getAuditLogs());
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    const updated = students.filter((s) => s.id !== studentId);
    handleStudentsChange(updated);
    addAuditLog({
      actorName: currentUser?.name || 'Administrator',
      actorRole: currentUser?.role || 'aicte_admin',
      actorEmail: currentUser?.email || 'admin@apaarconnect.ai',
      action: 'STUDENT_RECORD_DELETED',
      entityType: 'STUDENT',
      entityId: studentId,
      details: `Deleted student record for ${student?.name || studentId}.`,
      status: 'WARNING',
      ipAddress: '127.0.0.1 (UI Action)',
    });
    setAuditLogs(getAuditLogs());
  };

  const handleBatchIngest = (newRecords: Partial<StudentRecord>[]) => {
    const casted = newRecords as StudentRecord[];
    const updated = [...casted, ...students];
    handleStudentsChange(updated);
    addAuditLog({
      actorName: currentUser?.name || 'College Admin',
      actorRole: currentUser?.role || 'institution_admin',
      actorEmail: currentUser?.email || 'college@apaarconnect.ai',
      action: 'BATCH_CSV_STUDENTS_INGESTED',
      entityType: 'BATCH_UPLOAD',
      entityId: `BATCH-${Date.now()}`,
      details: `Ingested cohort of ${newRecords.length} student records from CSV.`,
      status: 'SUCCESS',
      ipAddress: '115.112.44.18',
    });
    setAuditLogs(getAuditLogs());
  };

  const handleResolveIssue = (issueId: string) => {
    setResolvedIssueIds((prev) => new Set(prev).add(issueId));
    addAuditLog({
      actorName: currentUser?.name || 'Administrator',
      actorRole: currentUser?.role || 'aicte_admin',
      actorEmail: currentUser?.email || 'admin@apaarconnect.ai',
      action: 'VALIDATION_ISSUE_RESOLVED',
      entityType: 'VALIDATION',
      entityId: issueId,
      details: `Marked issue ${issueId} as resolved upon administrative review.`,
      status: 'SUCCESS',
      ipAddress: '127.0.0.1',
    });
    setAuditLogs(getAuditLogs());
  };

  const handleResolveDuplicateCluster = (
    clusterId: string,
    action: 'REVOKED' | 'FALSE_POSITIVE',
    note: string
  ) => {
    setResolvedClusterIds((prev) => new Set(prev).add(clusterId));

    if (action === 'REVOKED') {
      // Find the cluster
      const cluster = activeClusters.find((c) => c.id === clusterId);
      if (cluster && cluster.records.length > 1) {
        // Revoke second record
        const secondRec = cluster.records[1];
        const updated = students.map((s) =>
          s.id === secondRec.id ? { ...s, verificationStatus: 'INVALID' as const } : s
        );
        handleStudentsChange(updated);
      }
    }

    addAuditLog({
      actorName: currentUser?.name || 'Administrator',
      actorRole: currentUser?.role || 'aicte_admin',
      actorEmail: currentUser?.email || 'admin@apaarconnect.ai',
      action: action === 'REVOKED' ? 'DUPLICATE_ENROLMENT_REVOKED' : 'DUPLICATE_FALSE_POSITIVE_CLEARED',
      entityType: 'DUPLICATE',
      entityId: clusterId,
      details: note || 'Resolved by AICTE council resolution.',
      status: 'SUCCESS',
      ipAddress: '127.0.0.1',
    });
    setAuditLogs(getAuditLogs());
  };

  const handleResolveAlert = (alertId: string) => {
    const updated = notifications.map((n) => (n.id === alertId ? { ...n, isResolved: true } : n));
    handleNotificationsChange(updated);
  };

  const handleMarkAlertRead = (alertId: string) => {
    const updated = notifications.map((n) => (n.id === alertId ? { ...n, isRead: true } : n));
    handleNotificationsChange(updated);
  };

  const handleNavigateToVerification = (studentId: string) => {
    setVerificationSearchId(studentId);
    setActivePage('verification');
  };

  // If not logged in, render role-based login page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#0a1122] flex flex-col text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenDemoTour={() => setIsTourOpen(true)}
        onOpenAiInsights={() => setIsAiInsightsOpen(true)}
        onResetData={handleResetData}
        onLogout={handleLogout}
        unreadAlertCount={unreadAlertCount}
        onNavigate={setActivePage}
        allStudents={students}
        onSelectStudentProfile={(s) => setSelectedStudentForProfile(s)}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentUser={currentUser}
          validationIssueCount={activeIssues.filter((i) => i.severity === 'RED' && i.status === 'PENDING').length}
          duplicateClusterCount={activeClusters.filter((c) => c.status === 'OPEN').length}
          unreadAlertCount={unreadAlertCount}
          hasIntakeBreach={hasIntakeBreach}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0a1122]">
          <div className="max-w-7xl mx-auto space-y-6">
            {activePage === 'overview' && (
              <OverviewDashboard
                currentUser={currentUser}
                students={students}
                institutions={institutions}
                intakes={intakes}
                duplicateClusters={activeClusters}
                auditLogs={auditLogs}
                onNavigate={setActivePage}
                onOpenDemoTour={() => setIsTourOpen(true)}
                onOpenAiInsights={() => setIsAiInsightsOpen(true)}
              />
            )}

            {activePage === 'registry' && (
              <StudentRegistryPage
                students={students}
                institutions={institutions}
                onAddStudent={() => {
                  setStudentToEdit(null);
                  setAddEditModalOpen(true);
                }}
                onEditStudent={(s) => {
                  setStudentToEdit(s);
                  setAddEditModalOpen(true);
                }}
                onDeleteStudent={handleDeleteStudent}
                onSelectStudentProfile={(s) => setSelectedStudentForProfile(s)}
              />
            )}

            {activePage === 'upload' && (
              <DataUploadPage
                onIngestBatch={handleBatchIngest}
                institutions={institutions}
                onNavigateToValidation={() => setActivePage('validation')}
              />
            )}

            {activePage === 'validation' && (
              <ValidationCentrePage
                students={students}
                issues={activeIssues}
                onRunValidation={() => {
                  // Re-triggers calculation
                  setStudents([...students]);
                  addAuditLog({
                    actorName: currentUser.name,
                    actorRole: currentUser.role,
                    actorEmail: currentUser.email,
                    action: 'FULL_VALIDATION_MATRIX_EXECUTED',
                    entityType: 'VALIDATION',
                    entityId: 'ALL',
                    details: 'Executed 7-point validation check across all registered student records.',
                    status: 'SUCCESS',
                    ipAddress: '127.0.0.1',
                  });
                  setAuditLogs(getAuditLogs());
                }}
                onResolveIssue={handleResolveIssue}
                onEditStudent={(s) => {
                  setStudentToEdit(s);
                  setAddEditModalOpen(true);
                }}
                onNavigateToDuplicates={() => setActivePage('duplicates')}
              />
            )}

            {activePage === 'duplicates' && (
              <DuplicateDetectionPage
                duplicateClusters={activeClusters}
                onResolveCluster={handleResolveDuplicateCluster}
                onSelectStudentProfile={(s) => setSelectedStudentForProfile(s)}
              />
            )}

            {activePage === 'intake' && (
              <IntakeMonitoringPage
                students={students}
                institutions={institutions}
                intakes={intakes}
                onSelectStudentProfile={(s) => setSelectedStudentForProfile(s)}
              />
            )}

            {activePage === 'verification' && (
              <VerificationPortalPage students={students} initialSearchId={verificationSearchId} />
            )}

            {activePage === 'analytics' && (
              <AnalyticsReportsPage
                students={students}
                institutions={institutions}
                intakes={intakes}
                duplicateClusters={activeClusters}
              />
            )}

            {activePage === 'alerts' && (
              <AlertsCentrePage
                notifications={notifications}
                onMarkRead={handleMarkAlertRead}
                onResolveAlert={handleResolveAlert}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'audit' && <AuditTrailPage auditLogs={auditLogs} />}

            {activePage === 'users' && (
              <UserManagementPage currentUser={currentUser} institutions={institutions} />
            )}

            {activePage === 'settings' && (
              <SettingsPage
                onResetData={handleResetData}
                students={students}
                institutions={institutions}
                intakes={intakes}
              />
            )}
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <GuidedDemoModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateToStep={(pageId) => {
          setActivePage(pageId);
        }}
        onResetDemoData={handleResetData}
      />

      <StudentDetailModal
        student={selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        onNavigateToVerification={handleNavigateToVerification}
      />

      <AddEditStudentModal
        isOpen={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        initialData={studentToEdit}
        institutions={institutions}
      />

      <AiInsightsModal
        isOpen={isAiInsightsOpen}
        onClose={() => setIsAiInsightsOpen(false)}
        students={students}
        institutions={institutions}
        intakes={intakes}
        duplicateClusters={activeClusters}
      />
    </div>
  );
}
