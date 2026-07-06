import type { Request, Response, NextFunction } from "express";
import { createQueue, getAllQueues, getQueueById, updateQueue, deleteQueue, moveQueueStage } from "../services/queueService.js";

export const createQueueController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId, stage, status, queueNumber, userId } = req.body;

    const queue = await createQueue({
      patientId,
      stage,
      status,
      queueNumber,
      userId,
    });

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

    const { patientId, stage, status, queueNumber, userId } = req.body;

    const queue = await updateQueue(id, {
      patientId,
      stage,
      status,
      queueNumber,
      userId,
    });

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