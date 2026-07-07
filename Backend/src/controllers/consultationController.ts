import type { Request, Response, NextFunction } from "express";
import * as consultService from "../services/consultationService.js";
import { logConsultationSchema, updateConsultationSchema } from "../validations/consultationValidation.js";


export const getQueue = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const queue = await consultService.getDoctorQueue();

        res.json({
            success:true,
            queue
        });
    }catch(err){
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

     req.app.get("io")?.emit("workflow_changed"); 

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
    req.app.get("io")?.emit("workflow_changed");  
    res.status(200).json({ success: true, message: "Consultation updated successfully", data: result });
  } catch (error) {
    next(error);
  }
};
