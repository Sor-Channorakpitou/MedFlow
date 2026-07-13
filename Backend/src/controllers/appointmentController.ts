import type { Request, Response, NextFunction } from "express";
import { insertAppointment, findAppointments, findAppointmentById, modifyAppointment, cancelAppointment, assignDoctor } from "../services/appointmentService.js";

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reason, appointmentDate, status, startTime, endTime, userId, patientId } = req.body;
        
        const data = {
            reason,
            appointmentDate,
            status,
            startTime,
            endTime,
            userId,
            patientId
        };

        const appointment = await insertAppointment(data);

        return res.status(201).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
        const appointments = await findAppointments(startDate, endDate);

        if(appointments.length === 0) return res.status(404).json({ message: "No appointment found" });

        return res.json(appointments);
    } catch (error) {
        next(error);
    }
};

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const appointment = await findAppointmentById(id);

        return res.json(appointment);

    } catch (error) {
        next(error);
    }
};

export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const { reason, appointmentDate, status, startTime, endTime, userId, patientId } = req.body;

        const data = {
            reason,
            appointmentDate,
            status,
            startTime,
            endTime,
            userId,
            patientId
        }

        const appointment = await modifyAppointment(id, data);

        return res.json(appointment);

    } catch (error) {
        next(error);
    }
};

export const cancelAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const appointment = await cancelAppointment(id);

        return res.json(appointment);
    } catch (error) {
        next(error);
    }
};

export const assignDoctorToAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appointmentId = Number(req.params.id);
        const userId = Number(req.user?.id);
        
        if (isNaN(appointmentId) || isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const updatedAppointment = await assignDoctor(appointmentId, userId);

        return res.json(updatedAppointment);
    } catch (error) {
        next(error);
    }
};

