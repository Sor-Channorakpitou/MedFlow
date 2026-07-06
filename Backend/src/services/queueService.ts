import prisma from "../lib/prisma.js";

type CreateQueueInput = {
  patientId: number;
  stage: "RECEPTION" | "TRIAGE" | "DOCTOR" | "LABORATORY" | "PHARMACY" | "BILLING" | "COMPLETED";
  status: "WAITING" | "IN_PROGRESS" | "TRANSFERRED" | "COMPLETED" | "CANCELLED";
  queueNumber: number;
  userId?: number;
};

export const createQueue = async (data: CreateQueueInput) => {
  if (!data.patientId || !data.stage || !data.status || !data.queueNumber) {
    throw new Error("MISSING_REQUIRED_FIELDS");
  }

  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId },
  });

  if (!patient) throw new Error("NOT_FOUND");

  if (data.userId) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) throw new Error("NOT_FOUND");
  }

  const existingQueue = await prisma.queue.findUnique({
    where: { patientId: data.patientId },
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
      userId: data.userId ?? null,
    },
    include: {
      patient: true,
      user: true,
    },
  });
};

export const getAllQueues = async () => {
  return await prisma.queue.findMany({
    include: {
      patient: true,
      user: true,
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
      user: true,
    },
  });

  if (!queue) throw new Error("NOT_FOUND");

  return queue;
};

export const updateQueue = async (
  id: number,
  data: Partial<CreateQueueInput>
) => {
  const queue = await prisma.queue.findUnique({
    where: { id },
  });

  if (!queue) throw new Error("NOT_FOUND");

  const updateData: any = {};

  if (data.stage !== undefined) updateData.stage = data.stage;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.queueNumber !== undefined) updateData.queueNumber = data.queueNumber;
  if (data.userId !== undefined) updateData.userId = data.userId;

  if (data.userId) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) throw new Error("NOT_FOUND");
  }

  return await prisma.queue.update({
    where: { id },
    data: updateData,
    include: {
      patient: true,
      user: true,
    },
  });
};

export const deleteQueue = async (id: number) => {
  const queue = await prisma.queue.findUnique({
    where: { id },
  });

  if (!queue) throw new Error("NOT_FOUND");

  return await prisma.queue.delete({
    where: { id },
  });
};

export const moveQueueStage = async (id: number, stage: CreateQueueInput["stage"]) => {
  const queue = await prisma.queue.findUnique({
    where: { id },
  });

  if (!queue) throw new Error("NOT_FOUND");

  return await prisma.queue.update({
    where: { id },
    data: { stage },
    include: {
      patient: true,
      user: true,
    },
  });
};