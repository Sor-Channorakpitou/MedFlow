import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { createInvoice, getAllInvoices, recordPaymentById, updateInvoiceById } from "../controllers/billingController.js";

const router = express.Router();

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get all invoices
 *     tags:
 *       - Invoice
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invoices
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, authorize(["RECEPTIONIST", "ADMIN"]), getAllInvoices);

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Create invoice
 *     tags:
 *       - Invoice
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: integer
 *               patientId:
 *                 type: integer
 *               paymentMethod:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, authorize(["RECEPTIONIST"]), createInvoice);

/**
 * @swagger
 * /invoices/{id}:
 *   patch:
 *     summary: Update invoice by ID
 *     tags:
 *       - Invoice
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *               totalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       404:
 *         description: Invoice not found
 */
router.patch('/:id', authenticate, authorize(["RECEPTIONIST"]), updateInvoiceById);

/**
 * @swagger
 * /invoices/{id}/issueInvoicePayment:
 *   patch:
 *     summary: Issue / confirm invoice payment
 *     tags:
 *       - Invoice
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment issued successfully
 *       404:
 *         description: Invoice not found
 */
router.patch('/:id/issueInvoicePayment', authenticate, authorize(["RECEPTIONIST"]), recordPaymentById);

/**
 * @swagger
 * /invoices/{id}:
 *   patch:
 *     summary: Update invoice by ID
 *     tags:
 *       - Invoice
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 example: CASH
 *               totalAmount:
 *                 type: number
 *                 example: 120.50
 *               paymentStatus:
 *                 type: string
 *                 example: PAID
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       400:
 *         description: Invalid invoice ID or request
 *       404:
 *         description: Invoice not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch('/', authenticate, authorize(["RECEPTIONIST"]), updateInvoiceById);


export default router;