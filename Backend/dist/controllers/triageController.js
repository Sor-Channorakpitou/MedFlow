import { TriageStatus } from "@prisma/client";
import { createTriageRecord, getSortedQueue, getAllTriageRecords, getFilteredQueueByUrgency, getTriageByAppointmentId, updateTriageRecord, deleteTriageRecord } from "../services/triageService.js";
export const addTriage = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const triage = await createTriageRecord({ ...req.body, appointmentId: Number(req.body.appointmentId), userId: Number(userId) });
        return res.status(201).json({ message: "Triage registered successfully", triage });
    }
    catch (error) {
        if (error.message === "APPOINTMENT_NOT_FOUND")
            return res.status(404).json({ message: "Appointment sequence not found" });
        if (error.message === "TRIAGE_ALREADY_EXISTS")
            return res.status(409).json({ message: "Triage has already been saved for this session" });
        next(error);
    }
};
export const getQueue = async (req, res, next) => {
    try {
        const queue = await getSortedQueue();
        return res.json({ success: true, count: queue.length, queue });
    }
    catch (error) {
        next(error);
    }
};
export const getAllTriages = async (req, res, next) => {
    try {
        const records = await getAllTriageRecords();
        return res.json({ success: true, count: records.length, records });
    }
    catch (error) {
        next(error);
    }
};
export const filterQueueByUrgency = async (req, res, next) => {
    try {
        const { urgency } = req.query;
        if (!urgency || !Object.values(TriageStatus).includes(urgency)) {
            return res.status(400).json({ message: "Invalid or missing urgency level parameter" });
        }
        const queue = await getFilteredQueueByUrgency(urgency);
        return res.json({ success: true, count: queue.length, queue });
    }
    catch (error) {
        next(error);
    }
};
export const getTriageByAppointment = async (req, res, next) => {
    try {
        const record = await getTriageByAppointmentId(Number(req.params.appointmentId));
        if (!record)
            return res.status(404).json({ message: "No triage record found for this appointment" });
        return res.json({ success: true, record });
    }
    catch (error) {
        next(error);
    }
};
export const updateTriage = async (req, res, next) => {
    try {
        const appointmentId = Number(req.params.appointmentId ?? req.body.appointmentId);
        const { bloodPressure, temperature, weight, heartRate, urgencyLevel, note } = req.body;
        if (!appointmentId || Number.isNaN(appointmentId)) {
            return res.status(400).json({ message: "Missing or invalid appointmentId" });
        }
        const triage = await updateTriageRecord(appointmentId, {
            bloodPressure: bloodPressure ?? null,
            temperature: temperature !== undefined ? Number(temperature) : null,
            weight: weight !== undefined ? Number(weight) : null,
            heartRate: heartRate !== undefined ? Number(heartRate) : null,
            urgencyLevel: urgencyLevel ?? undefined,
            note: note ?? null
        });
        return res.json({ message: "Triage record updated successfully", triage });
    }
    catch (error) {
        if (error.message === "TRIAGE_RECORD_NOT_FOUND") {
            return res.status(404).json({ message: "Triage record not found" });
        }
        next(error);
    }
};
export const deleteTriage = async (req, res, next) => {
    try {
        await deleteTriageRecord(Number(req.params.appointmentId));
        return res.json({ message: "Triage record removed and appointment reverted to pending" });
    }
    catch (error) {
        if (error.message === "TRIAGE_RECORD_NOT_FOUND")
            return res.status(404).json({ message: "Triage record not found" });
        next(error);
    }
};
//# sourceMappingURL=triageController.js.map