import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { createPatient, deletePatientById, getAllPatients, getPatientById, updatePatientById } from "../controllers/patientController";

const router = express.Router();

router.get('/', authenticate, authorize(["admin", "receptionist", "nurse", "doctor"]), getAllPatients);
router.get('/:id', authenticate, authorize(["admin", "receptionist", "nurse", "doctor"]), getPatientById);
router.post('/', authenticate, authorize(["receptionist"]), createPatient);
router.patch('/:id', authenticate, authorize(["receptionist"]), updatePatientById);
router.delete('/:id', authenticate, authorize(["receptionist"]), deletePatientById);

export default router;