import { PrismaClient, Gender, Stage, QueueStatus, QueueAction, TriageStatus, AppointmentStatus, PaymentStatus, PrescriptionStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("\u{1F331} Seeding comprehensive test data...\n");

  const pwHash = await bcrypt.hash("MedFlow2026!", 10);

  // ─── Phase 1: Clean existing test data ───────────────────────────────
  console.log("  Phase 1: Cleaning existing data...");
  await prisma.$transaction([
    prisma.queueHistory.deleteMany(),
    prisma.prescriptionMedication.deleteMany(),
    prisma.invoiceItem.deleteMany(),
    prisma.prescription.deleteMany(),
    prisma.invoice.deleteMany(),
    prisma.medicalRecord.deleteMany(),
    prisma.triage.deleteMany(),
    prisma.queue.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.medication.deleteMany(),
  ]);
  console.log("  \u2705 Cleaned\n");

  // ─── Phase 2: Base data (Roles, Specialties, Users) ─────────────────
  console.log("  Phase 2: Seeding base data...");

  const roleNames = ["ADMIN", "RECEPTIONIST", "NURSE", "DOCTOR", "PHARMACIST"];
  const roles: Record<string, number> = {};
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { id: roleNames.indexOf(name) + 1 },
      create: { name },
      update: {},
    });
    roles[name] = role.id;
  }

  const specialtyNames = ["General Practice", "Cardiology", "Pediatrics", "Orthopedics"];
  const specialties: Record<string, number> = {};
  for (const name of specialtyNames) {
    const specialty = await prisma.specialty.upsert({
      where: { name },
      create: { name },
      update: {},
    });
    specialties[name] = specialty.id;
  }

  const defaultDob = new Date("1990-01-01");
  const usersData = [
    { email: "admin@medflow.com",        name: "Admin User",      password: "Admin@123",  role: "ADMIN",        specialtyId: null },
    { email: "receptionist@medflow.com", name: "Reception Staff", password: "Recep@123",  role: "RECEPTIONIST", specialtyId: null },
    { email: "nurse@medflow.com",        name: "Nurse Dina",      password: "Nurse@123",  role: "NURSE",        specialtyId: null },
    { email: "doctor@medflow.com",       name: "Dr. Seyha",       password: "Doctor@123", role: "DOCTOR",       specialtyId: specialties["General Practice"] },
    { email: "pharmacist@medflow.com",   name: "Pharmacist Chan", password: "Pharma@123", role: "PHARMACIST",   specialtyId: null },
    { email: "e.vance@medflow.com",      name: "Dr. Emily Vance", password: "Doctor@123", role: "DOCTOR",       specialtyId: specialties["Cardiology"] },
    { email: "j.nurse@medflow.com",      name: "Nurse Jackie",    password: "Nurse@123",  role: "NURSE",        specialtyId: null },
  ];

  const users: Record<string, number> = {};
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      create: {
        email: u.email,
        name: u.name,
        passwordHash: u.role === "ADMIN" || u.role === "RECEPTIONIST" || u.role === "PHARMACIST"
          ? await bcrypt.hash(u.password, 10) : pwHash,
        dateOfBirth: defaultDob,
        roleId: roles[u.role]!,
        specialtyId: u.specialtyId ?? null,
        isActive: true,
      },
      update: {},
    });
    users[u.email] = user.id;
  }
  console.log("  \u2705 Base data seeded\n");

  // ─── Phase 3: Medications (10) ──────────────────────────────────────
  console.log("  Phase 3: Seeding medications...");

  const medicationData = [
    { name: "Amoxicillin 500mg",     description: "Broad-spectrum antibiotic",                           stockQuantity: 500, unitPrice: 0.50 },
    { name: "Paracetamol 500mg",     description: "Analgesic and antipyretic",                          stockQuantity: 1000, unitPrice: 0.25 },
    { name: "Lisinopril 10mg",       description: "ACE inhibitor for hypertension",                     stockQuantity: 300, unitPrice: 0.75 },
    { name: "Metformin 850mg",       description: "First-line medication for type 2 diabetes",          stockQuantity: 400, unitPrice: 0.60 },
    { name: "Albuterol HFA Inhaler", description: "Bronchodilator for asthma/COPD",                     stockQuantity: 100, unitPrice: 15.00 },
    { name: "Ibuprofen 400mg",       description: "NSAID for pain and inflammation",                    stockQuantity: 800, unitPrice: 0.30 },
    { name: "Omeprazole 20mg",       description: "Proton pump inhibitor for GERD",                     stockQuantity: 350, unitPrice: 0.55 },
    { name: "Atorvastatin 10mg",     description: "Statin for cholesterol management",                  stockQuantity: 250, unitPrice: 0.80 },
    { name: "Azithromycin 250mg",    description: "Macrolide antibiotic for respiratory infections",    stockQuantity: 200, unitPrice: 1.20 },
    { name: "Losartan 50mg",         description: "ARB for hypertension and kidney protection",         stockQuantity: 280, unitPrice: 0.65 },
  ];

  await prisma.medication.createMany({ data: medicationData, skipDuplicates: true });
  const meds = await prisma.medication.findMany();
  const medMap: Record<string, number> = {};
  for (const m of meds) medMap[m.name] = m.id;
  console.log("  \u2705 10 medications seeded\n");

  // ─── Phase 4: Patients (25) ─────────────────────────────────────────
  console.log("  Phase 4: Seeding patients...");

  const patientData = [
    { fullName: "Benjamin Carter",   gender: Gender.MALE,   phone: "+1-555-0001", DOB: "1992-04-15", address: "742 Evergreen Terrace" },
    { fullName: "Sarah Jenkins",     gender: Gender.FEMALE, phone: "+1-555-0002", DOB: "1998-11-23", address: "1022 Birch Lane" },
    { fullName: "Marcus Thorne",     gender: Gender.MALE,   phone: "+1-555-0003", DOB: "1981-07-02", address: "55 NW Ridge Road" },
    { fullName: "Elena Rodriguez",   gender: Gender.FEMALE, phone: "+1-555-0004", DOB: "1974-01-30", address: "988 Oak Drive" },
    { fullName: "Liam O'Connor",     gender: Gender.MALE,   phone: "+1-555-0005", DOB: "2003-09-11", address: "14 Willow Court" },
    { fullName: "Olivia Martinez",   gender: Gender.FEMALE, phone: "+1-555-0006", DOB: "1995-05-19", address: "404 Pine Avenue" },
    { fullName: "Ethan Choi",        gender: Gender.MALE,   phone: "+1-555-0007", DOB: "2014-12-05", address: "223 Maple Boulevard" },
    { fullName: "Sophia Al-Mansoor", gender: Gender.FEMALE, phone: "+1-555-0008", DOB: "1997-03-27", address: "87 Desert Oasis Way" },
    { fullName: "Lucas Dubois",      gender: Gender.MALE,   phone: "+1-555-0009", DOB: "1965-02-14", address: "61 Rue de Gare" },
    { fullName: "Emma Watson",       gender: Gender.FEMALE, phone: "+1-555-0010", DOB: "2000-04-15", address: "12 Grimmauld Place" },
    { fullName: "Jackson Briggs",    gender: Gender.MALE,   phone: "+1-555-0011", DOB: "1987-10-31", address: "505 Kombat Lane" },
    { fullName: "Mia Tanaka",        gender: Gender.FEMALE, phone: "+1-555-0012", DOB: "1985-08-08", address: "33 Sakura Station" },
    { fullName: "Aiden Gallagher",   gender: Gender.MALE,   phone: "+1-555-0013", DOB: "2007-01-18", address: "88 Umbrella Academy" },
    { fullName: "Chloe Bourgeois",   gender: Gender.FEMALE, phone: "+1-555-0014", DOB: "2009-06-01", address: "1 Grand Paris Hotel" },
    { fullName: "Zayn Malik",        gender: Gender.MALE,   phone: "+1-555-0015", DOB: "1993-01-12", address: "1 Direction Highway" },
    { fullName: "Amelia Earhart",    gender: Gender.FEMALE, phone: "+1-555-0016", DOB: "1982-07-24", address: "500 Clouds Way" },
    { fullName: "David Wilson",      gender: Gender.MALE,   phone: "+1-555-0017", DOB: "1976-05-11", address: "321 River Road" },
    { fullName: "Harper Lee",        gender: Gender.FEMALE, phone: "+1-555-0018", DOB: "1959-04-28", address: "42 Mockingbird Lane" },
    { fullName: "Noah Centineo",     gender: Gender.MALE,   phone: "+1-555-0019", DOB: "2001-05-09", address: "12 Hollywood Blvd" },
    { fullName: "Isabella Swan",     gender: Gender.FEMALE, phone: "+1-555-0020", DOB: "2005-09-13", address: "100 Forks Woods Rd" },
    { fullName: "Arthur Pendragon",  gender: Gender.MALE,   phone: "+1-555-0021", DOB: "1988-12-25", address: "1 Camelot Castle" },
    { fullName: "Clara Oswald",      gender: Gender.FEMALE, phone: "+1-555-0022", DOB: "1999-03-05", address: "77 Souffle Way" },
    { fullName: "Bruce Banner",      gender: Gender.MALE,   phone: "+1-555-0023", DOB: "1977-12-18", address: "45 Gamma Lab Compound" },
    { fullName: "Tony Stark",        gender: Gender.MALE,   phone: "+1-555-0024", DOB: "1978-05-29", address: "10880 Malibu Point" },
    { fullName: "Wanda Maximoff",    gender: Gender.FEMALE, phone: "+1-555-0025", DOB: "1996-02-10", address: "280 Westview Terrace" },
  ];

  const patientPhones = patientData.map(p => p.phone);
  await prisma.patient.createMany({
    data: patientData.map(p => ({
      fullName: p.fullName,
      gender: p.gender,
      phone: p.phone,
      dateOfBirth: new Date(p.DOB),
      address: p.address,
    })),
    skipDuplicates: true,
  });

  const patients = await prisma.patient.findMany({ where: { phone: { in: patientPhones } }, orderBy: { id: "asc" } });
  const patientByPhone: Record<string, number> = {};
  for (const p of patients) patientByPhone[p.phone] = p.id;
  console.log(`  \u2705 ${patients.length} patients seeded\n`);

  // ─── Phase 5: Appointments (25) ─────────────────────────────────────
  console.log("  Phase 5: Seeding appointments...");

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const appointmentData = [
    { phone: "+1-555-0001", reason: "Cardiology Follow-up",        userEmail: "doctor@medflow.com",   hour: 9,  min: 15 },
    { phone: "+1-555-0002", reason: "General Checkup",             userEmail: "doctor@medflow.com",   hour: 9,  min: 30 },
    { phone: "+1-555-0003", reason: "Lab Diagnostics",             userEmail: "e.vance@medflow.com",  hour: 10, min: 0  },
    { phone: "+1-555-0004", reason: "Consultation",                userEmail: "doctor@medflow.com",   hour: 10, min: 15 },
    { phone: "+1-555-0005", reason: "Physical Therapy",            userEmail: "e.vance@medflow.com",  hour: 10, min: 30 },
    { phone: "+1-555-0006", reason: "General Checkup",             userEmail: "doctor@medflow.com",   hour: 10, min: 45 },
    { phone: "+1-555-0007", reason: "Pediatric Care",              userEmail: "e.vance@medflow.com",  hour: 11, min: 0  },
    { phone: "+1-555-0008", reason: "Dermatology Review",          userEmail: "doctor@medflow.com",   hour: 11, min: 15 },
    { phone: "+1-555-0009", reason: "Geriatric Follow-up",         userEmail: "doctor@medflow.com",   hour: 11, min: 30 },
    { phone: "+1-555-0010", reason: "Prenatal Care",               userEmail: "e.vance@medflow.com",  hour: 11, min: 45 },
    { phone: "+1-555-0011", reason: "Orthopedic Exam",             userEmail: "doctor@medflow.com",   hour: 13, min: 0  },
    { phone: "+1-555-0012", reason: "General Checkup",             userEmail: "e.vance@medflow.com",  hour: 13, min: 15 },
    { phone: "+1-555-0013", reason: "Flu Symptoms Check",          userEmail: "doctor@medflow.com",   hour: 14, min: 0  },
    { phone: "+1-555-0014", reason: "Neurology Consultation",      userEmail: "e.vance@medflow.com",  hour: 14, min: 15 },
    { phone: "+1-555-0015", reason: "Allergy Testing",             userEmail: "doctor@medflow.com",   hour: 14, min: 30 },
    { phone: "+1-555-0016", reason: "Hypertension Follow-up",      userEmail: "doctor@medflow.com",   hour: 9,  min: 0  },
    { phone: "+1-555-0017", reason: "Diabetes Screening",          userEmail: "e.vance@medflow.com",  hour: 9,  min: 5  },
    { phone: "+1-555-0018", reason: "Chronic Pain Management",     userEmail: "doctor@medflow.com",   hour: 9,  min: 10 },
    { phone: "+1-555-0019", reason: "Sports Injury Assessment",    userEmail: "e.vance@medflow.com",  hour: 9,  min: 20 },
    { phone: "+1-555-0020", reason: "Asthma Review",               userEmail: "doctor@medflow.com",   hour: 9,  min: 25 },
    { phone: "+1-555-0021", reason: "Severe Migraine",             userEmail: "doctor@medflow.com",   hour: 8,  min: 30 },
    { phone: "+1-555-0022", reason: "Abdominal Discomfort",        userEmail: "e.vance@medflow.com",  hour: 8,  min: 45 },
    { phone: "+1-555-0023", reason: "High Stress Assessment",      userEmail: "doctor@medflow.com",   hour: 9,  min: 0  },
    { phone: "+1-555-0024", reason: "Cardiac Rhythm Review",       userEmail: "doctor@medflow.com",   hour: 8,  min: 15 },
    { phone: "+1-555-0025", reason: "Insomnia Consultation",       userEmail: "e.vance@medflow.com",  hour: 8,  min: 30 },
  ];

  await prisma.appointment.createMany({
    data: appointmentData
      .map(a => {
        const start = new Date(`${todayStr}T${String(a.hour).padStart(2, "0")}:${String(a.min).padStart(2, "0")}:00`);
        const patientId = patientByPhone[a.phone];
        const userId = users[a.userEmail];
        if (!patientId || !userId) return null;
        return {
          reason: a.reason,
          appointmentDate: start,
          startTime: start,
          endTime: new Date(start.getTime() + 30 * 60 * 1000),
          status: AppointmentStatus.PENDING,
          patientId,
          userId,
        };
      })
      .filter((item) => item !== null),
  });

  const appointments = await prisma.appointment.findMany({ orderBy: { id: "asc" } });
  const appointmentByPhone: Record<string, number> = {};
  for (let i = 0; i < appointments.length && i < appointmentData.length; i++) {
    const appointment = appointmentData[i];
    const record = appointments[i];
    if (appointment && record) {
      appointmentByPhone[appointment.phone] = record.id;
    }
  }
  console.log(`  \u2705 ${appointments.length} appointments seeded\n`);

  // ─── Phase 6: Queue (25) ────────────────────────────────────────────
  console.log("  Phase 6: Seeding queue entries...");

  const RECEPTION_PHONES = patientPhones.slice(0, 15);
  const TRIAGE_PHONES = patientPhones.slice(15, 20);
  const DOCTOR_PHONES = patientPhones.slice(20, 23);
  const PHARMACY_PHONES = patientPhones.slice(23, 25);

  type StageDef = Stage;
  const queueData: { phone: string; stage: StageDef; queueNumber: number; currentUserEmail: string; specialtyName: string | null }[] = [
    ...RECEPTION_PHONES.map((phone, i) => ({ phone, stage: "RECEPTION" as StageDef, queueNumber: 1001 + i, currentUserEmail: "receptionist@medflow.com", specialtyName: null })),
    ...TRIAGE_PHONES.map((phone, i) => ({ phone, stage: "TRIAGE" as StageDef, queueNumber: 1016 + i, currentUserEmail: "nurse@medflow.com", specialtyName: null })),
    ...DOCTOR_PHONES.map((phone, i) => ({ phone, stage: "DOCTOR" as StageDef, queueNumber: 1021 + i, currentUserEmail: i === 0 ? "doctor@medflow.com" : "e.vance@medflow.com", specialtyName: i === 1 ? "Cardiology" : null })),
    ...PHARMACY_PHONES.map((phone, i) => ({ phone, stage: "PHARMACY" as StageDef, queueNumber: 1024 + i, currentUserEmail: "pharmacist@medflow.com", specialtyName: null })),
  ];

  await prisma.queue.createMany({
    data: queueData
      .map(q => ({
        patientId: patientByPhone[q.phone],
        stage: q.stage,
        status: QueueStatus.WAITING,
        appointmentId: appointmentByPhone[q.phone],
        queueNumber: q.queueNumber,
        requiredSpecialtyId: q.specialtyName ? specialties[q.specialtyName] ?? null : null,
        currentUserId: users[q.currentUserEmail],
      }))
      .filter((it): it is NonNullable<typeof it & { patientId: number; appointmentId: number | null; currentUserId: number; requiredSpecialtyId: number | null }> =>
        typeof it.patientId === "number" &&
        typeof it.currentUserId === "number" &&
        (typeof it.appointmentId === "number" || it.appointmentId === null) &&
        typeof it.requiredSpecialtyId !== "undefined",
      ),
    skipDuplicates: true,
  });

  const queueByPhone: Record<string, number> = {};
  const allQueues = await prisma.queue.findMany({ orderBy: { queueNumber: "asc" } });
  for (const q of allQueues) {
    const patient = patients.find(p => p.id === q.patientId);
    if (patient) queueByPhone[patient.phone] = q.id;
  }
  console.log(`  \u2705 ${allQueues.length} queue entries seeded\n`);

  // ─── Phase 7: QueueHistory (~49 entries) ────────────────────────────
  console.log("  Phase 7: Seeding queue history...");

  const historyData: { queueId: number; userId: number; action: QueueAction; fromStage: Stage | null; toStage: Stage }[] = [];

  for (const phone of RECEPTION_PHONES) {
    const qId = queueByPhone[phone];
    if (!qId) continue;
    historyData.push({ queueId: qId, userId: users["receptionist@medflow.com"]!, action: QueueAction.START, fromStage: null, toStage: "RECEPTION" });
  }

  for (const phone of TRIAGE_PHONES) {
    const qId = queueByPhone[phone];
    if (!qId) continue;
    historyData.push(
      { queueId: qId, userId: users["receptionist@medflow.com"]!, action: QueueAction.START, fromStage: null, toStage: "RECEPTION" },
      { queueId: qId, userId: users["nurse@medflow.com"]!, action: QueueAction.TRANSFER, fromStage: "RECEPTION", toStage: "TRIAGE" },
    );
  }

  for (const phone of DOCTOR_PHONES) {
    const qId = queueByPhone[phone];
    if (!qId) continue;
    historyData.push(
      { queueId: qId, userId: users["receptionist@medflow.com"]!, action: QueueAction.START, fromStage: null, toStage: "RECEPTION" },
      { queueId: qId, userId: users["nurse@medflow.com"]!, action: QueueAction.TRANSFER, fromStage: "RECEPTION", toStage: "TRIAGE" },
      { queueId: qId, userId: users["nurse@medflow.com"]!, action: QueueAction.COMPLETE, fromStage: "TRIAGE", toStage: "TRIAGE" },
      { queueId: qId, userId: users["nurse@medflow.com"]!, action: QueueAction.TRANSFER, fromStage: "TRIAGE", toStage: "DOCTOR" },
    );
  }

  for (const phone of PHARMACY_PHONES) {
    const qId = queueByPhone[phone];
    if (!qId) continue;
    historyData.push(
      { queueId: qId, userId: users["receptionist@medflow.com"]!, action: QueueAction.START, fromStage: null, toStage: "RECEPTION" },
      { queueId: qId, userId: users["nurse@medflow.com"]!, action: QueueAction.TRANSFER, fromStage: "RECEPTION", toStage: "TRIAGE" },
      { queueId: qId, userId: users["nurse@medflow.com"]!, action: QueueAction.COMPLETE, fromStage: "TRIAGE", toStage: "TRIAGE" },
      { queueId: qId, userId: users["nurse@medflow.com"]!, action: QueueAction.TRANSFER, fromStage: "TRIAGE", toStage: "DOCTOR" },
      { queueId: qId, userId: users["doctor@medflow.com"]!, action: QueueAction.COMPLETE, fromStage: "DOCTOR", toStage: "DOCTOR" },
      { queueId: qId, userId: users["doctor@medflow.com"]!, action: QueueAction.TRANSFER, fromStage: "DOCTOR", toStage: "PHARMACY" },
    );
  }

  await prisma.queueHistory.createMany({ data: historyData });
  console.log(`  \u2705 ${historyData.length} queue history entries seeded\n`);

  // ─── Phase 8: Triage (10) ───────────────────────────────────────────
  console.log("  Phase 8: Seeding triage records...");

  const triagePatients = [...TRIAGE_PHONES, ...DOCTOR_PHONES, ...PHARMACY_PHONES];
  const triageVitals = [
    { phone: "+1-555-0016", bp: "130/85",  temp: 37.1, hr: 78,  weight: 82, urgency: TriageStatus.MEDIUM,  note: "Patient reports recurring headaches with visual aura" },
    { phone: "+1-555-0017", bp: "145/92",  temp: 36.8, hr: 72,  weight: 91, urgency: TriageStatus.HIGH,    note: "Elevated BP readings. History of type 2 diabetes" },
    { phone: "+1-555-0018", bp: "118/74",  temp: 36.5, hr: 65,  weight: 63, urgency: TriageStatus.LOW,      note: "Chronic lower back pain. No acute distress" },
    { phone: "+1-555-0019", bp: "125/80",  temp: 37.0, hr: 88,  weight: 75, urgency: TriageStatus.MEDIUM,   note: "Ankle swelling after basketball game. Possible sprain" },
    { phone: "+1-555-0020", bp: "110/72",  temp: 36.9, hr: 92,  weight: 55, urgency: TriageStatus.MEDIUM,   note: "Mild wheezing. Peak flow at 75% of personal best" },
    { phone: "+1-555-0021", bp: "135/88",  temp: 37.1, hr: 78,  weight: 82, urgency: TriageStatus.MEDIUM,   note: "Blinding aura alongside left-hemisphere headache" },
    { phone: "+1-555-0022", bp: "115/70",  temp: 38.2, hr: 64,  weight: 58, urgency: TriageStatus.HIGH,     note: "Acute tenderness in lower quadrant. Low fever noted" },
    { phone: "+1-555-0023", bp: "150/95",  temp: 36.9, hr: 110, weight: 95, urgency: TriageStatus.LOW,      note: "Extremely high resting heart rate. Possible panic response" },
    { phone: "+1-555-0024", bp: "122/80",  temp: 36.5, hr: 70,  weight: 80, urgency: TriageStatus.MEDIUM,   note: "History of arrhythmias. On beta-blockers" },
    { phone: "+1-555-0025", bp: "110/72",  temp: 36.7, hr: 85,  weight: 55, urgency: TriageStatus.CRITICAL, note: "Severe disruptions to circadian cycles. Chronic insomnia" },
  ];

  await prisma.triage.createMany({
    data: triageVitals
      .map(t => ({
        bloodPressure: t.bp,
        temperature: t.temp,
        weight: t.weight,
        heartRate: t.hr,
        urgencyLevel: t.urgency,
        note: t.note,
        appointmentId: appointmentByPhone[t.phone],
        userId: users["nurse@medflow.com"],
      }))
      .filter((it): it is NonNullable<typeof it & { appointmentId: number; userId: number }> => typeof it.appointmentId === "number" && typeof it.userId === "number"),
    skipDuplicates: true,
  });
  console.log(`  \u2705 ${triageVitals.length} triage records seeded\n`);

  // ─── Phase 9: Medical Records (5) ───────────────────────────────────
  console.log("  Phase 9: Seeding medical records...");

  const doctorNotePatients = [...DOCTOR_PHONES, ...PHARMACY_PHONES];
  const soapNotes = [
    { phone: "+1-555-0021", diagnosis: "Migraine with aura (G43.1)", notes: "S: Patient reports severe unilateral throbbing headache preceded by visual aura lasting 20 min. Photophobia and phonophobia present.\nO: BP 135/88, HR 78. Cranial nerves II-XII intact. No nuchal rigidity.\nA: Classic migraine with typical aura. No signs of TIA or stroke.\nP: Prescribe sumatriptan 50mg PRN. Recommend sleep hygiene and trigger journal. Follow up in 2 weeks." },
    { phone: "+1-555-0022", diagnosis: "Acute appendicitis (K35.8)", notes: "S: Sharp right lower quadrant pain started 6 hours ago, migrated from periumbilical area. Nausea and vomiting. Low-grade fever.\nO: Temp 38.2\u00b0C. Tenderness at McBurney's point. Positive Rovsing sign. WBC 14,000.\nA: Clinical presentation consistent with acute appendicitis.\nP: Refer to general surgery for emergency appendectomy. NPO. Start IV antibiotics." },
    { phone: "+1-555-0023", diagnosis: "Generalized anxiety disorder (F41.1)", notes: "S: Patient reports overwhelming stress, racing thoughts, palpitations. Difficulty concentrating at work. Sleep disrupted.\nO: BP 150/95, HR 110. Alert and oriented. Speech pressured. GAD-7 score: 18 (severe).\nA: Generalized anxiety disorder with somatic symptoms.\nP: Start sertraline 50mg daily. Refer to cognitive behavioral therapy. Follow up in 4 weeks." },
    { phone: "+1-555-0024", diagnosis: "Atrial fibrillation with hypertension (I48.0, I10)", notes: "S: Patient reports intermittent palpitations, mild shortness of breath. Known hypertensive.\nO: BP 122/80, HR 70 (irregularly irregular). ECG shows atrial fibrillation. CHA2DS2-VASc: 2.\nA: Paroxysmal atrial fibrillation in the setting of hypertension.\nP: Start rivaroxaban 20mg daily for stroke prevention. Continue lisinopril. Consider cardioversion if symptomatic. Follow up in 1 month." },
    { phone: "+1-555-0025", diagnosis: "Chronic insomnia disorder (G47.0)", notes: "S: Patient reports difficulty falling asleep and staying asleep for 6 months. Daytime fatigue. Mood irritability.\nO: BP 110/72, HR 85. Alert. PHQ-9: 8 (mild depressive symptoms).\nA: Chronic insomnia disorder with mild depressive symptoms.\nP: Sleep hygiene education. Start trazodone 50mg at bedtime. Refer for CBT-I. Avoid caffeine after 2 PM. Follow up in 1 month." },
  ];

  await prisma.medicalRecord.createMany({
    data: soapNotes
      .map(s => ({
        diagnosis: s.diagnosis,
        notes: s.notes,
        visitDate: new Date(),
        userId: users["doctor@medflow.com"],
        patientId: patientByPhone[s.phone],
        appointmentId: appointmentByPhone[s.phone],
      }))
      .filter((it): it is NonNullable<typeof it & { userId: number; patientId: number; appointmentId: number }> =>
        typeof it.userId === "number" && typeof it.patientId === "number" && typeof it.appointmentId === "number"),
    skipDuplicates: true,
  });

  const medRecords = await prisma.medicalRecord.findMany({
    where: { appointmentId: { in: doctorNotePatients.map(p => appointmentByPhone[p]).filter((v): v is number => typeof v === 'number') } },
  });
  const medRecordByPhone: Record<string, number> = {};
  for (const mr of medRecords) {
    const apt = appointments.find(a => a.id === mr.appointmentId);
    if (apt) {
      const p = patientData.find(pd => patientByPhone[pd.phone] === apt.patientId);
      if (p) medRecordByPhone[p.phone] = mr.id;
    }
  }
  console.log(`  \u2705 ${medRecords.length} medical records seeded\n`);

  // ─── Phase 10: Prescriptions (2) + PrescriptionMedication (5) ──────
  console.log("  Phase 10: Seeding prescriptions...");

  const prescData = [
    { phone: "+1-555-0024", patientPhone: "+1-555-0024", diagnosis: "Atrial fibrillation with hypertension" },
    { phone: "+1-555-0025", patientPhone: "+1-555-0025", diagnosis: "Chronic insomnia disorder" },
  ];

  await prisma.prescription.createMany({
    data: prescData
      .map(p => ({
        status: PrescriptionStatus.SENT,
        userId: users["doctor@medflow.com"],
        patientId: patientByPhone[p.patientPhone],
        appointmentId: appointmentByPhone[p.phone],
        medicalRecordId: medRecordByPhone[p.phone],
      }))
      .filter((it): it is NonNullable<typeof it & { userId: number; patientId: number; appointmentId: number | null; medicalRecordId: number | null }> => typeof it.userId === "number" && typeof it.patientId === "number" && (typeof it.appointmentId === 'number' || it.appointmentId === null) && (typeof it.medicalRecordId === 'number' || it.medicalRecordId === null)),
    skipDuplicates: true,
  });

  const prescriptions = await prisma.prescription.findMany({
    where: { appointmentId: { in: PHARMACY_PHONES.map(p => appointmentByPhone[p]).filter((v): v is number => typeof v === 'number') } },
  });
  const prescByPhone: Record<string, number> = {};
  for (const pr of prescriptions) {
    const apt = appointments.find(a => a.id === pr.appointmentId);
    if (apt) {
      const p = patientData.find(pd => patientByPhone[pd.phone] === apt.patientId);
      if (p) prescByPhone[p.phone] = pr.id;
    }
  }

  const prescItemData = [
    { prescPhone: "+1-555-0024", medName: "Lisinopril 10mg",       dosage: 10, frequency: 1, duration: "30 days" },
    { prescPhone: "+1-555-0024", medName: "Atorvastatin 10mg",     dosage: 10, frequency: 1, duration: "30 days" },
    { prescPhone: "+1-555-0025", medName: "Paracetamol 500mg",     dosage: 500, frequency: 3, duration: "7 days" },
    { prescPhone: "+1-555-0025", medName: "Omeprazole 20mg",       dosage: 20, frequency: 1, duration: "14 days" },
    { prescPhone: "+1-555-0025", medName: "Ibuprofen 400mg",       dosage: 400, frequency: 2, duration: "5 days" },
  ];

  await prisma.prescriptionMedication.createMany({
    data: prescItemData
      .map(p => ({
        medicationId: medMap[p.medName],
        prescriptionId: prescByPhone[p.prescPhone],
        dosage: p.dosage,
        frequency: p.frequency,
        duration: p.duration,
      }))
      .filter((it): it is NonNullable<typeof it & { medicationId: number; prescriptionId: number }> => typeof it.medicationId === 'number' && typeof it.prescriptionId === 'number'),
  });
  console.log(`  \u2705 ${prescriptions.length} prescriptions, ${prescItemData.length} medication items seeded\n`);

  // ─── Phase 11: Invoices (2) + Invoice Items (5) ────────────────────
  console.log("  Phase 11: Seeding invoices...");

  const invoiceData = [
    { phone: "+1-555-0024", totalAmount: 175.00, method: "Cash",           status: PaymentStatus.UNPAID },
    { phone: "+1-555-0025", totalAmount: 95.00,  method: "Credit Card",    status: PaymentStatus.UNPAID },
  ];

  await prisma.invoice.createMany({
    data: invoiceData
      .map(inv => ({
        paymentMethod: inv.method,
        issuedDate: new Date(),
        paymentStatus: inv.status,
        totalAmount: inv.totalAmount,
        appointmentId: appointmentByPhone[inv.phone],
        patientId: patientByPhone[inv.phone],
        userId: users["receptionist@medflow.com"],
      }))
      .filter((it): it is NonNullable<typeof it & { appointmentId: number; patientId: number; userId: number }> => typeof it.appointmentId === 'number' && typeof it.patientId === 'number' && typeof it.userId === 'number'),
    skipDuplicates: true,
  });

  const invoices = await prisma.invoice.findMany({
    where: { appointmentId: { in: PHARMACY_PHONES.map(p => appointmentByPhone[p]).filter((v): v is number => typeof v === 'number') } },
    orderBy: { id: "asc" },
  });
  const invoiceByPhone: Record<string, number> = {};
  for (const inv of invoices) {
    const apt = appointments.find(a => a.id === inv.appointmentId);
    if (apt) {
      const p = patientData.find(pd => patientByPhone[pd.phone] === apt.patientId);
      if (p) invoiceByPhone[p.phone] = inv.id;
    }
  }

  const invItemData = [
    { invPhone: "+1-555-0024", desc: "Consultation Fee - Cardiology",       type: "Service",   qty: 1, unitPrice: 60.00,  subTotal: 60.00 },
    { invPhone: "+1-555-0024", desc: "ECG Procedure",                       type: "Procedure", qty: 1, unitPrice: 75.00,  subTotal: 75.00 },
    { invPhone: "+1-555-0024", desc: "Medication - Lisinopril 10mg (30)",   type: "Medication", qty: 30, unitPrice: 0.75,  subTotal: 22.50 },
    { invPhone: "+1-555-0024", desc: "Medication - Atorvastatin 10mg (30)", type: "Medication", qty: 30, unitPrice: 0.80,  subTotal: 24.00 },
    { invPhone: "+1-555-0025", desc: "Consultation Fee - General",          type: "Service",   qty: 1, unitPrice: 50.00,  subTotal: 50.00 },
    { invPhone: "+1-555-0025", desc: "Medication - Trazodone 50mg (30)",    type: "Medication", qty: 30, unitPrice: 1.50,  subTotal: 45.00 },
  ];

  await prisma.invoiceItem.createMany({
    data: invItemData
      .map(item => ({
        description: item.desc,
        type: item.type,
        quantity: item.qty,
        unitPrice: item.unitPrice,
        subTotal: item.subTotal,
        invoiceId: invoiceByPhone[item.invPhone],
      }))
      .filter((it): it is NonNullable<typeof it & { invoiceId: number }> => typeof it.invoiceId === 'number'),
  });

  // Update totals to match item sums
  const sums = invItemData.reduce((acc, item) => {
    acc[item.invPhone] = (acc[item.invPhone] || 0) + item.subTotal;
    return acc;
  }, {} as Record<string, number>);

  for (const [phone, total] of Object.entries(sums)) {
    const invId = invoiceByPhone[phone];
    if (invId) {
      await prisma.invoice.update({ where: { id: invId }, data: { totalAmount: total } });
    }
  }

  console.log(`  \u2705 ${invoices.length} invoices, ${invItemData.length} invoice items seeded\n`);

  // ─── Summary ────────────────────────────────────────────────────────
  console.log("\u{1F331} Comprehensive seeding complete!");
  console.log("─────────────────────────────────────────────────────");
  console.log("  Inserted records:");
  console.log(`    Roles:              ${roleNames.length}`);
  console.log(`    Specialties:        ${specialtyNames.length}`);
  console.log(`    Users:              ${usersData.length}`);
  console.log(`    Medications:        ${medicationData.length}`);
  console.log(`    Patients:           ${patients.length}`);
  console.log(`    Appointments:       ${appointments.length}`);
  console.log(`    Queue entries:      ${allQueues.length}`);
  console.log(`    Queue history:      ${historyData.length}`);
  console.log(`    Triage records:     ${triageVitals.length}`);
  console.log(`    Medical records:    ${medRecords.length}`);
  console.log(`    Prescriptions:      ${prescriptions.length}`);
  console.log(`    Prescription items: ${prescItemData.length}`);
  console.log(`    Invoices:           ${invoices.length}`);
  console.log(`    Invoice items:      ${invItemData.length}`);
  console.log("─────────────────────────────────────────────────────");
  const grandTotal =
    roleNames.length + specialtyNames.length + usersData.length +
    medicationData.length + patients.length + appointments.length +
    allQueues.length + historyData.length + triageVitals.length +
    medRecords.length + prescriptions.length + prescItemData.length +
    invoices.length + invItemData.length;
  console.log(`  Grand total:        ${grandTotal} records`);
  console.log("─────────────────────────────────────────────────────");
  console.log("\n  Login credentials (same as seed.ts):");
  console.log("  admin@medflow.com           Admin@123 (ADMIN)");
  console.log("  receptionist@medflow.com    Recep@123 (RECEPTIONIST)");
  console.log("  nurse@medflow.com           MedFlow2026! (NURSE)");
  console.log("  doctor@medflow.com          Doctor@123 (DOCTOR)");
  console.log("  e.vance@medflow.com         Doctor@123 (DOCTOR)");
  console.log("  j.nurse@medflow.com         Nurse@123 (NURSE)");
  console.log("  pharmacist@medflow.com      Pharma@123 (PHARMACIST)");
}

main()
  .catch((e) => { console.error("\u274C Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());