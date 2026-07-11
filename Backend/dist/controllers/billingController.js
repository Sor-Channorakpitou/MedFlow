import { getInvoices, insertInvoice, recordPayment, updateInvoice } from "../services/billingService.js";
export const createInvoice = async (req, res, next) => {
    try {
        const { paymentMethod, issuedDate, totalAmount, appointmentId, patientId, userId } = req.body;
        const data = {
            paymentMethod,
            issuedDate,
            totalAmount,
            appointmentId,
            patientId,
            userId
        };
        const invoice = await insertInvoice(data);
        return res.status(201).json(invoice);
    }
    catch (error) {
        next(error);
    }
};
export const updateInvoiceById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const { paymentMethod, totalAmount, paymentStatus } = req.body;
        const data = {
            paymentMethod,
            totalAmount,
            paymentStatus
        };
        const invoice = await updateInvoice(id, data);
        return res.json(invoice);
    }
    catch (error) {
        next(error);
    }
};
export const getAllInvoices = async (req, res, next) => {
    try {
        const invoices = await getInvoices();
        if (invoices.length === 0)
            return res.status(404).json({ message: "No invoice found" });
        return res.json(invoices);
    }
    catch (error) {
        next(error);
    }
};
export const recordPaymentById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const invoice = await recordPayment(id, req.body.PaymentStatus);
        return res.json(invoice);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=billingController.js.map