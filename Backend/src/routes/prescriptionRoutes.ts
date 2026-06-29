import { Router } from "express";
import * as prescriptionController from "../controllers/prescriptionController.js";

const router = Router();

router.get("/pending", prescriptionController.getPendingPrescriptions);

router.get("/:id", prescriptionController.getPrescriptionById);

router.put("/:id/dispense", prescriptionController.dispensePrescription);

export default router;
