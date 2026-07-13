import express from "express";
import { getAnalytics } from "../controllers/adminController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/analytics", authenticate, authorize(["ADMIN"]), getAnalytics);

export default router;
