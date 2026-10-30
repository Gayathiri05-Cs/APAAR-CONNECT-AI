/**
 * APAAR CONNECT AI - Preloaded Synthetic Demonstration Data
 * "Demonstration Environment – Synthetic Student Data – Not Connected to Official APAAR or AICTE Systems."
 */

import { Institution, ProgrammeIntake, StudentRecord, AlertNotification, AuditLogEntry, User } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'USER-AICTE-01',
    name: 'Dr. Rameshwar Nath Varma',
    email: 'admin@apaarconnect.ai',
    role: 'aicte_admin',
    designation: 'Advisor & Chief Regulatory Officer, AICTE New Delhi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'USER-INST-01',
    name: 'Prof. Sunita Deshmukh',
    email: 'college@apaarconnect.ai',
    role: 'institution_admin',
    institutionId: 'INST-01',
    institutionName: 'Delhi Institute of Technology & Science (DITS)',
    designation: 'Dean of Academic Admissions & Nodal Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'USER-VERIF-01',
    name: 'Col. Rajesh K. Nair (Retd.)',
    email: 'verifier@apaarconnect.ai',
    role: 'verifier',
    designation: 'Authorized Document Verification Officer, National Board',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
];

export const INSTITUTIONS: Institution[] = [
  {
    id: 'INST-01',
    code: 'AICTE-DL-0104',
    name: 'Delhi Institute of Technology & Science',
    shortName: 'DITS New Delhi',
    type: 'State Autonomous',
    state: 'Delhi',
    city: 'New Delhi',
    nodalOfficer: 'Prof. Sunita Deshmukh',
    officerEmail: 'nodal.dits@edu.in',
    officerPhone: '+91 98112 34567',
    nirfRank: 34,
  },
  {
    id: 'INST-02',
    code: 'AICTE-MH-0289',
    name: 'Maharashtra Institute of Technology & Engineering',
    shortName: 'MITE Pune',
    type: 'Deemed Institute',
    state: 'Maharashtra',
    city: 'Pune',
    nodalOfficer: 'Dr. Anand Kulkarni',
    officerEmail: 'nodal.mite@pune.ac.in',
    officerPhone: '+91 94220 89123',
    nirfRank: 42,
  },
  {
    id: 'INST-03',
    code: 'AICTE-KA-0341',
    name: 'Bangalore College of Engineering & Technology',
    shortName: 'BCET Bengaluru',
    type: 'Affiliated College',
    state: 'Karnataka',
    city: 'Bengaluru',
    nodalOfficer: 'Dr. V. Shankaran',
    officerEmail: 'admissions@bcet.edu.in',
    officerPhone: '+91 98450 12789',
    nirfRank: 58,
  },
  {
    id: 'INST-04',
    code: 'AICTE-TN-0418',
    name: 'Chennai Autonomous Engineering College',
    shortName: 'CAEC Chennai',
    type: 'State Autonomous',
    state: 'Tamil Nadu',
    city: 'Chennai',
    nodalOfficer: 'Dr. Meenakshi Sundaram',
    officerEmail: 'nodal@caec.ac.in',
    officerPhone: '+91 94441 56780',
    nirfRank: 51,
  },
  {
    id: 'INST-05',
    code: 'AICTE-TS-0592',
    name: 'National Institute of Applied Sciences',
    shortName: 'NIAS Hyderabad',
    type: 'Central University',
    state: 'Telangana',
    city: 'Hyderabad',
    nodalOfficer: 'Prof. K. Venkateshwar',
    officerEmail: 'nodal@nias.ac.in',
    officerPhone: '+91 98660 44321',
    nirfRank: 26,
  },
  {
    id: 'INST-06',
    code: 'AICTE-GJ-0677',
    name: 'Gujarat Technological Academy',
    shortName: 'GTA Ahmedabad',
    type: 'Affiliated College',
    state: 'Gujarat',
    city: 'Ahmedabad',
    nodalOfficer: 'Dr. Jatin B. Patel',
    officerEmail: 'registrar@gta.edu.in',
    officerPhone: '+91 98250 88991',
    nirfRank: 84,
  },
  {
    id: 'INST-07',
    code: 'AICTE-UP-0715',
    name: 'Uttar Pradesh Institute of Technology',
    shortName: 'UPIT Lucknow',
    type: 'State Autonomous',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    nodalOfficer: 'Prof. Alok Tripathi',
    officerEmail: 'nodal@upit.ac.in',
    officerPhone: '+91 94150 33214',
    nirfRank: 76,
  },
  {
    id: 'INST-08',
    code: 'AICTE-WB-0839',
    name: 'Kolkata Engineering & Research Institute',
    shortName: 'KERI Kolkata',
    type: 'Affiliated College',
    state: 'West Bengal',
    city: 'Kolkata',
    nodalOfficer: 'Dr. Debabrata Roy',
    officerEmail: 'dean.acad@keri.ac.in',
    officerPhone: '+91 98300 76543',
    nirfRank: 69,
  },
];

export const PROGRAMMES = [
  { id: 'PROG-CSE', name: 'B.Tech Computer Science & Engineering', code: 'CSE', durationYears: 4 },
  { id: 'PROG-AIDS', name: 'B.Tech Artificial Intelligence & Data Science', code: 'AI&DS', durationYears: 4 },
  { id: 'PROG-ECE', name: 'B.Tech Electronics & Communication Engineering', code: 'ECE', durationYears: 4 },
  { id: 'PROG-ME', name: 'B.Tech Mechanical Engineering', code: 'ME', durationYears: 4 },
  { id: 'PROG-IT', name: 'B.Tech Information Technology', code: 'IT', durationYears: 4 },
];

export const INITIAL_INTAKE_CONFIG: ProgrammeIntake[] = [
  // INST-01: DITS New Delhi (Has deliberate excess enrollment in CSE!)
  { id: 'INT-01', institutionId: 'INST-01', programmeId: 'PROG-CSE', programmeName: 'B.Tech Computer Science & Engineering', academicYear: '2024-2025', approvedIntake: 120, supernumeraryCap: 6 },
  { id: 'INT-02', institutionId: 'INST-01', programmeId: 'PROG-AIDS', programmeName: 'B.Tech Artificial Intelligence & Data Science', academicYear: '2024-2025', approvedIntake: 60, supernumeraryCap: 3 },
  { id: 'INT-03', institutionId: 'INST-01', programmeId: 'PROG-ECE', programmeName: 'B.Tech Electronics & Communication Engineering', academicYear: '2024-2025', approvedIntake: 120, supernumeraryCap: 6 },
  
  // INST-02: MITE Pune
  { id: 'INT-04', institutionId: 'INST-02', programmeId: 'PROG-CSE', programmeName: 'B.Tech Computer Science & Engineering', academicYear: '2024-2025', approvedIntake: 180, supernumeraryCap: 9 },
  { id: 'INT-05', institutionId: 'INST-02', programmeId: 'PROG-IT', programmeName: 'B.Tech Information Technology', academicYear: '2024-2025', approvedIntake: 60, supernumeraryCap: 3 },
  
  // INST-03: BCET Bengaluru
  { id: 'INT-06', institutionId: 'INST-03', programmeId: 'PROG-AIDS', programmeName: 'B.Tech Artificial Intelligence & Data Science', academicYear: '2024-2025', approvedIntake: 60, supernumeraryCap: 3 },
  { id: 'INT-07', institutionId: 'INST-03', programmeId: 'PROG-ECE', programmeName: 'B.Tech Electronics & Communication Engineering', academicYear: '2024-2025', approvedIntake: 90, supernumeraryCap: 4 },

  // INST-04: CAEC Chennai
  { id: 'INT-08', institutionId: 'INST-04', programmeId: 'PROG-CSE', programmeName: 'B.Tech Computer Science & Engineering', academicYear: '2024-2025', approvedIntake: 120, supernumeraryCap: 6 },
  { id: 'INT-09', institutionId: 'INST-04', programmeId: 'PROG-ME', programmeName: 'B.Tech Mechanical Engineering', academicYear: '2024-2025', approvedIntake: 60, supernumeraryCap: 3 },

  // INST-05: NIAS Hyderabad
  { id: 'INT-10', institutionId: 'INST-05', programmeId: 'PROG-CSE', programmeName: 'B.Tech Computer Science & Engineering', academicYear: '2024-2025', approvedIntake: 120, supernumeraryCap: 6 },

  // INST-06: GTA Ahmedabad
  { id: 'INT-11', institutionId: 'INST-06', programmeId: 'PROG-IT', programmeName: 'B.Tech Information Technology', academicYear: '2024-2025', approvedIntake: 60, supernumeraryCap: 3 },

  // INST-07: UPIT Lucknow
  { id: 'INT-12', institutionId: 'INST-07', programmeId: 'PROG-CSE', programmeName: 'B.Tech Computer Science & Engineering', academicYear: '2024-2025', approvedIntake: 120, supernumeraryCap: 6 },

  // INST-08: KERI Kolkata
  { id: 'INT-13', institutionId: 'INST-08', programmeId: 'PROG-ECE', programmeName: 'B.Tech Electronics & Communication Engineering', academicYear: '2024-2025', approvedIntake: 90, supernumeraryCap: 4 },
];

/**
 * Generate 110 diverse synthetic students with specific intentional SIH test cases
 */
export function generateInitialStudents(): StudentRecord[] {
  const students: StudentRecord[] = [];

  // Helper generator
  const createStudent = (
    idNum: number,
    name: string,
    gender: 'Male' | 'Female' | 'Other',
    apaar: string | undefined,
    roll: string,
    instId: string,
    progId: string,
    cat: any = 'General',
    status: any = 'VERIFIED',
    dob = '2005-05-15',
    credits = 44,
    cgpa = 8.4,
    ay = '2024-2025'
  ): StudentRecord => {
    const inst = INSTITUTIONS.find((i) => i.id === instId) || INSTITUTIONS[0];
    const prog = PROGRAMMES.find((p) => p.id === progId) || PROGRAMMES[0];
    const slugName = name.toLowerCase().replace(/[^a-z]/g, '.');

    return {
      id: `STU-2025-${String(idNum).padStart(4, '0')}`,
      apaarId: apaar,
      studentId: roll,
      name,
      dob,
      gender,
      institutionId: inst.id,
      institutionName: inst.name,
      programmeId: prog.id,
      programmeName: prog.name,
      academicYear: ay,
      semester: 3,
      admissionCategory: cat,
      admissionDate: '2024-08-16',
      email: `${slugName}@${inst.code.toLowerCase().replace('-', '')}.ac.in`,
      phone: `+91 9${String(Math.floor(100000000 + Math.random() * 900000000))}`,
      state: inst.state,
      verificationStatus: status,
      digilockerSynced: status === 'VERIFIED',
      abcCreditsEarned: credits,
      cgpa,
      createdAt: '2024-08-20T10:00:00Z',
      updatedAt: '2024-08-20T10:00:00Z',
    };
  };

  // --- CASE 1: CRITICAL CROSS-INSTITUTION DUPLICATE ENROLMENT ---
  // Student "Aditya Narayan Verma" holds APAAR "4821-9034-7182"
  // Enrolled simultaneously at DITS CSE and MITE CSE in same academic year!
  students.push(
    createStudent(1, 'Aditya Narayan Verma', 'Male', '4821-9034-7182', 'DITS-2024-CSE-004', 'INST-01', 'PROG-CSE', 'General', 'FLAGGED', '2005-03-21', 42, 8.7),
    createStudent(2, 'Aditya Narayan Verma', 'Male', '4821-9034-7182', 'MITE-2024-CSE-019', 'INST-02', 'PROG-CSE', 'General', 'FLAGGED', '2005-03-21', 38, 8.5)
  );

  // --- CASE 2: LOCAL SAME-INSTITUTION DUPLICATE APAAR ---
  // Two records in GTA sharing APAAR "7381-4920-1923"
  students.push(
    createStudent(3, 'Chirag Hasmukh Patel', 'Male', '7381-4920-1923', 'GTA-2024-IT-011', 'INST-06', 'PROG-IT', 'OBC-NCL', 'FLAGGED', '2005-07-14', 40, 7.8),
    createStudent(4, 'Chirag H. Patel', 'Male', '7381-4920-1923', 'GTA-2024-IT-045', 'INST-06', 'PROG-IT', 'OBC-NCL', 'FLAGGED', '2005-07-14', 40, 7.8)
  );

  // --- CASE 3: HIGH-CONFIDENCE MULTI-FACTOR MATCH (Missing APAAR, Same Name & DOB across Colleges) ---
  students.push(
    createStudent(5, 'Rohan Vivek Sharma', 'Male', undefined, 'BCET-2024-AIDS-008', 'INST-03', 'PROG-AIDS', 'General', 'FLAGGED', '2005-04-12', 36, 8.1),
    createStudent(6, 'Rohan V. Sharma', 'Male', undefined, 'CAEC-2024-CSE-092', 'INST-04', 'PROG-CSE', 'General', 'FLAGGED', '2005-04-12', 34, 7.9)
  );

  // --- CASE 4: INVALID APAAR FORMATS ---
  // Alpha characters in APAAR
  students.push(
    createStudent(7, 'Vikramaditya Sengupta', 'Male', '1234-5678-ABCD', 'KERI-2024-ECE-014', 'INST-08', 'PROG-ECE', 'General', 'INVALID', '2004-11-20', 32, 6.9),
    // All 9s
    createStudent(8, 'Tanvi Sandeep Deshmukh', 'Female', '9999-9999-9999', 'MITE-2024-IT-032', 'INST-02', 'PROG-IT', 'General', 'INVALID', '2005-09-02', 38, 8.2),
    // Truncated (8 digits)
    createStudent(9, 'Manish Kumar Yadav', 'Male', '5482-1920', 'UPIT-2024-CSE-056', 'INST-07', 'PROG-CSE', 'OBC-NCL', 'INVALID', '2004-12-18', 30, 7.1)
  );

  // --- CASE 5: MISSING APAAR (Unregistered with ABC) ---
  students.push(
    createStudent(10, 'Sneha Raghavan', 'Female', undefined, 'CAEC-2024-ME-022', 'INST-04', 'PROG-ME', 'SC', 'PENDING', '2005-02-14', 28, 7.5),
    createStudent(11, 'Mohammed Zaid Khan', 'Male', '', 'NIAS-2024-CSE-077', 'INST-05', 'PROG-CSE', 'EWS', 'PENDING', '2005-06-25', 40, 8.4),
    createStudent(12, 'Pooja Vishwanath', 'Female', undefined, 'BCET-2024-ECE-041', 'INST-03', 'PROG-ECE', 'General', 'PENDING', '2005-01-30', 36, 8.0)
  );

  // --- CASE 6: SUPERNUMERARY SEATS (TFW & PMSSS) ---
  // These are legal seats over base intake
  students.push(
    createStudent(13, 'Deepak Rameshwar Joshi', 'Male', '3910-8201-9482', 'DITS-2024-CSE-121', 'INST-01', 'PROG-CSE', 'Supernumerary-TFW', 'VERIFIED', '2005-08-10', 44, 9.1),
    createStudent(14, 'Shabnum Bashir Mir', 'Female', '4820-1928-3019', 'DITS-2024-CSE-122', 'INST-01', 'PROG-CSE', 'Supernumerary-PMSSS', 'VERIFIED', '2004-10-05', 42, 8.8),
    createStudent(15, 'Arun Kumar Nair', 'Male', '7192-3841-9201', 'DITS-2024-CSE-123', 'INST-01', 'PROG-CSE', 'Supernumerary-TFW', 'VERIFIED', '2005-03-12', 40, 8.3),
    createStudent(16, 'Farooq Ahmad Bhat', 'Male', '8201-9481-2039', 'DITS-2024-CSE-124', 'INST-01', 'PROG-CSE', 'Supernumerary-PMSSS', 'VERIFIED', '2005-07-28', 42, 8.6)
  );

  // --- POPULATE REST WITH REALISTIC INDIAN STUDENTS ACROSS ALL 8 INSTITUTIONS ---
  const firstNames = [
    'Aarav', 'Ananya', 'Vivaan', 'Diya', 'Ishaan', 'Saanvi', 'Kabir', 'Aanya',
    'Rhea', 'Arjun', 'Isha', 'Ayaan', 'Myra', 'Kavya', 'Aditya', 'Meera',
    'Reyansh', 'Anika', 'Dhruv', 'Navya', 'Vihaan', 'Avani', 'Atharv', 'Sara',
    'Shaurya', 'Prisha', 'Devansh', 'Siya', 'Aryan', 'Ira', 'Advait', 'Anvi',
    'Kian', 'Pari', 'Samarth', 'Tara', 'Kartik', 'Riya', 'Tejas', 'Tanvi',
    'Harsh', 'Swara', 'Pranav', 'Nidhi', 'Yash', 'Siddhi', 'Om', 'Divya',
    'Akash', 'Shruti', 'Gaurav', 'Komal', 'Alok', 'Pallavi', 'Neeraj', 'Sakshi',
    'Nitin', 'Rashi', 'Abhishek', 'Shreya', 'Siddharth', 'Bhavna', 'Mayank', 'Geeta',
    'Sunil', 'Preeti', 'Rajesh', 'Rashmi', 'Manoj', 'Deepa', 'Sandeep', 'Anjali',
    'Ajay', 'Pooja', 'Pankaj', 'Suman', 'Mukesh', 'Rekha', 'Ramesh', 'Aarti',
    'Vikas', 'Seema', 'Dinesh', 'Vandana', 'Amit', 'Sunita', 'Sanjay', 'Kiran',
    'Rahul', 'Usha', 'Anil', 'Manju', 'Vijay', 'Shashi', 'Ashok', 'Neelam'
  ];

  const lastNames = [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Mishra', 'Joshi',
    'Nair', 'Iyer', 'Reddy', 'Rao', 'Deshmukh', 'Kulkarni', 'Bhat', 'Mehta',
    'Shah', 'Mukherjee', 'Banerjee', 'Chatterjee', 'Chakraborty', 'Das', 'Sen', 'Dutta',
    'Menon', 'Pillai', 'Kurup', 'Warrier', 'Nambiar', 'Hegde', 'Shetty', 'Pai',
    'Gowda', 'Naidu', 'Chowdary', 'Choudhury', 'Yadav', 'Maurya', 'Kushwaha', 'Chauhan',
    'Thakur', 'Rathore', 'Solanki', 'Parmar', 'Jhala', 'Jadeja', 'Trivedi', 'Pandya'
  ];

  const categories = ['General', 'OBC-NCL', 'SC', 'ST', 'EWS'];
  const instList = INSTITUTIONS;

  let currentId = 17;

  // Let's generate up to 108 total students distributed across all institutions
  for (let i = 0; i < 92; i++) {
    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[(i * 3 + 7) % lastNames.length];
    const fullName = `${fName} ${lName}`;
    const gender: 'Male' | 'Female' = i % 2 === 0 ? 'Male' : 'Female';
    const inst = instList[i % instList.length];
    
    // Choose appropriate program for that institution
    let progId = 'PROG-CSE';
    if (inst.id === 'INST-03') progId = (i % 2 === 0) ? 'PROG-AIDS' : 'PROG-ECE';
    else if (inst.id === 'INST-04') progId = (i % 2 === 0) ? 'PROG-CSE' : 'PROG-ME';
    else if (inst.id === 'INST-06') progId = 'PROG-IT';
    else if (inst.id === 'INST-08') progId = 'PROG-ECE';
    else if (i % 3 === 1) progId = 'PROG-AIDS';
    else if (i % 3 === 2) progId = 'PROG-ECE';

    const progCode = PROGRAMMES.find(p => p.id === progId)?.code || 'CSE';
    const roll = `${inst.shortName.split(' ')[0]}-2024-${progCode}-${String(100 + i).slice(-3)}`;

    // Generate valid 12-digit APAAR
    const part1 = String(1000 + ((i * 73 + 19) % 8999));
    const part2 = String(1000 + ((i * 97 + 31) % 8999));
    const part3 = String(1000 + ((i * 43 + 83) % 8999));
    const apaar = `${part1}-${part2}-${part3}`;

    const cat = categories[i % categories.length];
    const birthYear = 2004 + (i % 2);
    const birthMonth = String(1 + (i % 12)).padStart(2, '0');
    const birthDay = String(1 + (i % 28)).padStart(2, '0');
    const dob = `${birthYear}-${birthMonth}-${birthDay}`;

    const credits = 36 + (i % 14);
    const cgpa = Number((7.0 + (i % 29) * 0.1).toFixed(2));

    students.push(
      createStudent(
        currentId++,
        fullName,
        gender,
        apaar,
        roll,
        inst.id,
        progId,
        cat,
        'VERIFIED',
        dob,
        credits,
        cgpa
      )
    );
  }

  return students;
}

export const INITIAL_NOTIFICATIONS: AlertNotification[] = [
  {
    id: 'NOTIF-01',
    title: 'Critical: Potential Duplicate Enrolment Across Institutions',
    description: 'APAAR ID 4821-9034-7182 detected in DITS New Delhi and MITE Pune for AY 2024-2025.',
    severity: 'CRITICAL',
    category: 'DUPLICATE_ENROLMENT',
    institutionName: 'Delhi Institute of Technology & Science',
    programmeName: 'B.Tech Computer Science & Engineering',
    timestamp: '10 mins ago',
    isRead: false,
    isResolved: false,
    actionUrl: '/duplicates',
    dispatchLog: { emailSent: true, smsSent: true, dispatchTime: '2025-10-29T10:15:00Z' }
  },
  {
    id: 'NOTIF-02',
    title: 'Approved Intake Threshold Exceeded (Red Alert)',
    description: 'DITS New Delhi has enrolled 128 students against Approved Base Intake of 120 (4 supernumerary TFW + 4 non-authorized excess).',
    severity: 'CRITICAL',
    category: 'INTAKE_EXCESS',
    institutionName: 'Delhi Institute of Technology & Science',
    programmeName: 'B.Tech Computer Science & Engineering',
    timestamp: '25 mins ago',
    isRead: false,
    isResolved: false,
    actionUrl: '/intake',
    dispatchLog: { emailSent: true, smsSent: false, dispatchTime: '2025-10-29T10:00:00Z' }
  },
  {
    id: 'NOTIF-03',
    title: 'APAAR Format Validation Failures Detected',
    description: '3 records flagged with malformed or dummy APAAR numbers in KERI Kolkata and MITE Pune.',
    severity: 'WARNING',
    category: 'VALIDATION_ERROR',
    institutionName: 'Multiple Institutions',
    timestamp: '1 hour ago',
    isRead: false,
    isResolved: false,
    actionUrl: '/validation',
    dispatchLog: { emailSent: true, smsSent: false, dispatchTime: '2025-10-29T09:20:00Z' }
  },
  {
    id: 'NOTIF-04',
    title: 'Annual Academic Data Submission Reminder',
    description: 'Gujarat Technological Academy has 18 students pending APAAR DigiLocker consent linkage.',
    severity: 'INFO',
    category: 'SUBMISSION_PENDING',
    institutionName: 'Gujarat Technological Academy',
    timestamp: '3 hours ago',
    isRead: true,
    isResolved: false,
    actionUrl: '/registry',
    dispatchLog: { emailSent: true, smsSent: true, dispatchTime: '2025-10-29T07:30:00Z' }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUDIT-101',
    timestamp: '2025-10-29T21:45:12Z',
    actorName: 'Dr. Rameshwar Nath Varma',
    actorRole: 'aicte_admin',
    actorEmail: 'admin@apaarconnect.ai',
    action: 'NATIONAL_BATCH_VALIDATION_EXECUTED',
    entityType: 'VALIDATION',
    entityId: 'BATCH-2024-Q3-01',
    details: 'Triggered automated APAAR verification engine across 108 registered students in 8 institutions.',
    status: 'SUCCESS',
    ipAddress: '14.139.60.22 (NIC AICTE HQ)',
  },
  {
    id: 'AUDIT-102',
    timestamp: '2025-10-29T20:30:44Z',
    actorName: 'Prof. Sunita Deshmukh',
    actorRole: 'institution_admin',
    actorEmail: 'college@apaarconnect.ai',
    action: 'STUDENT_BATCH_CSV_UPLOADED',
    entityType: 'BATCH_UPLOAD',
    entityId: 'CSV-DITS-2024-AY',
    details: 'Uploaded batch submission for 24 students in B.Tech CSE (AY 2024-2025).',
    status: 'SUCCESS',
    ipAddress: '115.112.44.18 (DITS Campus Gateway)',
  },
  {
    id: 'AUDIT-103',
    timestamp: '2025-10-29T19:12:05Z',
    actorName: 'Col. Rajesh K. Nair (Retd.)',
    actorRole: 'verifier',
    actorEmail: 'verifier@apaarconnect.ai',
    action: 'CRYPTOGRAPHIC_RECORD_VERIFIED',
    entityType: 'STUDENT',
    entityId: 'STU-2025-0013',
    details: 'Verified SHA-256 canonical integrity hash for student Deepak Rameshwar Joshi. Result: PASS.',
    status: 'SUCCESS',
    ipAddress: '103.21.124.9',
  },
  {
    id: 'AUDIT-104',
    timestamp: '2025-10-29T18:05:30Z',
    actorName: 'SYSTEM_CRON_AI',
    actorRole: 'aicte_admin',
    actorEmail: 'system@apaarconnect.ai',
    action: 'INTAKE_CAPACITY_MONITOR_EVALUATION',
    entityType: 'INTAKE',
    entityId: 'INT-01',
    details: 'Flagged DITS New Delhi CSE for intake threshold breach (128 enrolled vs 120 approved).',
    status: 'WARNING',
    ipAddress: '127.0.0.1 (Local Daemon)',
  },
  {
    id: 'AUDIT-105',
    timestamp: '2025-10-29T16:40:19Z',
    actorName: 'Dr. Anand Kulkarni',
    actorRole: 'institution_admin',
    actorEmail: 'nodal.mite@pune.ac.in',
    action: 'STUDENT_PROFILE_MODIFIED',
    entityType: 'STUDENT',
    entityId: 'STU-2025-0008',
    details: 'Updated APAAR ID format correction request for student Tanvi Sandeep Deshmukh.',
    status: 'SUCCESS',
    ipAddress: '117.204.18.90',
  },
];
