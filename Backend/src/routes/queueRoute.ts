import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

import {createQueueController, getAllQueuesController, getQueueByIdController, updateQueueController, deleteQueueController, moveQueueStageController } from "../controllers/queueController.js";

const router = express.Router();

/**
 * @swagger
 * /queues:
 *   get:
 *     summary: Get all queues
 *     tags:
 *       - Queues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of queues
 *       404:
 *         description: No queue found
 */
router.get("/", authenticate, getAllQueuesController);

/**
 * @swagger
 * /queues/{id}:
 *   get:
 *     summary: Get queue by ID
 *     tags:
 *       - Queues
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Queue found
 *       404:
 *         description: Not found
 */
router.get("/:id", authenticate, getQueueByIdController);

/**
 * @swagger
 * /queues:
 *   post:
 *     summary: Create queue
 *     tags:
 *       - Queues
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authenticate, authorize(["RECEPTIONIST", "ADMIN"]), createQueueController);

/**
 * @swagger
 * /queues/{id}:
 *   patch:
 *     summary: Update queue
 *     tags:
 *       - Queues
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", authenticate, authorize(["RECEPTIONIST", "ADMIN"]), updateQueueController);

/**
 * @swagger
 * /queues/{id}:
 *   delete:
 *     summary: Delete queue
 *     tags:
 *       - Queues
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteQueueController);

/**
 * @swagger
 * /queues/{id}/stage:
 *   patch:
 *     summary: Move queue stage
 *     tags:
 *       - Queues
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id/stage", authenticate, authorize(["RECEPTIONIST", "ADMIN"]), moveQueueStageController);

export default router;