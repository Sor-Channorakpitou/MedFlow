type MedicalRecordInfo = {
    notes?: string;
    diagnosis: string;
    userId: number;
    patientId: number;
    appointmentId: number;
};
export declare const insertRecord: (data: MedicalRecordInfo) => Promise<{
    id: any;
    notes: any;
    diagnosis: any;
    visitDate: any;
    userId: any;
    patientId: any;
    appointmentId: any;
}>;
export declare const updateRecord: (id: number, data: {
    notes?: string;
    diagnosis?: string;
}) => Promise<{
    id: any;
    notes: any;
    diagnosis: any;
    visitDate: any;
    userId: any;
    patientId: any;
    appointmentId: any;
}>;
export declare const getPatientHistory: (patientId: number) => Promise<{
    id: any;
    notes: any;
    diagnosis: any;
    visitDate: any;
    userId: any;
    patientId: any;
    appointmentId: any;
}[]>;
export {};
//# sourceMappingURL=medicalRecordService.d.ts.map