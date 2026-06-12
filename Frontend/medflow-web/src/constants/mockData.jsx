// src/constants/mockData.js

/** * Mock Users (Staff members)
 * @type {import('./types').User[]} 
 */
export const MOCK_USERS = [
  { user_id: 'USR-DOC1', name: 'Dr. Aris Thorne', email: 'a.thorne@medflow.com', phone: '+1-555-0101', DOB: '1975-08-12', role_id: 'DOCTOR', created_at: '2025-01-01T00:00:00Z' },
  { user_id: 'USR-DOC2', name: 'Dr. Emily Vance', email: 'e.vance@medflow.com', phone: '+1-555-0102', DOB: '1982-03-22', role_id: 'DOCTOR', created_at: '2025-01-01T00:00:00Z' },
  { user_id: 'USR-DOC3', name: 'Dr. Sarah Smith', email: 's.smith@medflow.com', phone: '+1-555-0103', DOB: '1988-11-05', role_id: 'DOCTOR', created_at: '2025-01-01T00:00:00Z' },
  { user_id: 'USR-NUR1', name: 'Nurse Jackie', email: 'j.nurse@medflow.com', phone: '+1-555-0201', DOB: '1990-05-14', role_id: 'NURSE', created_at: '2025-01-01T00:00:00Z' },
  { user_id: 'USR-REC1', name: 'Dina Receptionist', email: 'dina@medflow.com', phone: '+1-555-0301', DOB: '2002-06-20', role_id: 'RECEPTIONIST', created_at: '2025-01-01T00:00:00Z' }
];

// 1. Add this mock bank of available system worker accounts at the top of your file
export const MOCK_STAFF_PROFILES = {
  RECEPTIONIST: {
    fullName: "Dina Martinez",
    email: "d.martinez@medflow-clinical.com",
    phone: "+1 (555) 123-4567",
    dob: "1995-08-24",
    staffId: "MF-REC-002341",
    department: "Front Desk Operations",
    title: "Lead Patient Access Coordinator",
    status: "ACTIVE",
    lastLogin: "Today, 07:45 AM",
    location: "Main Lobby - Check-in Desk 1",
    metrics: {
      patientReviewsToday: 32, // Check-ins completed today
      approvalsPending: 0,
    }
  },
  NURSE: {
    fullName: "Clara Higgins, RN",
    email: "c.higgins@medflow-clinical.com",
    phone: "+1 (555) 765-4321",
    dob: "1988-11-12",
    staffId: "MF-NUR-008742",
    department: "Emergency Triage",
    title: "Senior Triage Officer",
    status: "ACTIVE",
    lastLogin: "Today, 06:15 AM",
    location: "Triage Assessment Unit Area A",
    metrics: {
      patientReviewsToday: 19, // Vitals logged today
      approvalsPending: 1, // High priority critical triage cases alert
    }
  },
  DOCTOR: {
    fullName: "Dr. Aris Thorne",
    email: "a.thorne@medflow-clinical.com",
    phone: "+1 (555) 942-0348",
    dob: "1982-05-14",
    staffId: "MF-DOC-000921",
    department: "Medical Leadership",
    title: "Attending Cardiologist",
    status: "ACTIVE",
    lastLogin: "Today, 08:14 AM",
    location: "Central Campus - Clinic Room 4B",
    metrics: {
      patientReviewsToday: 14, // Consultations finalized today
      approvalsPending: 3, // Laboratory test reports awaiting sign-off
    }
  },
  PHARMACIST: {
    fullName: "Alex Rivera, PharmD",
    email: "a.rivera@medflow-clinical.com",
    phone: "+1 (555) 888-2349",
    dob: "1991-03-30",
    staffId: "MF-PHM-005113",
    department: "Clinical Dispensary",
    title: "Chief Clinical Pharmacist",
    status: "ACTIVE",
    lastLogin: "Today, 08:00 AM",
    location: "Ground Floor Outpatient Pharmacy",
    metrics: {
      patientReviewsToday: 45, // Prescriptions validated today
      approvalsPending: 2, // Controlled substance authorization requests
    }
  }
};



/** * 25 Mock Patients
 * @type {import('./types').Patient[]} 
 */
export const MOCK_PATIENTS = [
  // WAITING (15)
  { patient_id: 'PT-9821', full_name: 'Benjamin Carter', phone: '+1-555-0001', DOB: '1992-04-15', gender: 'M', address: '742 Evergreen Terrace', created_at: '2026-01-10T08:00:00Z' },
  { patient_id: 'PT-1322', full_name: 'Sarah Jenkins', phone: '+1-555-0002', DOB: '1998-11-23', gender: 'F', address: '1022 Birch Lane', created_at: '2026-02-14T09:15:00Z' },
  { patient_id: 'PT-4412', full_name: 'Marcus Thorne', phone: '+1-555-0003', DOB: '1981-07-02', gender: 'M', address: '55 NW Ridge Road', created_at: '2026-03-01T10:00:00Z' },
  { patient_id: 'PT-5561', full_name: 'Elena Rodriguez', phone: '+1-555-0004', DOB: '1974-01-30', gender: 'F', address: '988 Oak Drive', created_at: '2026-03-12T11:45:00Z' },
  { patient_id: 'PT-6123', full_name: "Liam O'Connor", phone: '+1-555-0005', DOB: '2003-09-11', gender: 'M', address: '14 Willow Court', created_at: '2026-04-02T14:20:00Z' },
  { patient_id: 'PT-7741', full_name: 'Olivia Martinez', phone: '+1-555-0006', DOB: '1995-05-19', gender: 'F', address: '404 Pine Avenue', created_at: '2026-04-15T08:30:00Z' },
  { patient_id: 'PT-8832', full_name: 'Ethan Choi', phone: '+1-555-0007', DOB: '2014-12-05', gender: 'M', address: '223 Maple Boulevard', created_at: '2026-04-20T10:10:00Z' },
  { patient_id: 'PT-1945', full_name: 'Sophia Al-Mansoor', phone: '+1-555-0008', DOB: '1997-03-27', gender: 'F', address: '87 Desert Oasis Way', created_at: '2026-04-28T09:00:00Z' },
  { patient_id: 'PT-2031', full_name: 'Lucas Dubois', phone: '+1-555-0009', DOB: '1965-02-14', gender: 'M', address: '61 Rue de Gare', created_at: '2026-05-02T11:00:00Z' },
  { patient_id: 'PT-3110', full_name: 'Emma Watson', phone: '+1-555-0010', DOB: '2000-04-15', gender: 'F', address: '12 Grimmauld Place', created_at: '2026-05-10T15:30:00Z' },
  { patient_id: 'PT-4902', full_name: 'Jackson Briggs', phone: '+1-555-0011', DOB: '1987-10-31', gender: 'M', address: '505 Kombat Lane', created_at: '2026-05-15T13:15:00Z' },
  { patient_id: 'PT-5231', full_name: 'Mia Tanaka', phone: '+1-555-0012', DOB: '1985-08-08', gender: 'F', address: '33 Sakura Station', created_at: '2026-05-20T08:45:00Z' },
  { patient_id: 'PT-6098', full_name: 'Aiden Gallagher', phone: '+1-555-0013', DOB: '2007-01-18', gender: 'M', address: '88 Umbrella Academy', created_at: '2026-05-25T10:00:00Z' },
  { patient_id: 'PT-7152', full_name: 'Chloe Bourgeois', phone: '+1-555-0014', DOB: '2009-06-01', gender: 'F', address: '1 Grand Paris Hotel', created_at: '2026-06-01T09:00:00Z' },
  { patient_id: 'PT-8240', full_name: 'Zayn Malik', phone: '+1-555-0015', DOB: '1993-01-12', gender: 'M', address: '1 Direction Highway', created_at: '2026-06-02T11:20:00Z' },

  // AWAITING_TRIAGE (5)
  { patient_id: 'PT-1044', full_name: 'Amelia Earhart', phone: '+1-555-0016', DOB: '1982-07-24', gender: 'F', address: '500 Clouds Way', created_at: '2026-06-03T08:00:00Z' },
  { patient_id: 'PT-2299', full_name: 'David Wilson', phone: '+1-555-0017', DOB: '1976-05-11', gender: 'M', address: '321 River Road', created_at: '2026-06-04T09:30:00Z' },
  { patient_id: 'PT-3388', full_name: 'Harper Lee', phone: '+1-555-0018', DOB: '1959-04-28', gender: 'F', address: '42 Mockingbird Lane', created_at: '2026-06-05T10:15:00Z' },
  { patient_id: 'PT-4477', full_name: 'Noah Centineo', age: 25, phone: '+1-555-0019', DOB: '2001-05-09', gender: 'M', address: '12 Hollywood Blvd', created_at: '2026-06-06T14:00:00Z' },
  { patient_id: 'PT-5566', full_name: 'Isabella Swan', phone: '+1-555-0020', DOB: '2005-09-13', gender: 'F', address: '100 Forks Woods Rd', created_at: '2026-06-07T11:10:00Z' },

  // AWAITING_CONSULTATION (3)
  { patient_id: 'PT-1111', full_name: 'Arthur Pendragon', phone: '+1-555-0021', DOB: '1988-12-25', gender: 'M', address: '1 Camelot Castle', created_at: '2026-06-08T08:15:00Z' },
  { patient_id: 'PT-2222', full_name: 'Clara Oswald', phone: '+1-555-0022', DOB: '1999-03-05', gender: 'F', address: '77 Souffle Way', created_at: '2026-06-09T09:40:00Z' },
  { patient_id: 'PT-3333', full_name: 'Bruce Banner', phone: '+1-555-0023', DOB: '1977-12-18', gender: 'M', address: '45 Gamma Lab Compound', created_at: '2026-06-10T07:30:00Z' },

  // AWAITING_PHARMACY (2)
  { patient_id: 'PT-4444', full_name: 'Tony Stark', phone: '+1-555-0024', DOB: '1978-05-29', gender: 'M', address: '10880 Malibu Point', created_at: '2026-06-10T14:00:00Z' },
  { patient_id: 'PT-5555', full_name: 'Wanda Maximoff', phone: '+1-555-0025', DOB: '1996-02-10', gender: 'F', address: '280 Westview Terrace', created_at: '2026-06-11T07:05:00Z' }
];

/** * 25 Mock Appointments with Workflow tracking
 * @typedef {import('./types').Appointment & { workflow_step: string }} WorkflowAppointment
 * @type {WorkflowAppointment[]}
 */
export const MOCK_APPOINTMENTS = [
  // 15 WAITING APPOINTMENTS
  { appointment_id: 'APP-001', patient_id: 'PT-9821', user_id: 'USR-DOC1', appointment_date: '2026-06-11T09:15:00Z', reason: 'Cardiology Follow-up', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:00:00Z' },
  { appointment_id: 'APP-002', patient_id: 'PT-1322', user_id: 'USR-DOC2', appointment_date: '2026-06-11T09:30:00Z', reason: 'General Checkup', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:05:00Z' },
  { appointment_id: 'APP-003', patient_id: 'PT-4412', user_id: 'USR-DOC1', appointment_date: '2026-06-11T10:00:00Z', reason: 'Lab Diagnostics', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:10:00Z' },
  { appointment_id: 'APP-004', patient_id: 'PT-5561', user_id: 'USR-DOC3', appointment_date: '2026-06-11T10:15:00Z', reason: 'Consultation', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:12:00Z' },
  { appointment_id: 'APP-005', patient_id: 'PT-6123', user_id: 'USR-DOC2', appointment_date: '2026-06-11T10:30:00Z', reason: 'Physical Therapy', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:15:00Z' },
  { appointment_id: 'APP-006', patient_id: 'PT-7741', user_id: 'USR-DOC3', appointment_date: '2026-06-11T10:45:00Z', reason: 'General Checkup', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:20:00Z' },
  { appointment_id: 'APP-007', patient_id: 'PT-8832', user_id: 'USR-DOC2', appointment_date: '2026-06-11T11:00:00Z', reason: 'Pediatric Care', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:25:00Z' },
  { appointment_id: 'APP-008', patient_id: 'PT-1945', user_id: 'USR-DOC1', appointment_date: '2026-06-11T11:15:00Z', reason: 'Dermatology Review', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:30:00Z' },
  { appointment_id: 'APP-009', patient_id: 'PT-2031', user_id: 'USR-DOC3', appointment_date: '2026-06-11T11:30:00Z', reason: 'Geriatric Follow-up', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:32:00Z' },
  { appointment_id: 'APP-010', patient_id: 'PT-3110', user_id: 'USR-DOC2', appointment_date: '2026-06-11T11:45:00Z', reason: 'Prenatal Care', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:35:00Z' },
  { appointment_id: 'APP-011', patient_id: 'PT-4902', user_id: 'USR-DOC1', appointment_date: '2026-06-11T12:00:00PM', reason: 'Orthopedic Exam', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:40:00Z' },
  { appointment_id: 'APP-012', patient_id: 'PT-5231', user_id: 'USR-DOC3', appointment_date: '2026-06-11T12:15:00PM', reason: 'General Checkup', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T07:45:00Z' },
  { appointment_id: 'APP-013', patient_id: 'PT-6098', user_id: 'USR-DOC2', appointment_date: '2026-06-11T13:00:00Z', reason: 'Flu Symptoms Check', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T08:00:00Z' },
  { appointment_id: 'APP-014', patient_id: 'PT-7152', user_id: 'USR-DOC1', appointment_date: '2026-06-11T13:15:00Z', reason: 'Neurology Consultation', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T08:05:00Z' },
  { appointment_id: 'APP-015', patient_id: 'PT-8240', user_id: 'USR-DOC3', appointment_date: '2026-06-11T13:30:00Z', reason: 'Allergy Testing', status: 'pending', workflow_step: 'WAITING', created_at: '2026-06-11T08:10:00Z' },

  // 5 AWAITING_TRIAGE APPOINTMENTS (Nurse Queue)
  { appointment_id: 'APP-016', patient_id: 'PT-1044', user_id: 'USR-DOC1', appointment_date: '2026-06-11T09:00:00Z', reason: 'Hypertension Follow-up', status: 'pending', workflow_step: 'AWAITING_TRIAGE', created_at: '2026-06-11T08:15:00Z' },
  { appointment_id: 'APP-017', patient_id: 'PT-2299', user_id: 'USR-DOC2', appointment_date: '2026-06-11T09:05:00Z', reason: 'Diabetes Screening', status: 'pending', workflow_step: 'AWAITING_TRIAGE', created_at: '2026-06-11T08:18:00Z' },
  { appointment_id: 'APP-018', patient_id: 'PT-3388', user_id: 'USR-DOC3', appointment_date: '2026-06-11T09:10:00Z', reason: 'Chronic Pain Management', status: 'pending', workflow_step: 'AWAITING_TRIAGE', created_at: '2026-06-11T08:20:00Z' },
  { appointment_id: 'APP-019', patient_id: 'PT-4477', user_id: 'USR-DOC1', appointment_date: '2026-06-11T09:20:00Z', reason: 'Sports Injury Assessment', status: 'pending', workflow_step: 'AWAITING_TRIAGE', created_at: '2026-06-11T08:22:00Z' },
  { appointment_id: 'APP-020', patient_id: 'PT-5566', user_id: 'USR-DOC2', appointment_date: '2026-06-11T09:25:00Z', reason: 'Asthma Review', status: 'pending', workflow_step: 'AWAITING_TRIAGE', created_at: '2026-06-11T08:25:00Z' },

  // 3 AWAITING_CONSULTATION APPOINTMENTS (Doctor Queue)
  { appointment_id: 'APP-021', patient_id: 'PT-1111', user_id: 'USR-DOC1', appointment_date: '2026-06-11T08:30:00Z', reason: 'Severe Migraine', status: 'pending', workflow_step: 'AWAITING_CONSULTATION', created_at: '2026-06-11T08:00:00Z' },
  { appointment_id: 'APP-022', patient_id: 'PT-2222', user_id: 'USR-DOC2', appointment_date: '2026-06-11T08:45:00Z', reason: 'Abdominal Discomfort', status: 'pending', workflow_step: 'AWAITING_CONSULTATION', created_at: '2026-06-11T08:05:00Z' },
  { appointment_id: 'APP-023', patient_id: 'PT-3333', user_id: 'USR-DOC3', appointment_date: '2026-06-11T09:00:00Z', reason: 'High Stress Assessment', status: 'pending', workflow_step: 'AWAITING_CONSULTATION', created_at: '2026-06-11T08:10:00Z' },

  // 2 AWAITING_PHARMACY APPOINTMENTS (Pharmacy Queue)
  { appointment_id: 'APP-024', patient_id: 'PT-4444', user_id: 'USR-DOC1', appointment_date: '2026-06-11T08:15:00Z', reason: 'Cardiac Rhythm Review', status: 'pending', workflow_step: 'AWAITING_PHARMACY', created_at: '2026-06-11T07:45:00Z' },
  { appointment_id: 'APP-025', patient_id: 'PT-5555', user_id: 'USR-DOC3', appointment_date: '2026-06-11T08:30:00Z', reason: 'Insomnia Consultation', status: 'pending', workflow_step: 'AWAITING_PHARMACY', created_at: '2026-06-11T07:50:00Z' }
];

/** * Triage Data for advanced patients
 * @type {import('./types').Triage[]} 
 */
export const MOCK_TRIAGES = [
  { triage_id: 'TRG-101', appointment_id: 'APP-021', blood_pressure: '130/85', temperature: 37.1, heart_rate: 78, weight: 82, urgency_level: 2, note: 'Patient reports blinding aura alongside left-hemisphere headache.', created_at: '2026-06-11T08:10:00Z' },
  { triage_id: 'TRG-102', appointment_id: 'APP-022', blood_pressure: '115/70', temperature: 38.2, heart_rate: 64, weight: 58, urgency_level: 3, note: 'Acute tenderness in lower quadrant. Low fever noted.', created_at: '2026-06-11T08:20:00Z' },
  { triage_id: 'TRG-103', appointment_id: 'APP-023', blood_pressure: '150/95', temperature: 36.9, heart_rate: 110, weight: 95, urgency_level: 1, note: 'Extremely high resting heart rate. Signs of acute panic response.', created_at: '2026-06-11T08:35:00Z' },
  { triage_id: 'TRG-104', appointment_id: 'APP-024', blood_pressure: '122/80', temperature: 36.5, heart_rate: 70, weight: 80, urgency_level: 2, note: 'History of arrhythmias.', created_at: '2026-06-11T07:55:00Z' },
  { triage_id: 'TRG-105', appointment_id: 'APP-025', blood_pressure: '110/72', temperature: 36.7, heart_rate: 85, weight: 55, urgency_level: 4, note: 'Patient complaining of severe disruptions to circadian cycles.', created_at: '2026-06-11T08:05:00Z' }
];

/** * Mock Prescriptions matching the Pharmacy targets
 * @type {import('./types').Prescription[]} 
 */
export const MOCK_PRESCRIPTIONS = [
  { prescription_id: 'PRC-501', appointment_id: 'APP-024', patient_id: 'PT-4444', doctor_id: 'USR-DOC1', diagnosis: 'Mild Hypertension and Atrial Flutter risks', allergies: 'None reported', status: 'pending', created_at: '2026-06-11T08:15:00Z' },
  { prescription_id: 'PRC-502', appointment_id: 'APP-025', patient_id: 'PT-5555', doctor_id: 'USR-DOC3', diagnosis: 'Transient Psychophysiological Insomnia', allergies: 'Penicillin Sensitivity', status: 'pending', created_at: '2026-06-11T08:45:00Z' }
];


// Append these to your existing mock data exports

export const MOCK_PRESCRIPTION_ITEMS = [
  {
    item_id: "ITM-101-1",
    prescription_id: "PRC-001", // Hooks directly into your first mock prescription
    medication_name: "Amoxicillin 500mg",
    type: "Antibiotic",
    instruction: "Take 1 capsule by mouth three times daily for 7 days. Finish all.",
    quantity: 21,
    refills: 0,
    is_dispensed: false
  },
  {
    item_id: "ITM-101-2",
    prescription_id: "PRC-001",
    medication_name: "Paracetamol 500mg",
    type: "Analgesic",
    instruction: "Take 1-2 tablets every 4-6 hours as needed for fever or pain.",
    quantity: 20,
    refills: 1,
    is_dispensed: false
  },
  {
    item_id: "ITM-102-1",
    prescription_id: "PRC-002", // Hooks into your second mock prescription
    medication_name: "Lisinopril 10mg",
    type: "Antihypertensive",
    instruction: "Take 1 tablet by mouth daily in the morning.",
    quantity: 30,
    refills: 3,
    is_dispensed: false
  },
  {
    item_id: "ITM-103-1",
    prescription_id: "PRC-003",
    medication_name: "Metformin 850mg",
    type: "Antidiabetic",
    instruction: "Take 1 tablet twice daily with breakfast and dinner.",
    quantity: 60,
    refills: 2,
    is_dispensed: false
  },
  {
    item_id: "ITM-104-1",
    prescription_id: "PRC-004",
    medication_name: "Albuterol HFA Inhaler",
    type: "Bronchodilator",
    instruction: "Inhale 2 puffs every 4 to 6 hours as needed for wheezing.",
    quantity: 1,
    refills: 1,
    is_dispensed: false
  }
];

export const MOCK_WORKLOADS = [
  {
    department_name: "Reception Front Desk",
    load_percentage: 24, // Will recalculate as you check people in
    status_color: "bg-emerald-500"
  },
  {
    department_name: "Triage Nursing Core",
    load_percentage: 45,
    status_color: "bg-amber-500"
  },
  {
    department_name: "Outpatient Consultation",
    load_percentage: 70,
    status_color: "bg-rose-600"
  },
  {
    department_name: "Pharmacy Dispensary",
    load_percentage: 15,
    status_color: "bg-emerald-500"
  }
];

