import express from "express";
import { cancelAppointmentById, createAppointment, getAllAppointments, getAppointmentById, updateAppointment } from "../controllers/appointmentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
const router = express.Router();
router.get('/', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), getAllAppointments);
router.get('/:id', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), getAppointmentById);
router.post('/', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), createAppointment);
router.patch('/:id', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), updateAppointment);
router.patch('/:id/cancel', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), cancelAppointmentById);
router.patch('/:id/assign-doctor', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]), updateAppointment);
export default router;
//# sourceMappingURL=appointmentRoute.js.map