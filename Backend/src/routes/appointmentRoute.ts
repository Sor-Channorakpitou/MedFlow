import express from "express";
import { cancelAppointmentById, createAppointment, getAllAppointments, getAppointmentById, updateAppointment } from "../controllers/appointmentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();
/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', authenticate, authorize(["ADMIN", "NURSE", "RECEPTIONIST", "DOCTOR"]), getAllAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), getAppointmentById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create appointment
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   patch:
 *     summary: Update appointment
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/:id', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), updateAppointment);

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel appointment
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/:id/cancel', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), cancelAppointmentById);

/**
 * ⚠️ NOTE: This route currently calls updateAppointment (likely wrong)
 * Should be assignDoctor controller instead
 */

/**
 * @swagger
 * /appointments/{id}/assignToDoctor:
 *   patch:
 *     summary: Assign doctor to appointment
 *     tags: [Appointments]
 *     security: [{ bearerAuth: [] }]
 */
router.patch('/:id/assignToDoctor', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), updateAppointment);


export default router;