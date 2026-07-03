import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { createInvoice, getAllInvoices, updateInvoiceById } from "../controllers/billingController.js";

const router = express.Router();

const emitWorkflowChange = (req: any, res: any, next: any) => {
  req.app.get("io")?.emit("workflow_changed");
  next();
};


router.get('/', authenticate, authorize(["RECEPTIONIST", "ADMIN"]), getAllInvoices);
router.post('/', authenticate, authorize(["RECEPTIONIST"]), createInvoice, emitWorkflowChange);
router.patch('/:id', authenticate, authorize(["RECEPTIONIST"]), updateInvoiceById, emitWorkflowChange);
router.patch('/:id/issue-payment', authenticate, authorize(["RECEPTIONIST"]), createInvoice, emitWorkflowChange);

export default router;