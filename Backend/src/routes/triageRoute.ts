import express from "express";
import { 
  addTriage, 
  getQueue, 
  getAllTriages, 
  filterQueueByUrgency, 
  getTriageByAppointment, 
  updateTriage, 
  deleteTriage 
} from "../controllers/triageController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Create Triage Record (POST)
router.post("/", authenticate, addTriage);

// 2. Get All Triage Records (GET)
router.get("/", authenticate, getAllTriages);

// Custom Live Priority Queue Sorted endpoint (Your main structural task!)
router.get("/queue", authenticate, getQueue);

// 3. Filter Queue by Urgency (GET)
router.get("/filter", authenticate, filterQueueByUrgency);

// 4. Get Triage by Appointment ID (GET)
router.get("/appointment/:appointmentId", authenticate, getTriageByAppointment);

// 5. Update Vitals or Urgency (PUT)
router.put("/:appointmentId", authenticate, updateTriage);
// Also support legacy body-based appointmentId for clients that send it there.
router.put("/", authenticate, updateTriage);

// 6. Delete Triage Record (DELETE)
router.delete("/:appointmentId", authenticate, deleteTriage);

export default router;