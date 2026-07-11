declare enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    PARTIAL = "PARTIAL"
}
type InvoiceInfo = {
    paymentMethod: string;
    issuedDate: Date;
    totalAmount: number;
    appointmentId: number;
    patientId: number;
    userId: number;
};
export declare const insertInvoice: (data: InvoiceInfo) => Promise<{
    id: any;
    paymentMethod: any;
    issuedDate: any;
    paymentStatus: any;
    totalAmount: number;
    appointmentId: any;
    patientId: any;
    userId: any;
}>;
export declare const updateInvoice: (id: number, data: {
    paymentMethod?: string;
    totalAmount?: number;
    paymentStatus?: PaymentStatus;
}) => Promise<{
    id: any;
    paymentMethod: any;
    issuedDate: any;
    paymentStatus: any;
    totalAmount: number;
    appointmentId: any;
    patientId: any;
    userId: any;
}>;
export declare const getInvoices: () => Promise<{
    id: any;
    paymentMethod: any;
    issuedDate: any;
    paymentStatus: any;
    totalAmount: number;
    appointmentId: any;
    patientId: any;
    userId: any;
}[]>;
export declare const recordPayment: (invoiceId: number, status: PaymentStatus) => Promise<{
    id: any;
    paymentMethod: any;
    issuedDate: any;
    paymentStatus: any;
    totalAmount: number;
    appointmentId: any;
    patientId: any;
    userId: any;
}>;
export {};
//# sourceMappingURL=billingService.d.ts.map