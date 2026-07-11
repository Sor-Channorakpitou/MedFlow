import { Router } from "express";
import * as prescriptionController from "../controllers/prescriptionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = Router();
/**
 * @swagger
 * /prescriptions/pending:
 *   get:
 *     summary: Retrieve a list of all pending prescriptions waiting to be dispensed
 *     tags:
 *       - Prescription
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of pending prescriptions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Prescription ID
 *                   status:
 *                     type: string
 *                     example: "PENDING"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   patientId:
 *                     type: integer
 *                   patientName:
 *                     type: string
 *                     example: "Sor Channorakpitou"
 *                   doctorName:
 *                     type: string
 *                     example: "Dr. Pitou"
 *       401:
 *         description: Unauthorized
 */
router.get("/pending", authenticate, authorize(["PHARMACIST", "DOCTOR", "NURSE", "RECEPTIONIST", "ADMIN"]),prescriptionController.getPendingPrescriptions);

/**
 * @swagger
 * /prescriptions/{id}:
 *   get:
 *     summary: Get full details of a specific prescription including its grouped medications
 *     tags:
 *       - Prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique prescription ID
 *     responses:
 *       200:
 *         description: Prescription details found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [PENDING, SENT, ACTIVE, INACTIVE, REJECTED]
 *                   example: "PENDING"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 patientId:
 *                   type: integer
 *                 medicalRecordId:
 *                   type: integer
 *                 prescriptionMedications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       medicationId:
 *                         type: integer
 *                       dosage:
 *                         type: integer
 *                         example: 2
 *                       frequency:
 *                         type: integer
 *                         example: 3
 *                       duration:
 *                         type: string
 *                         example: "5 days"
 *                       medication:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Amoxicillin 500mg"
 *                           unitPrice:
 *                             type: string
 *                             example: "12.50"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prescription not found
 */
router.get("/:id", authenticate, authorize(["ADMIN", "PHARMACIST"]), prescriptionController.getPrescriptionById);

/**
 * @swagger
 * /prescriptions/{id}/dispense:
 *   put:
 *     summary: Finalize and dispense a prescription (Updates stock quantities and switches status)
 *     tags:
 *       - Prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique prescription ID to be dispensed
 *     responses:
 *       200:
 *         description: Prescription successfully dispensed and inventory updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Prescription successfully dispensed."
 *                 prescriptionId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   example: "ACTIVE"
 *       400:
 *         description: Insufficient medication stock inventory or invalid prescription status change
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prescription not found
 */
router.put("/:id/dispense", authenticate, authorize(["ADMIN", "PHARMACIST"]), prescriptionController.dispensePrescription);

export default router;