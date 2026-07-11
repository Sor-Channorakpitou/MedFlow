import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

type CreateQueueInput = {
  patientId: number;
  stage: "RECEPTION" | "TRIAGE" | "DOCTOR" | "LABORATORY" | "PHARMACY" | "BILLING" | "COMPLETED";
  status: "WAITING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  queueNumber: number;
  currentUserId?: number;
  appointmentId?: number;
  requiredSpecialtyId?: number;
};

export const generateQueueNumber = async (
    tx: Prisma.TransactionClient
): Promise<number> => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const count = await tx.queue.count({
        where: {
            createdAt: {
                gte: start
            }
        }
    });

    return count + 1;
};

export const createQueue = async (data: CreateQueueInput) => {
  if (!data.patientId || !data.stage || !data.status || !data.queueNumber) {
    throw new Error("MISSING_REQUIRED_FIELDS");
  }

  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId },
  });

  if (!patient) throw new Error("NOT_FOUND");

  if (data.currentUserId) {
    const user = await prisma.user.findUnique({
      where: { id: data.currentUserId },
    });
    if (!user) throw new Error("NOT_FOUND");
  }

  // Validate appointmentId if provided
  if (data.appointmentId) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: data.appointmentId },
    });
    if (!appointment) throw new Error("NOT_FOUND");
  }

  const existingQueue = await prisma.queue.findFirst({
    where: {
      patientId: data.patientId,
      status: { notIn: ["COMPLETED", "CANCELLED"] },
    },
  });

  if (existingQueue) {
    throw new Error("PATIENT_ALREADY_IN_QUEUE");
  }

  return await prisma.queue.create({
    data: {
      patientId: data.patientId,
      stage: data.stage,
      status: data.status,
      queueNumber: data.queueNumber,
      currentUserId: data.currentUserId ?? null,
      appointmentId: data.appointmentId ?? null,
      requiredSpecialtyId: data.requiredSpecialtyId ?? null,
    },
    include: {
      patient: true,
      currentUser: true,
      appointment: true,
    },
  });
};

export const getAllQueues = async () => {
  return await prisma.queue.findMany({
    include: {
      patient: true,
      currentUser: {
        select: { id: true, name: true },
      },
      appointment: {
        include: {
          triage: { select: { urgencyLevel: true } },
          medicalRecord: {
            select: { needsFollowUp: true, diagnosis: true, notes: true, userId: true },
          },
          prescriptions: {
              select: {
                prescriptionMedications: {
                  select: {
                    dosage: true,
                    frequency: true,
                    duration: true,
                    medication: {
                      select: { id: true, name: true, unitPrice: true },
                    },
                  },
                },
              }  
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getQueueById = async (id: number) => {
  const queue = await prisma.queue.findUnique({
    where: { id },
    include: {
      patient: true,
      currentUser: true,
    },
  });

  if (!queue) throw new Error("QUEUE_NOT_FOUND");

  return queue;
};

export const updateQueue = async (
  id: number,
  data: Partial<CreateQueueInput>
) => {
  const queue = await prisma.queue.findUnique({
    where: { id },
  });

  if (!queue) throw new Error("QUEUE_NOT_FOUND");

  const updateData: any = {};

  if (data.stage !== undefined) updateData.stage = data.stage;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.queueNumber !== undefined) updateData.queueNumber = data.queueNumber;
  if (data.currentUserId !== undefined) updateData.currentUserId = data.currentUserId;

  if (data.currentUserId) {
    const user = await prisma.user.findUnique({
      where: { id: data.currentUserId },
    });
    if (!user) throw new Error("NOT_FOUND");
  }

  return await prisma.queue.update({
    where: { id },
    data: updateData,
    include: {
      patient: true,
      currentUser: true,
    },
  });
};

export const deleteQueue = async (id: number) => {
  const queue = await prisma.queue.findUnique({
    where: { id },
  });

  if (!queue) throw new Error("QUEUE_NOT_FOUND");

  return await prisma.queue.delete({
    where: { id },
  });
};

export const moveQueueStage = async (id: number, stage: CreateQueueInput["stage"]) => {
  const queue = await prisma.queue.findUnique({
    where: { id },
  });

  if (!queue) throw new Error("QUEUE_NOT_FOUND");

  return await prisma.queue.update({
    where: { id },
    data: { stage },
    include: {
      patient: true,
      currentUser: true,
    },
  });
};
