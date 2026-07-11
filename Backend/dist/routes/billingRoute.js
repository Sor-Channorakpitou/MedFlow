import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { createInvoice, getAllInvoices, updateInvoiceById } from "../controllers/billingController.js";
const router = express.Router();
router.get('/', authenticate, authorize(["RECEPTIONIST", "ADMIN"]), getAllInvoices);
router.post('/', authenticate, authorize(["RECEPTIONIST"]), createInvoice);
router.patch('/:id', authenticate, authorize(["RECEPTIONIST"]), updateInvoiceById);
router.patch('/:id/issue-payment', authenticate, authorize(["RECEPTIONIST"]), createInvoice);
export default router;
//# sourceMappingURL=billingRoute.js.map