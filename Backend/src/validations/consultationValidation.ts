import { z } from "zod";

export const logConsultationSchema = z.object({
  appointmentId: z.number().int().positive(),
  patientId: z.number().int().positive(),
  diagnosis: z.string().min(1, "Diagnosis text is required"),
  notes: z.string().optional().nullable(),
  
  // Optional array containing medications prescribed during the session
  medications: z.array(
    z.object({
      medicationId: z.number().int().positive(),
      dosage: z.number().int().positive(),
      frequency: z.number().int().positive(),
      duration: z.string().min(1, "Duration string is required")
    })
  ).optional()
});

export const updateConsultationSchema = z.object({
  appointmentId: z.number().int().positive(),
  diagnosis: z.string().min(1, "Diagnosis text is required"),
  notes: z.string().optional().nullable()
});