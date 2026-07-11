declare enum AppointmentStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
type AppointmentInfo = {
    reason: string;
    appointmentDate: Date;
    status: AppointmentStatus;
    startTime: Date;
    endTime: Date;
    userId: number;
    patientId: number;
};
export declare const insertAppointment: (data: AppointmentInfo) => Promise<{
    id: any;
    reason: any;
    appointmentDate: string | null | undefined;
    status: any;
    userId: any;
    patientId: any;
}>;
export declare const findAppointments: () => Promise<{
    id: any;
    reason: any;
    appointmentDate: string | null | undefined;
    status: any;
    userId: any;
    patientId: any;
}[]>;
export declare const findAppointmentById: (id: number) => Promise<{
    id: any;
    reason: any;
    appointmentDate: string | null | undefined;
    status: any;
    userId: any;
    patientId: any;
}>;
export declare const modifyAppointment: (id: number, data: Partial<AppointmentInfo>) => Promise<{
    id: any;
    reason: any;
    appointmentDate: string | null | undefined;
    status: any;
    userId: any;
    patientId: any;
}>;
export declare const cancelAppointment: (id: number) => Promise<{
    id: any;
    reason: any;
    appointmentDate: string | null | undefined;
    status: any;
    userId: any;
    patientId: any;
}>;
export declare const assignDoctor: (appointmentId: number, userId: number) => Promise<{
    id: any;
    reason: any;
    appointmentDate: string | null | undefined;
    status: any;
    userId: any;
    patientId: any;
}>;
export {};
//# sourceMappingURL=appointmentService.d.ts.map