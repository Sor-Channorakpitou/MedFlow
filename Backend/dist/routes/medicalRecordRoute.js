import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { createMedicalRecord, getMedicalRecordsByPatientId } from "../controllers/medicalRecordController.js";
const router = express.Router();
router.get('/:patientId', authenticate, authorize(["ADMIN", "DOCTOR", "PHAMARCY", "NURSE"]), getMedicalRecordsByPatientId);
router.post('/', authenticate, authorize(["DOCTOR"]), createMedicalRecord);
router.patch('/:id', authenticate, authorize(["DOCTOR"]), createMedicalRecord);
export default router;
//# sourceMappingURL=medicalRecordRoute.js.map