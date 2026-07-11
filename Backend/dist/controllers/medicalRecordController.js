import { getPatientHistory } from "../services/consultationService.js";
import { insertRecord, updateRecord } from "../services/medicalRecordService.js";
export const getMedicalRecordsByPatientId = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const medicalRecords = await getPatientHistory(id);
        return res.json(medicalRecords);
    }
    catch (error) {
        next(error);
    }
};
export const createMedicalRecord = async (req, res, next) => {
    try {
        const { notes, diagnosis, userId, patientId, appointmentId } = req.body;
        const data = {
            notes,
            diagnosis,
            userId,
            patientId,
            appointmentId
        };
        const medicalRecord = await insertRecord(data);
        return res.status(201).json(medicalRecord);
    }
    catch (error) {
        next(error);
    }
};
export const updateMedicalRecordById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { notes, diagnosis } = req.body;
        const data = {
            notes,
            diagnosis
        };
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const medicalRecord = await updateRecord(id, data);
        return res.json(medicalRecord);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=medicalRecordController.js.map