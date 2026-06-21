import { z } from 'zod'

export const createTriageSchema = z.object({
  appointmentId: z.number().int().positive('Appointment ID must be a positive integer'),
  userId: z.number().int().positive('User ID must be a positive integer'),
  bloodPressure: z.string().max(20).optional().nullable(),
  temperature: z.number().positive('Temperature must be a positive number').optional().nullable(),
  weight: z.number().positive('Weight must be a positive number').optional().nullable(),
  heartRate: z.number().int().positive('Heart rate must be a positive integer').optional().nullable(),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const),
  note: z.string().optional().nullable(),
});

export const updateTriageSchema = z.object({
  bloodPressure: z.string().max(20).optional(),
  temperature: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  heartRate: z.number().int().positive().optional(),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).optional(),
  note: z.string().optional(),
});

export type CreateTriageInput = z.infer<typeof createTriageSchema>;
export type UpdateTriageInput = z.infer<typeof updateTriageSchema>;