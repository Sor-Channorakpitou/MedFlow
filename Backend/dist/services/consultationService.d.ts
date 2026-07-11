export declare const getDoctorWaitingQueue: () => Promise<({
    patient: {
        id: number;
        phone: string;
        dateOfBirth: Date;
        createdAt: Date;
        fullName: string;
        gender: import("@prisma/client").$Enums.Gender;
        address: string | null;
    };
    triage: {
        id: number;
        createdAt: Date;
        userId: number;
        appointmentId: number;
        bloodPressure: string | null;
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        heartRate: number | null;
        urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
        note: string | null;
    } | null;
} & {
    id: number;
    createdAt: Date;
    userId: number;
    reason: string | null;
    appointmentDate: Date;
    status: import("@prisma/client").$Enums.AppointmentStatus;
    startTime: Date;
    endTime: Date;
    patientId: number;
})[]>;
export declare const getPatientHistory: (patientId: number) => Promise<({
    user: {
        name: string;
    };
    prescription: ({
        prescriptionMedications: ({
            medication: {
                id: number;
                name: string;
                description: string;
                stockQuantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: number;
            medicationId: number;
            dosage: number;
            frequency: number;
            duration: string;
            prescriptionId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        status: import("@prisma/client").$Enums.PrescriptionStatus;
        patientId: number;
        medicalRecordId: number;
    }) | null;
} & {
    id: number;
    userId: number;
    patientId: number;
    notes: string | null;
    diagnosis: string;
    visitDate: Date;
    appointmentId: number;
})[]>;
export declare const logNewConsultation: (data: any, doctorId: number) => Promise<{
    id: number;
    userId: number;
    patientId: number;
    notes: string | null;
    diagnosis: string;
    visitDate: Date;
    appointmentId: number;
}>;
export declare const editConsultation: (appointmentId: number, diagnosis: string, notes: string | null) => Promise<{
    id: number;
    userId: number;
    patientId: number;
    notes: string | null;
    diagnosis: string;
    visitDate: Date;
    appointmentId: number;
}>;
export declare const getDoctorDailyLog: (doctorId: number) => Promise<({
    patient: {
        id: number;
        phone: string;
        dateOfBirth: Date;
        createdAt: Date;
        fullName: string;
        gender: import("@prisma/client").$Enums.Gender;
        address: string | null;
    };
    appointment: {
        id: number;
        createdAt: Date;
        userId: number;
        reason: string | null;
        appointmentDate: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        startTime: Date;
        endTime: Date;
        patientId: number;
    };
} & {
    id: number;
    userId: number;
    patientId: number;
    notes: string | null;
    diagnosis: string;
    visitDate: Date;
    appointmentId: number;
})[]>;
//# sourceMappingURL=consultationService.d.ts.map