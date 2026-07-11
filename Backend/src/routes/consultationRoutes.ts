import { Router } from "express";
import * as consultController from "../controllers/consultationController.js"; 
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = Router();

/**
 * @swagger
 * /consultations/queue/{queueId}/claim:
 *   patch:
 *     summary: Doctor claims a waiting consultation patient
 *     tags:
 *       - Consultation
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
router.patch("/queue/:queueId/claim", authenticate, authorize(["ADMIN", "DOCTOR"]), consultController.claimPatient);

/**
 * @swagger
 * /consultations/queue:
 *   get:
 *     summary: Retrieve the queue of patients waiting for consultation
 *     tags:
 *       - Consultation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Consultation queue retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   appointmentId:
 *                     type: integer
 *                   patientId:
 *                     type: integer
 *                   patientName:
 *                     type: string
 *                   urgencyLevel:
 *                     type: string
 *                     example: "HIGH"
 *                   status:
 *                     type: string
 *                     example: "CONFIRMED"
 *       401:
 *         description: Unauthorized
 */
router.get("/queue", authenticate, authorize(["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST"]), consultController.getQueue);

/**
 * @swagger
 * /consultations/history/{patientId}:
 *   get:
 *     summary: Get a specific patient's full medical record history
 *     tags:
 *       - Consultation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the patient
 *     responses:
 *       200:
 *         description: Patient history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Medical Record ID
 *                   diagnosis:
 *                     type: string
 *                   notes:
 *                     type: string
 *                   visitDate:
 *                     type: string
 *                     format: date-time
 *                   doctorName:
 *                     type: string
 *                   prescription:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       medications:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             medicationName:
 *                               type: string
 *                             dosage:
 *                               type: integer
 *                             frequency:
 *                               type: integer
 *                             duration:
 *                               type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */
router.get("/history/:patientId", authenticate, authorize(["ADMIN", "DOCTOR"]), consultController.getHistory);

/**
 * @swagger
 * /consultations:
 *   post:
 *     summary: Log a new doctor consultation (Creates Medical Record & Optional Prescription)
 *     tags:  
 *       - Consultation
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
 *               - patientId
 *               - diagnosis
 *             properties:
 *               appointmentId:
 *                 type: integer
 *                 example: 1
 *               patientId:
 *                 type: integer
 *                 example: 10
 *               diagnosis:
 *                 type: string
 *                 example: "Acute Viral Nasopharyngitis (Common Cold)"
 *               notes:
 *                 type: string
 *                 example: "Advised bed rest for 3 days and high fluid intake."
 *               prescribeMedications:
 *                 type: array
 *                 description: Optional list of medications to instantly tie to this medical record
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicationId
 *                     - dosage
 *                     - frequency
 *                     - duration
 *                   properties:
 *                     medicationId:
 *                       type: integer
 *                       example: 5
 *                     dosage:
 *                       type: integer
 *                       description: Quantity per dose
 *                       example: 1
 *                     frequency:
 *                       type: integer
 *                       description: Times per day
 *                       example: 3
 *                     duration:
 *                       type: string
 *                       example: "7 days"
 *     responses:
 *       201:
 *         description: Consultation successfully recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Consultation saved successfully"
 *                 medicalRecordId:
 *                   type: integer
 *       400:
 *         description: Missing required fields or invalid appointment data
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, authorize(["ADMIN","DOCTOR"]),  consultController.createConsultation);

/**
 * @swagger
 * /consultations/{appointmentId}:
 *   put:
 *     summary: Update an existing consultation's diagnoses or notes
 *     tags:
 *       - Consultation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The appointment ID tied to the medical record being modified
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *                 example: "Gastroenteritis"
 *               notes:
 *                 type: string
 *                 example: "Symptoms updated. Patient reported severe stomach cramps since morning."
 *     responses:
 *       200:
 *         description: Consultation updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Medical record tied to this appointment not found
 */
router.put("/:appointmentId", authenticate, authorize(["ADMIN","DOCTOR"]), consultController.updateExistingConsultation);

export default router;