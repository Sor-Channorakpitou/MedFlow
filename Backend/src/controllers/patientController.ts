import { insertPatient, findAllPatients, findPatientById, modifyPatient, removePatient } from "../services/patientService";
import type { Request, Response, NextFunction } from "express";

export const createPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, gender, phone, address, dateOfBirth, userId } = req.body;

        const data = {
            fullName,
            gender,
            phone,
            address,
            dateOfBirth,
            userId
        };

        const io = req.app.get("io");

        const patient = await insertPatient(data, io);

        return res.status(201).json(patient);
    } catch (error) {
        next(error);
    }
};

export const getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patients = await findAllPatients();

        if(patients.length === 0) return res.status(404).json({ message: "No users found" });

        return res.json(patients);
    } catch (error) {
        next(error);
    }
};

export const getPatientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const patient = await findPatientById(id);

        if(!patient) return res.status(404).json({ message: "Patient not found" });

        return res.json(patient);
    } catch (error) {
        next(error);
    }
};

export const updatePatientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const { fullName, gender, phone, address, dateOfBirth } = req.body;

        const data = {
            fullName,
            gender,
            phone,
            address,
            dateOfBirth
        };

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const patient = await modifyPatient(id, data);

        if (!patient) return res.status(404).json({ message: "Patient not found" });

        return res.status(200).json(patient);
    } catch (error) {
        next(error);
    }
};

export const deletePatientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        if(isNaN(id)) return res.status(400).json({ message: "Invalid patient ID" });

        const patient = await removePatient(id);

        if(!patient) return res.status(404).json({ message: "Patient not found" });

        return res.json(patient);
    } catch (error) {
        next(error);
    }
};