import express from "express";
import { claimPatient, addTriage, getQueue, getTriageByAppointment, updateTriage } from "../controllers/triageController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /triage/queue/{queueId}/claim:
 *   patch:
 *     summary: Nurse claims a waiting triage patient
 *     tags:
 *       - Triage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: queueId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient claimed successfully
 *       400:
 *         description: Invalid queue ID
 *       404:
 *         description: Queue not found
 *       409:
 *         description: Patient already claimed
 */
router.patch("/queue/:queueId/claim", authenticate, authorize(["ADMIN", "NURSE"]), claimPatient);

/**
 * @swagger
 * /triage/queue:
 *   get:
 *     summary: Retrieve the current triage/patient queue
 *     tags:
 *       - Triage
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   appointmentId:
 *                     type: integer
 *                   patientName:
 *                     type: string
 *                   status:
 *                     type: string
 *                     example: "PENDING"
 *       401:
 *         description: Unauthorized
 */
router.get("/queue", authenticate, authorize(["ADMIN","DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACIST"]), getQueue);

/**
 * @swagger
 * /triage/{appointmentId}:
 *   get:
 *     summary: Get triage records by appointment ID
 *     tags:
 *       - Triage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the clinical appointment
 *     responses:
 *       200:
 *         description: Triage details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 appointmentId:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 bloodPressure:
 *                   type: string
 *                 temperature:
 *                   type: number
 *                 weight:
 *                   type: number
 *                 heartRate:
 *                   type: integer
 *                 urgencyLevel:
 *                   type: string
 *                   enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                 note:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Triage records not found for this appointment
 */
router.get("/:appointmentId", authenticate, authorize(["ADMIN","DOCTOR", "NURSE"]), getTriageByAppointment);


/**
 * @swagger
 * /triage:
 *   post:
 *     summary: Add new triage records for a patient appointment
 *     tags:
 *       - Triage
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *               - urgencyLevel
 *             properties:
 *               appointmentId:
 *                 type: integer
 *                 example: 1
 *               bloodPressure:
 *                 type: string
 *                 description: Max 20 characters
 *                 example: "120/80"
 *               temperature:
 *                 type: number
 *                 description: Format (4,1) e.g., Body temperature in Celsius
 *                 example: 36.5
 *               weight:
 *                 type: number
 *                 description: Format (5,2) e.g., Weight in kg
 *                 example: 70.25
 *               heartRate:
 *                 type: integer
 *                 description: Beats per minute (bpm)
 *                 example: 72
 *               urgencyLevel:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                 example: "MEDIUM"
 *               note:
 *                 type: string
 *                 example: "Patient complains of sharp localized headaches."
 *     responses:
 *       201:
 *         description: Triage record created successfully
 *       400:
 *         description: Invalid input or missing appointmentId/urgencyLevel
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, authorize(["ADMIN","DOCTOR", "NURSE"]), addTriage);


/**
 * @swagger
 * /triage/{appointmentId}:
 *   put:
 *     summary: Update triage records by appointment ID
 *     tags:
 *       - Triage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the clinical appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bloodPressure:
 *                 type: string
 *                 example: "118/75"
 *               temperature:
 *                 type: number
 *                 example: 36.8
 *               weight:
 *                 type: number
 *                 example: 69.50
 *               heartRate:
 *                 type: integer
 *                 example: 70
 *               urgencyLevel:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                 example: "LOW"
 *               note:
 *                 type: string
 *                 example: "Vitals stabilized after rest."
 *     responses:
 *       200:
 *         description: Triage record updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Triage record not found
 */
router.put("/:appointmentId", authenticate, authorize(["ADMIN", "DOCTOR", "NURSE"]), updateTriage);

export default router;