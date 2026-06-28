import express from "express";
import { changePassword, login, logout, refresh } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);
router.put('/change-password', authenticate, changePassword);

export default router;