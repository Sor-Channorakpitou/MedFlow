import type { Request, Response, NextFunction } from "express";
import * as consultService from "../services/consultationService.js";
import { logConsultationSchema, updateConsultationSchema } from "../validations/consultationValidation.js";
import { SOCKET_EVENTS } from "../sockets/socketEvents.js";
import prisma from "../lib/prisma.js";

export const claimPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queueId = Number(req.params.queueId);
    const doctorId = (req as any).user?.id;

    if (isNaN(queueId)) {
      return res.status(400).json({ message: "Invalid queue ID" });
    }

    const queue = await consultService.claimPatient(queueId, doctorId);

    req.app.get("io")?.to("DOCTOR").emit(SOCKET_EVENTS.QUEUE_UPDATED, { queue });

    return res.json({ success: true, queue });
  } catch (error) {
    next(error);
  }
};

export const getQueue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorId = (req as any).user?.id;

    // Look up the doctor's specialtyId from DB — not from JWT (JWT only carries identity)
    let specialtyId: number | undefined;
    if (doctorId) {
      const doctor = await prisma.user.findUnique({
        where: { id: Number(doctorId) },
        select: { specialtyId: true },
      });
      specialtyId = doctor?.specialtyId ?? undefined;
    }

    const queue = await consultService.getDoctorQueue(specialtyId);

    res.json({ success: true, queue });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patientId = parseInt(req.params.patientId as string);
    if (isNaN(patientId)) {
      return res.status(400).json({ success: false, message: "Invalid Patient ID parameter" });
    }
    const history = await consultService.getPatientHistory(patientId);
    res.status(200).json({ success: true, count: history.length, history });
  } catch (error) {
    next(error);
  }
};

export const createConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = logConsultationSchema.parse(req.body);
    const doctorId = (req as any).user?.id;

    if (!doctorId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Doctor ID not found" });
    }

    const result = await consultService.logNewConsultation(validatedData, doctorId);

    const io = req.app.get("io");
    io?.to("DOCTOR").emit(SOCKET_EVENTS.DIAGNOSIS_ADDED, { record: result.record });
    io?.to("DOCTOR").emit(SOCKET_EVENTS.QUEUE_UPDATED, { record: result.record });

    if (result.nextStage === "PHARMACY") {
      io?.to("PHARMACIST").emit(SOCKET_EVENTS.PRESCRIPTION_CREATED, { record: result.record });
    } else {
      io?.to("RECEPTIONIST").emit(SOCKET_EVENTS.PATIENT_MOVED_STAGE, { record: result.record });
    }

    res.status(201).json({ success: true, message: "Consultation logged successfully", data: result });
  } catch (error: any) {
    if (error.message.includes("does not exist")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

export const updateExistingConsultation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateConsultationSchema.parse(req.body);
    const result = await consultService.editConsultation(
      validatedData.appointmentId,
      validatedData.diagnosis,
      validatedData.notes || null
    );

    req.app.get("io")?.to("DOCTOR").emit(SOCKET_EVENTS.DIAGNOSIS_ADDED, { record: result });

    res.status(200).json({ success: true, message: "Consultation updated successfully", data: result });
  } catch (error) {
    next(error);
  }
};
