import type {
  Request,
  Response,
  NextFunction
} from "express";

import * as prescriptionService from "../services/prescriptionService.js";
import { SOCKET_EVENTS } from "../sockets/socketEvents.js";

// 1. Pending prescriptions
export const getPendingPrescriptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prescriptions = await prescriptionService.getPendingPrescriptions();

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    next(error);
  }
};

// 2. Prescription details
export const getPrescriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const prescription = await prescriptionService.getPrescriptionById(id);

    res.status(200).json({
      success: true,
      prescription
    });
  } catch (error) {
    next(error);
  }
};

// 3. Dispense prescription
export const dispensePrescription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const result = await prescriptionService.dispensePrescription(id);

    const io = req.app.get("io");
    io?.to("PHARMACIST").emit(SOCKET_EVENTS.MEDICATION_DISPENSED, { prescription: result });
    io?.to("RECEPTIONIST").emit(SOCKET_EVENTS.PATIENT_MOVED_STAGE, { prescription: result });

    res.status(200).json({
      success: true,
      message: "Prescription dispensed successfully.",
      prescription: result
    });
  } catch (error) {
    next(error);
  }
};