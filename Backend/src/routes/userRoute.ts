import express from "express";
import { adminResetPasswordUserById, createUser, deactivateUserById, deleteUserById, getAllUsers, getUserById, updateUserById } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get('/', authenticate, authorize(["ADMIN"]), getAllUsers);
router.get('/:id', authenticate, authorize(["ADMIN"]), getUserById);
router.post('/', authenticate, authorize(["ADMIN"]), createUser);
router.patch('/:id', authenticate, authorize(["ADMIN"]), updateUserById);
router.delete('/:id', authenticate, authorize(["ADMIN"]), deleteUserById);
router.post('/:id/deactivate', authenticate, authorize(["ADMIN"]), deactivateUserById);
router.put('/:id/reset-password', authenticate, authorize(["ADMIN"]), adminResetPasswordUserById);

export default router;