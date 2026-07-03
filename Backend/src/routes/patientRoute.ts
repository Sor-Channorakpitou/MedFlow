import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { createPatient, deletePatientById, getAllPatients, getPatientById, updatePatientById } from "../controllers/patientController";

const router = express.Router();

const emitWorkflowChange = (req: any, res: any, next: any) => {
  req.app.get("io")?.emit("workflow_changed");
  next();
};


router.get('/', authenticate, authorize(["ADMIN", "RECEPTIONIST", "NURSE", "DOCTOR"]), getAllPatients);
router.get('/:id', authenticate, authorize(["ADMIN", "RECEPTIONIST", "NURSE", "DOCTOR"]), getPatientById);

router.post('/', authenticate, authorize(["RECEPTIONIST"]), createPatient, emitWorkflowChange);
router.patch('/:id', authenticate, authorize(["RECEPTIONIST"]), updatePatientById, emitWorkflowChange);
router.delete('/:id', authenticate, authorize(["RECEPTIONIST"]), deletePatientById, emitWorkflowChange);

export default router;