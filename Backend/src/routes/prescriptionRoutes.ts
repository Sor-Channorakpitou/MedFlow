import { Router } from "express";
import * as prescriptionController from "../controllers/prescriptionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";


const router = Router();

router.get("/pending",authenticate, prescriptionController.getPendingPrescriptions);

router.get("/:id",authenticate, prescriptionController.getPrescriptionById);

router.put("/:id/dispense",authenticate, prescriptionController.dispensePrescription);

export default router;
