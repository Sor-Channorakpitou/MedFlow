import express from "express";
import { cancelAppointmentById, createAppointment, getAllAppointments, getAppointmentById, updateAppointment } from "../controllers/appointmentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

const emitWorkflowChange = (req: any, res: any, next: any) => {
  req.app.get("io")?.emit("workflow_changed");
  next();
};


router.get('/', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]) , getAllAppointments);
router.get('/:id', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]) , getAppointmentById);
router.post('/', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]) , createAppointment, emitWorkflowChange);
router.patch('/:id', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]) , updateAppointment, emitWorkflowChange);
router.patch('/:id/cancel', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]) , cancelAppointmentById, emitWorkflowChange);
router.patch('/:id/assign-doctor', authenticate, authorize(["ADMIN", "NURSE", "DOCTOR"]) , updateAppointment, emitWorkflowChange);

export default router;