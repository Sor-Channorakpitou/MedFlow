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

router.post("/", authenticate, addTriage);

router.get("/", authenticate, getAllTriages);

router.get("/queue", authenticate, getQueue);

router.get("/filter", authenticate, filterQueueByUrgency);

router.get("/appointment/:appointmentId", authenticate, getTriageByAppointment);

router.put("/:appointmentId", authenticate, updateTriage);

router.put("/", authenticate, updateTriage);

router.delete("/:appointmentId", authenticate, deleteTriage);

export default router;