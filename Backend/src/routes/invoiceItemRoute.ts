import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

import {createInvoiceItemController, getInvoiceItemsByInvoiceController, updateInvoiceItemController, deleteInvoiceItemController } from "../controllers/invoiceItemController.js";

const router = express.Router();

/**
 * @swagger
 * /invoice-items:
 *   post:
 *     summary: Create invoice item
 *     tags:
 *       - Invoice Items
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authenticate, authorize(["ADMIN", "RECEPTIONIST"]), createInvoiceItemController);

/**
 * @swagger
 * /invoice-items/invoice/{invoiceId}:
 *   get:
 *     summary: Get items by invoice ID
 *     tags:
 *       - Invoice Items
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of invoice items
 *       404:
 *         description: No items found
 */
router.get("/invoice/:id", authenticate, getInvoiceItemsByInvoiceController);

/**
 * @swagger
 * /invoice-items/{id}:
 *   patch:
 *     summary: Update invoice item
 *     tags:
 *       - Invoice Items
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", authenticate, authorize(["ADMIN", "RECEPTIONIST"]), updateInvoiceItemController);

/**
 * @swagger
 * /invoice-items/{id}:
 *   delete:
 *     summary: Delete invoice item
 *     tags:
 *       - Invoice Items
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteInvoiceItemController);

export default router;