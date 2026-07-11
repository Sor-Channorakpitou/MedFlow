import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
import { createPatient, deletePatientById, getAllPatients, getPatientById, updatePatientById } from "../controllers/patientController";
const router = express.Router();
router.get('/', authenticate, authorize(["ADMIN", "RECEPTIONIST", "NURSE", "DOCTOR"]), getAllPatients);
router.get('/:id', authenticate, authorize(["ADMIN", "RECEPTIONIST", "NURSE", "DOCTOR"]), getPatientById);
router.post('/', authenticate, authorize(["RECEPTIONIST"]), createPatient);
router.patch('/:id', authenticate, authorize(["RECEPTIONIST"]), updatePatientById);
router.delete('/:id', authenticate, authorize(["RECEPTIONIST"]), deletePatientById);
export default router;
//# sourceMappingURL=patientRoute.js.map