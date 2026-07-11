import type { Gender } from "@prisma/client";
type PatientInfo = {
    fullName: string;
    gender: Gender;
    phone: string;
    address: string;
    dateOfBirth: Date;
};
export declare const insertPatient: (data: PatientInfo) => Promise<{
    id: any;
    fullName: any;
    gender: any;
    phone: any;
    address: any;
    dateOfBirth: string | null | undefined;
}>;
export declare const findAllPatients: () => Promise<{
    id: any;
    fullName: any;
    gender: any;
    phone: any;
    address: any;
    dateOfBirth: string | null | undefined;
}[]>;
export declare const findPatientById: (id: number) => Promise<{
    id: any;
    fullName: any;
    gender: any;
    phone: any;
    address: any;
    dateOfBirth: string | null | undefined;
}>;
export declare const modifyPatient: (id: number, data: {
    fullName?: string;
    gender?: Gender;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
}) => Promise<{
    id: any;
    fullName: any;
    gender: any;
    phone: any;
    address: any;
    dateOfBirth: string | null | undefined;
}>;
export declare const removePatient: (id: number) => Promise<{
    id: any;
    fullName: any;
    gender: any;
    phone: any;
    address: any;
    dateOfBirth: string | null | undefined;
}>;
export {};
//# sourceMappingURL=patientService.d.ts.map