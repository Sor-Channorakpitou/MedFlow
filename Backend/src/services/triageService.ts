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

/**
 * Create Triage Record
 * Workflow:
 * Appointment -> Triage -> Queue moves to DOCTOR
 */
export const createTriageRecord = async (data: CreateTriageInput) => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: data.appointmentId
    }
  });

  if (!appointment) {
    throw new Error("APPOINTMENT_NOT_FOUND");
  }

  const existingTriage = await prisma.triage.findUnique({
    where: {
      appointmentId: data.appointmentId
    }
  });

  if (existingTriage) {
    throw new Error("TRIAGE_ALREADY_EXISTS");
  }

  const queue = await prisma.queue.findUnique({
    where: {
      patientId: appointment.patientId
    }
  });

  if (!queue) {
    throw new Error("QUEUE_NOT_FOUND");
  }

  return prisma.$transaction(async (tx) => {

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
      },
      include: {
        appointment: {
          include: {
            patient: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    await tx.queue.update({
      where: {
        patientId: appointment.patientId
      },
      data: {
        stage: "DOCTOR",
        status: "WAITING"
      }
    });

    return triage;
  });
};

/**
 * Get all patients waiting for triage
 */
export const getSortedQueue = async (
  pagination?: {
    take?: number;
    skip?: number;
  }
) => {
  return prisma.queue.findMany({
    where: {
      stage: "TRIAGE",
      status: "WAITING"
    },
    include: {
      patient: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      queueNumber: "asc"
    },
    ...(pagination?.take !== undefined && { take: pagination.take }),
    ...(pagination?.skip !== undefined && { skip: pagination.skip })
  });
};

/**
 * Get triage by appointment
 */
export const getTriageByAppointmentId = async (appointmentId: number) => {
  return prisma.triage.findUnique({
    where: {
      appointmentId
    },
    include: {
      appointment: {
        include: {
          patient: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

/**
 * Update triage
 */
export const updateTriageRecord = async (
  appointmentId: number,
  updates: UpdateTriageInput
) => {

  const existing = await prisma.triage.findUnique({
    where: {
      appointmentId
    }
  });

  if (!existing) {
    throw new Error("TRIAGE_RECORD_NOT_FOUND");
  }

  const data: Prisma.TriageUpdateInput = {};

  if (updates.bloodPressure !== undefined)
    data.bloodPressure = updates.bloodPressure;

  if (updates.temperature !== undefined)
    data.temperature = updates.temperature;

  if (updates.weight !== undefined)
    data.weight = updates.weight;

  if (updates.heartRate !== undefined)
    data.heartRate = updates.heartRate;

  if (updates.urgencyLevel !== undefined)
    data.urgencyLevel = updates.urgencyLevel;

  if (updates.note !== undefined)
    data.note = updates.note;

  return prisma.triage.update({
    where: {
      appointmentId
    },
    data,
    include: {
      appointment: {
        include: {
          patient: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};