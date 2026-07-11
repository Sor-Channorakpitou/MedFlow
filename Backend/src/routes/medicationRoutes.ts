import express from "express";
import { getAllMedications } from "../controllers/medicationController.js"
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
    
const router = express.Router();

/**
 * @swagger
 * /medications:
 *   get:
 *     summary: Get all medications (medication stock inventory)
 *     tags: [Medications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of medications retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticate, authorize(["ADMIN", "DOCTOR", "PHARMACIST"]), getAllMedications);

export default router;