import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { createMedicalRecord, getMedicalRecordsByPatientId, updateMedicalRecordById } from "../controllers/medicalRecordController.js";

const router = express.Router();

/**
 * @swagger
 * /medical-records/{id}:
 *   get:
 *     summary: Get medical records by patient ID
 *     tags:
 *       - Medical Records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of medical records
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Patient not found
 */
router.get('/:id', authenticate, authorize(["ADMIN", "DOCTOR", "PHARMACY", "NURSE"]), getMedicalRecordsByPatientId);

/**
 * @swagger
 * /medical-records:
 *   post:
 *     summary: Create medical record
 *     tags:
 *       - Medical Records
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *               notes:
 *                 type: string
 *               patientId:
 *                 type: integer
 *               appointmentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Medical record created successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, authorize(["DOCTOR"]), createMedicalRecord);


/**
 * @swagger
 * /medical-records/{id}:
 *   patch:
 *     summary: Update medical record
 *     tags:
 *       - Medical Records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medical record updated successfully
 *       404:
 *         description: Not found
 */
router.patch('/:id', authenticate, authorize(["DOCTOR"]), updateMedicalRecordById );


export default router;