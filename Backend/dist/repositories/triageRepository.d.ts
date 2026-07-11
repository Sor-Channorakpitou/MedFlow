import { TriageStatus } from '@prisma/client';
import type { CreateTriageInput, UpdateTriageInput } from '../validations/triageValidation';
export declare class TriageRepository {
    createTriage(data: CreateTriageInput): Promise<{
        user: {
            id: number;
            email: string;
            name: string;
        };
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
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        heartRate: number | null;
        urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
        note: string | null;
    }>;
    getTriageById(triageId: number): Promise<({
        user: {
            id: number;
            email: string;
            name: string;
        };
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
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        heartRate: number | null;
        urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
        note: string | null;
    }) | null>;
    getTriageByAppointmentId(appointmentId: number): Promise<({
        user: {
            id: number;
            email: string;
            name: string;
        };
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
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        heartRate: number | null;
        urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
        note: string | null;
    }) | null>;
    updateTriage(triageId: number, data: UpdateTriageInput): Promise<{
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
    }>;
    getAllTriages(urgencyLevel?: TriageStatus): Promise<({
        user: {
            id: number;
            email: string;
            name: string;
        };
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
        temperature: import("@prisma/client/runtime/library").Decimal | null;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        heartRate: number | null;
        urgencyLevel: import("@prisma/client").$Enums.TriageStatus;
        note: string | null;
    })[]>;
    deleteTriage(triageId: number): Promise<{
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
    }>;
}
//# sourceMappingURL=triageRepository.d.ts.map