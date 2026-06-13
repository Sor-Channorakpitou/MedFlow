import express from "express";
import { login, logout, refresh } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);

export default router;