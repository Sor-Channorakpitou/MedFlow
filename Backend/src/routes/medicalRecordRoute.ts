import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { createMedicalRecord, getMedicalRecordsByPatientId } from "../controllers/medicalRecordController.js";

const router = express.Router();

const emitWorkflowChange = (req: any, res: any, next: any) => {
  req.app.get("io")?.emit("workflow_changed");
  next();
};


router.get('/:patientId', authenticate, authorize(["ADMIN", "DOCTOR", "PHAMARCY", "NURSE"]), getMedicalRecordsByPatientId);
router.post('/', authenticate, authorize(["DOCTOR"]), createMedicalRecord, emitWorkflowChange);
router.patch('/:id', authenticate, authorize(["DOCTOR"]), createMedicalRecord, emitWorkflowChange);

export default router;