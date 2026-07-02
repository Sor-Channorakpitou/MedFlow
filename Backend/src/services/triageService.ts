import prisma from "../lib/prisma.js";
import type { Prisma, TriageStatus } from "@prisma/client";

interface CreateTriageInput {
  appointmentId: number;
  userId: number;
  bloodPressure?: string | null;
  temperature?: number | null;
  weight?: number | null;
  heartRate?: number | null;
  urgencyLevel: TriageStatus;
  note?: string | null;
}

interface UpdateTriageInput {
  bloodPressure?: string | null;
  temperature?: number | null;
  weight?: number | null;
  heartRate?: number | null;
  urgencyLevel?: TriageStatus;
  note?: string | null;
}

// 1. Create Triage Record (POST)
export const createTriageRecord = async (data: CreateTriageInput) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: data.appointmentId }
  });
  if (!appointment) throw new Error("APPOINTMENT_NOT_FOUND");

  const existingTriage = await prisma.triage.findUnique({
    where: { appointmentId: data.appointmentId }
  });
  if (existingTriage) throw new Error("TRIAGE_ALREADY_EXISTS");

  return await prisma.$transaction(async (tx) => {
    const triage = await tx.triage.create({
      data: {
        appointmentId: data.appointmentId,
        userId: data.userId,
        bloodPressure: data.bloodPressure ?? null,
        temperature: data.temperature ?? null,
        weight: data.weight ?? null,
        heartRate: data.heartRate ?? null,
        urgencyLevel: data.urgencyLevel,
        note: data.note ?? null
      }
    });

    await tx.appointment.update({
      where: { id: data.appointmentId },
      data: { status: "CONFIRMED" }
    });

    return triage;
  });
};

// 2. Get Live Sorted Queue (GET /queue)
export const getSortedQueue = async (pagination?: { take?: number; skip?: number }) => {
  return await prisma.appointment.findMany({
    where: {
      status: "PENDING",
      triage: null
    },
    include: {
      patient: true,
      triage: true
    },
    orderBy: {
      createdAt: 'asc'
    },
    ...(pagination?.take !== undefined ? { take: pagination.take } : {}),
    ...(pagination?.skip !== undefined ? { skip: pagination.skip } : {})
  });
};




// 3. Get Triage by Appointment ID (GET /appointment/:id)
export const getTriageByAppointmentId = async (appointmentId: number) => {

  // if (!appointmentId || isNaN(appointmentId)) {
  //   throw new Error("Invalid or missing appointment sequence identifier");
  // }

  return await prisma.triage.findFirst({
    where: { appointmentId: Number(appointmentId) },
    include: {
      appointment: { include: { patient: true } }
    }
  });
};


// 4. Update Vitals or Urgency (FIXED: Pure type casting safety)
export const updateTriageRecord = async (appointmentId: number, updates: UpdateTriageInput) => {
  const existing = await prisma.triage.findUnique({ where: { appointmentId } });
  if (!existing) throw new Error("TRIAGE_RECORD_NOT_FOUND");

  const data: Prisma.TriageUpdateInput = {};

  if (updates.bloodPressure !== undefined) data.bloodPressure = updates.bloodPressure;
  if (updates.temperature !== undefined) data.temperature = updates.temperature;
  if (updates.weight !== undefined) data.weight = updates.weight;
  if (updates.heartRate !== undefined) data.heartRate = updates.heartRate;
  if (updates.urgencyLevel !== undefined) data.urgencyLevel = updates.urgencyLevel;
  if (updates.note !== undefined) data.note = updates.note;

  return await prisma.triage.update({
    where: { appointmentId },
    data
  });
};

