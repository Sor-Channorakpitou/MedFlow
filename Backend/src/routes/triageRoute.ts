import express from "express";
import { 
  addTriage, 
  getQueue, 
  getTriageByAppointment, 
  updateTriage, 
  
} from "../controllers/triageController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/queue", authenticate, getQueue);

router.post("/", authenticate, addTriage);

router.get("/:appointmentId", authenticate, getTriageByAppointment);

router.put("/:appointmentId", authenticate, updateTriage);



export default router;