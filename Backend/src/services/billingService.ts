import prisma from "../lib/prisma.js";
import { toInvoiceDTO } from "../utils/dataFormat.js";

enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  PARTIAL = "PARTIAL",
}

type InvoiceInfo = {
  paymentMethod: string;
  issuedDate: Date;
  totalAmount: number;
  appointmentId: number;
  patientId: number;
  userId: number;
};

export const insertInvoice = async (data: InvoiceInfo) => {
    if (
      !data.paymentMethod ||
      !data.issuedDate ||
      !data.totalAmount ||
      !data.appointmentId ||
      !data.patientId ||
      !data.userId
    ) {
      throw new Error("MISSING_REQUIRED_FIELDS");
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) throw new Error("NOT_FOUND");

    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });

    if (!patient) throw new Error("NOT_FOUND");

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) throw new Error("NOT_FOUND");

    const existing = await prisma.invoice.findUnique({
      where: { appointmentId: data.appointmentId },
    });

    if (existing) throw new Error("INVOICE_ALREADY_EXISTS");

    return toInvoiceDTO(
      await prisma.invoice.create({
        data: {
          paymentMethod: data.paymentMethod.trim(),
          issuedDate: new Date(data.issuedDate),
          totalAmount: data.totalAmount,
          paymentStatus: PaymentStatus.UNPAID,
          appointmentId: data.appointmentId,
          patientId: data.patientId,
          userId: data.userId,
        },
        include: {
          invoiceItems: true,
        },
      })
    );
};

export const updateInvoice = async (id: number,
    data: {
      paymentMethod?: string;
      totalAmount?: number;
      paymentStatus?: PaymentStatus;
    } ) => {
      
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) throw new Error("NOT_FOUND");

    const updateData: any = {};

    if (data.paymentMethod !== undefined) {
      updateData.paymentMethod = data.paymentMethod.trim();
    }

    if (data.totalAmount !== undefined) {
      updateData.totalAmount = data.totalAmount;
    }

    if (data.paymentStatus !== undefined) {
      updateData.paymentStatus = data.paymentStatus;
    }

    return toInvoiceDTO(
      await prisma.invoice.update({
        where: { id },
        data: updateData,
      })
    );
};

export const getInvoices = async () => {
    const invoices = await prisma.invoice.findMany({
      include: {
        patient: true,
        user: true,
        appointment: true,
        invoiceItems: true,
      },
      orderBy: {
        issuedDate: "desc",
      },
    });

    return invoices.map(toInvoiceDTO);
};

export const recordPayment = async (invoiceId: number, status: PaymentStatus) => {
  
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) throw new Error("NOT_FOUND");

  if (invoice.paymentStatus === PaymentStatus.PAID) {
    throw new Error("ALREADY_PAID");
  }

  return toInvoiceDTO(
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paymentStatus: status,
      },
    })
  );
};
