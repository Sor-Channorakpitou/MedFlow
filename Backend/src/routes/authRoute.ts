import express from "express";
import { changePassword, login, logout, refresh, me } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful (sets httpOnly cookies + returns access token)
 *         headers:
 *           Set-Cookie:
 *             description: refreshToken cookie set by server
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               accessToken: eyJhbGciOi...
 *               user:
 *                 id: 1
 *                 role: ADMIN
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 user:
 *                   id: 1
 *                   email: admin@example.com
 *                   role: ADMIN
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, me);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, logout);

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.put('/change-password', authenticate, changePassword);

export default router;