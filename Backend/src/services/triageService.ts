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
  requiredSpecialtyId?: number | null;
}

interface UpdateTriageInput {
  bloodPressure?: string | null;
  temperature?: number | null;
  weight?: number | null;
  heartRate?: number | null;
  urgencyLevel?: TriageStatus;
  note?: string | null;
  requiredSpecialtyId?: number | null;
}

// Urgency sort order: CRITICAL > HIGH > MEDIUM > LOW
const URGENCY_ORDER: Record<string, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

/**
 * Nurse claims a waiting triage patient.
 * Sets queue status to PROCESSING and assigns currentUserId.
 */
export const claimTriagePatient = async (queueId: number, nurseId: number) => {
  const queue = await prisma.queue.findUnique({
    where: { id: queueId },
  });

  if (!queue) throw new Error("QUEUE_NOT_FOUND");

  if (queue.stage !== "TRIAGE") throw new Error("QUEUE_NOT_IN_TRIAGE");

  if (queue.status !== "WAITING") throw new Error("QUEUE_ALREADY_CLAIMED");

  return prisma.queue.update({
    where: { id: queueId },
    data: {
      status: "PROCESSING",
      currentUserId: nurseId,
    },
    include: {
      patient: true,
      currentUser: {
        select: { id: true, name: true },
      },
    },
  });
};

/**
 * Create Triage Record.
 * Validates that the nurse has already claimed this patient's queue entry,
 * links the appointmentId to the queue, and forwards to the target specialty.
 * Workflow: TRIAGE/PROCESSING → DOCTOR/WAITING
 */
export const createTriageRecord = async (data: CreateTriageInput) => {
  let appointmentId = Number(data.appointmentId);

  if (!appointmentId || Number.isNaN(appointmentId)) {
    const queue = await prisma.queue.findFirst({
      where: {
        stage: "TRIAGE",
        status: "PROCESSING",
        currentUserId: data.userId,
      },
    });

    if (!queue) throw new Error("QUEUE_NOT_CLAIMED");

    if (queue.appointmentId) {
      appointmentId = queue.appointmentId;
    } else {
      const visit = await prisma.appointment.create({
        data: {
          patientId: queue.patientId,
          userId: data.userId,
          appointmentDate: new Date(),
          startTime: new Date(),
          endTime: new Date(Date.now() + 30 * 60 * 1000),
          status: "PENDING",
        },
      });
      appointmentId = visit.id;
    }
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) throw new Error("APPOINTMENT_NOT_FOUND");

  const existingTriage = await prisma.triage.findUnique({
    where: { appointmentId },
  });

  if (existingTriage) throw new Error("TRIAGE_ALREADY_EXISTS");

  const queue = await prisma.queue.findFirst({
    where: {
      patientId: appointment.patientId,
      stage: "TRIAGE",
      status: "PROCESSING",
      currentUserId: data.userId,
    },
  });

  if (!queue) throw new Error("QUEUE_NOT_CLAIMED");

  return prisma.$transaction(async (tx) => {
    const triage = await tx.triage.create({
      data: {
        appointmentId,
        userId: data.userId,
        bloodPressure: data.bloodPressure ?? null,
        temperature: data.temperature ?? null,
        weight: data.weight ?? null,
        heartRate: data.heartRate ?? null,
        urgencyLevel: data.urgencyLevel,
        note: data.note ?? null,
      },
      include: {
        appointment: {
          include: { patient: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await tx.queue.update({
      where: { id: queue.id },
      data: {
        stage: "DOCTOR",
        status: "WAITING",
        currentUserId: null,
        appointmentId,
        requiredSpecialtyId: data.requiredSpecialtyId ?? null,
      },
    });

    return triage;
  });
};

/**
 * Get all patients waiting for triage.
 * Sorted by urgency (CRITICAL first) then queueNumber asc.
 * Patients without a triage record yet don't have urgency — they sort last.
 */
export const getSortedQueue = async (
  pagination?: { take?: number; skip?: number }
) => {
  const queues = await prisma.queue.findMany({
    where: {
      stage: "TRIAGE",
      status: { in: ["WAITING", "PROCESSING"] },
    },
    include: {
      patient: true,
      appointment: {
        include: {
          triage: { select: { urgencyLevel: true } },
        },
      },
      currentUser: {
        select: { id: true, name: true },
      },
    },
    ...(pagination?.take !== undefined && { take: pagination.take }),
    ...(pagination?.skip !== undefined && { skip: pagination.skip }),
  });

  return queues.sort((a, b) => {
    const urgencyA = a.appointment?.triage?.urgencyLevel ?? null;
    const urgencyB = b.appointment?.triage?.urgencyLevel ?? null;

    const orderA = urgencyA !== null ? URGENCY_ORDER[urgencyA] ?? 99 : 99;
    const orderB = urgencyB !== null ? URGENCY_ORDER[urgencyB] ?? 99 : 99;

    if (orderA !== orderB) return orderA - orderB;
    return a.queueNumber - b.queueNumber;
  });
};

/**
 * Get triage by appointment
 */
export const getTriageByAppointmentId = async (appointmentId: number) => {
  return prisma.triage.findUnique({
    where: { appointmentId },
    include: {
      appointment: {
        include: { patient: true },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

/**
 * Update triage
 */
export const updateTriageRecord = async (appointmentId: number,updates: UpdateTriageInput) => {
  const existing = await prisma.triage.findUnique({
    where: { appointmentId },
  });

  if (!existing) throw new Error("TRIAGE_RECORD_NOT_FOUND");

  const data: Prisma.TriageUpdateInput = {};

  if (updates.bloodPressure !== undefined) data.bloodPressure = updates.bloodPressure;
  if (updates.temperature !== undefined) data.temperature = updates.temperature;
  if (updates.weight !== undefined) data.weight = updates.weight;
  if (updates.heartRate !== undefined) data.heartRate = updates.heartRate;
  if (updates.urgencyLevel !== undefined) data.urgencyLevel = updates.urgencyLevel;
  if (updates.note !== undefined) data.note = updates.note;

return prisma.$transaction(async (tx) => {
    const triage = await tx.triage.update({
      where: { appointmentId },
      data,
      include: {
        appointment: {
          include: { patient: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await tx.queue.updateMany({
      where: { appointmentId },
      data: {
        stage: "DOCTOR",
        status: "WAITING",
        currentUserId: null,
        requiredSpecialtyId: updates.requiredSpecialtyId ?? null,
      },
    });

    return triage;
  });
};
