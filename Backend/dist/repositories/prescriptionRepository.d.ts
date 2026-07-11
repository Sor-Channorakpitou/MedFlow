export declare const findPendingPrescriptions: () => Promise<({
    user: {
        name: string;
    };
    patient: {
        phone: string;
        fullName: string;
    };
    medicalRecord: {
        notes: string | null;
        diagnosis: string;
    };
} & {
    id: number;
    createdAt: Date;
    userId: number;
    status: import("@prisma/client").$Enums.PrescriptionStatus;
    patientId: number;
    medicalRecordId: number;
})[]>;
export declare const findPrescriptionById: (id: number) => Promise<({
    user: {
        name: string;
    };
    patient: {
        id: number;
        phone: string;
        dateOfBirth: Date;
        createdAt: Date;
        fullName: string;
        gender: import("@prisma/client").$Enums.Gender;
        address: string | null;
    };
    medicalRecord: {
        notes: string | null;
        diagnosis: string;
    };
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
}) | null>;
export declare const executeDispenseTransaction: (id: number) => Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    status: import("@prisma/client").$Enums.PrescriptionStatus;
    patientId: number;
    medicalRecordId: number;
}>;
//# sourceMappingURL=prescriptionRepository.d.ts.map