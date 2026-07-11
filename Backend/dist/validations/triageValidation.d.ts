import { z } from 'zod';
export declare const createTriageSchema: z.ZodObject<{
    appointmentId: z.ZodNumber;
    userId: z.ZodNumber;
    bloodPressure: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    temperature: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    weight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    heartRate: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    urgencyLevel: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    note: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateTriageSchema: z.ZodObject<{
    bloodPressure: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    heartRate: z.ZodOptional<z.ZodNumber>;
    urgencyLevel: z.ZodOptional<z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateTriageInput = z.infer<typeof createTriageSchema>;
export type UpdateTriageInput = z.infer<typeof updateTriageSchema>;
//# sourceMappingURL=triageValidation.d.ts.map