import express from "express";
import { getAllMedications } from "../controllers/medicationController"
import { authenticate } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";
    
const router = express.Router();

router.get("/", authenticate, authorize(["ADMIN", "DOCTOR", "PHARMACIST"]), getAllMedications);

export default router;