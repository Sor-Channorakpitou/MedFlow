import type { Request, Response, NextFunction } from "express";
import { createQueue, getAllQueues, getQueueById, updateQueue, deleteQueue, moveQueueStage, generateQueueNumber } from "../services/queueService.js";
import prisma from "../lib/prisma.js";
import { SOCKET_EVENTS } from "../sockets/socketEvents.js";

export const createQueueController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId, stage, status, currentUserId, appointmentId, requiredSpecialtyId } = req.body;
    let { queueNumber } = req.body;

    // Auto-generate queue number if not supplied (or supplied as 0/null)
    if (!queueNumber) {
      queueNumber = await prisma.$transaction(async (tx) => generateQueueNumber(tx));
    }

    const queue = await createQueue({
      patientId,
      stage,
      status,
      queueNumber,
      currentUserId,
      ...(appointmentId !== undefined ? { appointmentId: Number(appointmentId) } : {}),
      ...(requiredSpecialtyId !== undefined ? { requiredSpecialtyId: Number(requiredSpecialtyId) } : {}),
    });

    // Notify the relevant clinical room that a patient has arrived
    const io = req.app.get("io");
    if (io && stage === "DOCTOR") {
      io.to("DOCTOR").emit(SOCKET_EVENTS.PATIENT_MOVED_STAGE, { queue });
    } else if (io && stage === "TRIAGE") {
      io.to("NURSE").emit(SOCKET_EVENTS.NURSE_AVAILABILITY_UPDATED);
    }

    return res.status(201).json(queue);
  } catch (error) {
    next(error);
  }
};

export const getAllQueuesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queues = await getAllQueues();

    if (queues.length === 0) {
      return res.status(404).json({ message: "No queue found" });
    }

    return res.json(queues);
  } catch (error) {
    next(error);
  }
};

export const getQueueByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid queue ID" });
    }

    const queue = await getQueueById(id);

    return res.json(queue);
  } catch (error) {
    next(error);
  }
};

export const updateQueueController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid queue ID" });
    }

    const { stage, status, queueNumber, currentUserId } = req.body;

    const queue = await updateQueue(id, {
      stage,
      status,
      queueNumber,
      currentUserId,
    });

    const io = req.app.get("io");
      if (io && (stage === "COMPLETED" || status === "COMPLETED")) {
        io.to("RECEPTIONIST").emit(SOCKET_EVENTS.QUEUE_UPDATED, { queue });
    }

    return res.json(queue);
  } catch (error) {
    next(error);
  }
};

export const deleteQueueController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid queue ID" });
    }

    await deleteQueue(id);

    return res.json({ message: "Queue deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const moveQueueStageController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid queue ID" });
    }

    const { stage } = req.body;

    const queue = await moveQueueStage(id, stage);

    return res.json(queue);
  } catch (error) {
    next(error);
  }
};
