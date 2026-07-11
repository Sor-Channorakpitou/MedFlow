import * as consultService from "../services/consultationService.js";
import { logConsultationSchema, updateConsultationSchema } from "../validations/consultationValidation.js";
export const getQueue = async (req, res, next) => {
    try {
        const queue = await consultService.getDoctorWaitingQueue();
        res.status(200).json({ success: true, count: queue.length, queue });
    }
    catch (error) {
        next(error);
    }
};
export const getHistory = async (req, res, next) => {
    try {
        const patientId = parseInt(req.params.patientId);
        if (isNaN(patientId)) {
            return res.status(400).json({ success: false, message: "Invalid Patient ID parameter" });
        }
        const history = await consultService.getPatientHistory(patientId);
        res.status(200).json({ success: true, count: history.length, history });
    }
    catch (error) {
        next(error);
    }
};
export const createConsultation = async (req, res, next) => {
    try {
        const validatedData = logConsultationSchema.parse(req.body);
        const doctorId = req.user?.id || 1;
        const result = await consultService.logNewConsultation(validatedData, doctorId);
        res.status(201).json({ success: true, message: "Consultation logged successfully", data: result });
    }
    catch (error) {
        if (error.message.includes("does not exist")) {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};
export const updateExistingConsultation = async (req, res, next) => {
    try {
        const validatedData = updateConsultationSchema.parse(req.body);
        const result = await consultService.editConsultation(validatedData.appointmentId, validatedData.diagnosis, validatedData.notes || null);
        res.status(200).json({ success: true, message: "Consultation updated successfully", data: result });
    }
    catch (error) {
        next(error);
    }
};
export const getDailyLog = async (req, res, next) => {
    try {
        const doctorId = req.user?.id || 3;
        console.log("Doctor ID:", doctorId);
        const logs = await consultService.getDoctorDailyLog(doctorId);
        res.status(200).json({ success: true, count: logs.length, logs });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=consultationController.js.map