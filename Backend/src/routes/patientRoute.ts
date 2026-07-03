import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { createPatient, deletePatientById, getAllPatients, getPatientById, updatePatientById } from "../controllers/patientController";

const router = express.Router();

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     description: Retrieve a list of all patients (accessible by medical staff).
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorize(["ADMIN", "RECEPTIONIST", "NURSE", "DOCTOR"]), getAllPatients);

/**
 * @swagger
 * /patients/:id:
 *   get:
 *     summary: Get patient by ID
 *     description: Retrieve a single patient by their ID.
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:id', authenticate, authorize(["ADMIN", "RECEPTIONIST", "NURSE", "DOCTOR"]), getPatientById);

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     description: Create a new patient record (Receptionist only).
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatientDTO'
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, authorize(["RECEPTIONIST"]), createPatient);

/**
 * @swagger
 * /patients/:id:
 *   patch:
 *     summary: Update patient by ID
 *     description: Update patient details partially (Receptionist only).
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePatientDTO'
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch('/:id', authenticate, authorize(["RECEPTIONIST"]), updatePatientById);

/**
 * @swagger
 * /patients/:id:
 *   delete:
 *     summary: Delete patient by ID
 *     description: Permanently delete a patient record (Receptionist only).
 *     tags:
 *       - Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', authenticate, authorize(["RECEPTIONIST"]), deletePatientById);

export default router;