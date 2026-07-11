export declare const formatDateOnly: (date: Date | string | null | undefined) => string | null | undefined;
export declare const toUserDTO: (user: any) => {
    id: any;
    email: any;
    name: any;
    phone: any;
    roleId: any;
    dateOfBirth: string | null | undefined;
};
export declare const toPatientDTO: (patient: any) => {
    id: any;
    fullName: any;
    gender: any;
    phone: any;
    address: any;
    dateOfBirth: string | null | undefined;
};
export declare const toAppointmentDTO: (appointment: any) => {
    id: any;
    reason: any;
    appointmentDate: string | null | undefined;
    status: any;
    userId: any;
    patientId: any;
};
export declare const toMedicalRecordDTO: (record: any) => {
    id: any;
    notes: any;
    diagnosis: any;
    visitDate: any;
    userId: any;
    patientId: any;
    appointmentId: any;
};
export declare const toInvoiceDTO: (invoice: any) => {
    id: any;
    paymentMethod: any;
    issuedDate: any;
    paymentStatus: any;
    totalAmount: number;
    appointmentId: any;
    patientId: any;
    userId: any;
};
//# sourceMappingURL=dataFormat.d.ts.map