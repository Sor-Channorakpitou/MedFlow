import express from "express";
import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get('/', authenticate, authorize(["admin"]), getAllUsers);
router.get('/:id', authenticate, authorize(["admin"]), getUserById);
router.post('/', authenticate, authorize(["admin"]), createUser);
router.patch('/:id', authenticate, authorize(["admin"]), updateUserById);
router.delete('/:id', authenticate, authorize(["admin"]), deleteUserById);

export default router;