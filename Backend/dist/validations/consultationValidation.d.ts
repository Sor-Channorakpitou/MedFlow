import { z } from "zod";
export declare const logConsultationSchema: z.ZodObject<{
    appointmentId: z.ZodNumber;
    patientId: z.ZodNumber;
    diagnosis: z.ZodString;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    medications: z.ZodOptional<z.ZodArray<z.ZodObject<{
        medicationId: z.ZodNumber;
        dosage: z.ZodNumber;
        frequency: z.ZodNumber;
        duration: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateConsultationSchema: z.ZodObject<{
    appointmentId: z.ZodNumber;
    diagnosis: z.ZodString;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=consultationValidation.d.ts.map