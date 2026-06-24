import { Router } from "express";
import * as consultController from "../controllers/consultationController.js";

const router = Router();

router.get("/queue", consultController.getQueue); // 1. Get Waiting Queue
router.get("/history/:patientId", consultController.getHistory); // 2. Get Patient Medical History
router.post("/", consultController.createConsultation); // 3. Log a New Consultation
router.put("/", consultController.updateExistingConsultation); // 4. Update Existing Consultation
router.get("/today", consultController.getDailyLog); // 5. Get Doctor's Daily Treatment Log

export default router;