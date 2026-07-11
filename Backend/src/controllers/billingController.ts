import type { Request, Response, NextFunction } from "express";
import { getInvoices, insertInvoice, recordPayment, updateInvoice } from "../services/billingService.js";
import { SOCKET_EVENTS } from "../sockets/socketEvents.js";

export const createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { 
            paymentMethod, issuedDate, totalAmount,
            appointmentId, patientId, userId 
            } = req.body;

        const data = {
            paymentMethod, 
            issuedDate, 
            totalAmount,
            appointmentId, 
            patientId, 
            userId 
        };

        const invoice = await insertInvoice(data);

        const io = req.app.get("io");

            
        if (io) {
            io.to("RECEPTIONIST").emit(SOCKET_EVENTS.BILL_GENERATED, { invoice });
            io.to("RECEPTIONIST").emit(SOCKET_EVENTS.QUEUE_UPDATED, { invoice });
        }

        return res.status(201).json(invoice);
    } catch (error) {
        next(error);
    }
};

export const updateInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
        next(error);
    }
};

export const getAllInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const invoices = await getInvoices();

        if(invoices.length === 0) return res.status(404).json({ message: "No invoice found" });

        return res.json(invoices);
    } catch (error) {
        next(error);
    }
};

export const recordPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const paymentStatus = req.body?.PaymentStatus ?? "PAID";
        const invoice = await recordPayment(id, paymentStatus);

        const prisma = (await import("../lib/prisma.js")).default;

        const queue = await prisma.queue.findUnique({
            where: { appointmentId: invoice.appointmentId },
        });
        
        if (queue) {
            await prisma.queue.update({
                where: { id: queue.id },
                data: { status: "COMPLETED", stage: "COMPLETED" },
            });
            const io = req.app.get("io");
            if (io) {
                io.to("RECEPTIONIST").emit(SOCKET_EVENTS.QUEUE_UPDATED, { queue: { ...queue, status: "COMPLETED", stage: "COMPLETED" } });
            }
        }

        return res.json(invoice);
    } catch (error) {
        next(error);
    }
};