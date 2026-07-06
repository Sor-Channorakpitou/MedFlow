import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const seedClinicalData = async () => {
  console.log("🌱 Injecting new clinical mock data...");

  try {
    // 1. Safely check or create Roles using findFirst
    let nurseRole = await prisma.role.findFirst({ where: { name: "NURSE" } });
    if (!nurseRole) {
      nurseRole = await prisma.role.create({ data: { name: "NURSE" } });
    }

    let doctorRole = await prisma.role.findFirst({ where: { name: "DOCTOR" } });
    if (!doctorRole) {
      doctorRole = await prisma.role.create({ data: { name: "DOCTOR" } });
    }

    // 2. Prepare default mock password
    const defaultPassword = await bcrypt.hash("MedFlow2026!", 10);

    // 3. Add or update your test Nurse
    let nurseUser = await prisma.user.findUnique({ where: { email: "nurse.dina@medflow.com" } });
    if (!nurseUser) {
      nurseUser = await prisma.user.create({
        data: {
          email: "nurse.dina@medflow.com",
          name: "Nurse Dina",
          passwordHash: defaultPassword,
          dateOfBirth: new Date("2000-01-01"),
          roleId: nurseRole.id,
          isActive: true
        }
      });
    }

    // 4. Add or update your test Doctor
    let doctorUser = await prisma.user.findUnique({ where: { email: "doctor.seyha@medflow.com" } });
    if (!doctorUser) {
      doctorUser = await prisma.user.create({
        data: {
          email: "doctor.seyha@medflow.com",
          name: "Dr. Seyha",
          passwordHash: defaultPassword,
          dateOfBirth: new Date("1990-05-15"),
          roleId: doctorRole.id,
          isActive: true
        }
      });
    }

    // 5. Check or create Patients using phone lookup instead of hardcoded ids
    let patientA = await prisma.patient.findFirst({ where: { phone: "011222333" } });
    if (!patientA) {
      patientA = await prisma.patient.create({
        data: {
          fullName: "Sombo Oudom",
          gender: "MALE",
          phone: "011222333",
          dateOfBirth: new Date("1992-05-20"),
          address: "Toul Kork, Phnom Penh"
        }
      });
    }

    let patientB = await prisma.patient.findFirst({ where: { phone: "099888777" } });
    if (!patientB) {
      patientB = await prisma.patient.create({
        data: {
          fullName: "Keo Sreymom",
          gender: "FEMALE",
          phone: "099888777",
          dateOfBirth: new Date("1995-08-14"),
          address: "Russei Keo, Phnom Penh"
        }
      });
    }

    // 6. Add fresh PENDING appointments for your Triage queue testing (ID 10 and 11)[cite: 1]
    await prisma.appointment.createMany({
      skipDuplicates: true,
      data: [
        {
          id: 10,
          reason: "Severe persistent migraine and blurry vision",
          appointmentDate: new Date(),
          startTime: new Date(),
          endTime: new Date(Date.now() + 30 * 60 * 1000),
          status: "PENDING", // Ready for your Triage POST endpoint![cite: 1]
          patientId: patientA.id,
          userId: nurseUser.id
        },
        {
          id: 11,
          reason: "Acute abdominal pain and violent vomiting",
          appointmentDate: new Date(),
          startTime: new Date(),
          endTime: new Date(Date.now() + 30 * 60 * 1000),
          status: "PENDING", // Ready for your Triage POST endpoint![cite: 1]
          patientId: patientB.id,
          userId: nurseUser.id
        }
      ]
    });

    console.log("✅ New clinical testing records inserted successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedClinicalData();