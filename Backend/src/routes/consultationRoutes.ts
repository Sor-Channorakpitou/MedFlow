import { Router } from "express";
import * as consultController from "../controllers/consultationController.js"; 
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();
router.get("/queue", authenticate, consultController.getQueue);
router.get("/history/:patientId",authenticate, consultController.getHistory); // 2. Get Patient Medical History
router.post("/",authenticate, consultController.createConsultation); // 3. Log a New Consultation
router.put("/:appointmentId",authenticate, consultController.updateExistingConsultation); // 4. Update Existing Consultation

export default router;