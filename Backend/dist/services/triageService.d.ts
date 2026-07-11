import type { Prisma, TriageStatus } from "@prisma/client";
interface CreateTriageInput {
    appointmentId: number;
    userId: number;
    bloodPressure?: string | null;
    temperature?: number | null;
    weight?: number | null;
    heartRate?: number | null;
    urgencyLevel: TriageStatus;
    note?: string | null;
}
interface UpdateTriageInput {
    bloodPressure?: string | null;
    temperature?: number | null;
    weight?: number | null;
    heartRate?: number | null;
    urgencyLevel?: TriageStatus;
    note?: string | null;
}
export declare const createTriageRecord: (data: CreateTriageInput) => Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    appointmentId: number;
    bloodPressure: string | null;
    temperature: Prisma.Decimal | null;
    weight: Prisma.Decimal | null;
    heartRate: number | null;
    urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
    note: string | null;
}>;
export declare const getSortedQueue: () => Promise<({
    appointment: {
        patient: {
            id: number;
            phone: string;
            dateOfBirth: Date;
            createdAt: Date;
            fullName: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
        };
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
    };
} & {
    id: number;
    createdAt: Date;
    userId: number;
    appointmentId: number;
    bloodPressure: string | null;
    temperature: Prisma.Decimal | null;
    weight: Prisma.Decimal | null;
    heartRate: number | null;
    urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
    note: string | null;
})[]>;
export declare const getAllTriageRecords: () => Promise<({
    appointment: {
        patient: {
            id: number;
            phone: string;
            dateOfBirth: Date;
            createdAt: Date;
            fullName: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
        };
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
    };
} & {
    id: number;
    createdAt: Date;
    userId: number;
    appointmentId: number;
    bloodPressure: string | null;
    temperature: Prisma.Decimal | null;
    weight: Prisma.Decimal | null;
    heartRate: number | null;
    urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
    note: string | null;
})[]>;
export declare const getFilteredQueueByUrgency: (urgency: TriageStatus) => Promise<({
    appointment: {
        patient: {
            id: number;
            phone: string;
            dateOfBirth: Date;
            createdAt: Date;
            fullName: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
        };
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
    };
} & {
    id: number;
    createdAt: Date;
    userId: number;
    appointmentId: number;
    bloodPressure: string | null;
    temperature: Prisma.Decimal | null;
    weight: Prisma.Decimal | null;
    heartRate: number | null;
    urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
    note: string | null;
})[]>;
export declare const getTriageByAppointmentId: (appointmentId: number) => Promise<({
    appointment: {
        patient: {
            id: number;
            phone: string;
            dateOfBirth: Date;
            createdAt: Date;
            fullName: string;
            gender: import("@prisma/client").$Enums.Gender;
            address: string | null;
        };
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
    };
} & {
    id: number;
    createdAt: Date;
    userId: number;
    appointmentId: number;
    bloodPressure: string | null;
    temperature: Prisma.Decimal | null;
    weight: Prisma.Decimal | null;
    heartRate: number | null;
    urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
    note: string | null;
}) | null>;
export declare const updateTriageRecord: (appointmentId: number, updates: UpdateTriageInput) => Promise<{
    id: number;
    createdAt: Date;
    userId: number;
    appointmentId: number;
    bloodPressure: string | null;
    temperature: Prisma.Decimal | null;
    weight: Prisma.Decimal | null;
    heartRate: number | null;
    urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
    note: string | null;
}>;
export declare const deleteTriageRecord: (appointmentId: number) => Promise<void>;
export {};
//# sourceMappingURL=triageService.d.ts.map