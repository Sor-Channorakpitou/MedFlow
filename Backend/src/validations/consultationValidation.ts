import { z } from "zod";

export const logConsultationSchema = z.object({
  appointmentId: z.number().int().positive(),
  patientId: z.number().int().positive(),
  diagnosis: z.string().min(1, "Diagnosis text is required"),
  notes: z.string().optional().nullable(),
  medications: z.array(
    z.object({
      medicationId: z.number().int().positive(),

      dosage: z.preprocess((val) => (val ? Number(val) : 0), z.number().int().nonnegative()),
      frequency: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().positive()),
      duration: z.string().min(1, "Duration string is required")
    })
  ).optional()
});

export const updateConsultationSchema = z.object({
  appointmentId: z.number().int().positive(),
  diagnosis: z.string().min(1, "Diagnosis text is required"),
  notes: z.string().optional().nullable()
});