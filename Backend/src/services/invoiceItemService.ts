import prisma from "../lib/prisma.js";

type CreateInvoiceItemInput = {
  invoiceId: number;
  unitPrice: number;
  description: string;
  type: string;
  quantity: number;
};

const calculateSubtotal = (unitPrice: number, quantity: number) => {
  return unitPrice * quantity;
};

export const createInvoiceItem = async (data: CreateInvoiceItemInput) => {
  if (
    !data.invoiceId ||
    !data.unitPrice ||
    !data.description ||
    !data.type ||
    !data.quantity
  ) {
    throw new Error("MISSING_REQUIRED_FIELDS");
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
  });

  if (!invoice) throw new Error("INVOICE_NOT_FOUND");

  const subTotal = calculateSubtotal(data.unitPrice, data.quantity);

  return await prisma.invoiceItem.create({
    data: {
      invoiceId: data.invoiceId,
      unitPrice: data.unitPrice,
      description: data.description.trim(),
      type: data.type.trim(),
      quantity: data.quantity,
      subTotal,
    },
  });
};

export const getInvoiceItemsByInvoice = async (invoiceId: number) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) throw new Error("INVOICE_NOT_FOUND");

  return await prisma.invoiceItem.findMany({
    where: { invoiceId },
    orderBy: {
      id: "asc",
    },
  });
};

export const updateInvoiceItem = async (
  id: number,
  data: Partial<CreateInvoiceItemInput>
) => {
  const item = await prisma.invoiceItem.findUnique({
    where: { id },
  });

  if (!item) throw new Error("NOT_FOUND");

  const updateData: any = {};

  if (data.unitPrice !== undefined) updateData.unitPrice = data.unitPrice;
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.type !== undefined) updateData.type = data.type.trim();
  if (data.quantity !== undefined) updateData.quantity = data.quantity;

  if (updateData.unitPrice || updateData.quantity) {
    const unitPrice = updateData.unitPrice ?? item.unitPrice;
    const quantity = updateData.quantity ?? item.quantity;
    updateData.subTotal = calculateSubtotal(unitPrice, quantity);
  }

  return await prisma.invoiceItem.update({
    where: { id },
    data: updateData,
  });
};

export const deleteInvoiceItem = async (id: number) => {
  const item = await prisma.invoiceItem.findUnique({
    where: { id },
  });

  if (!item) throw new Error("NOT_FOUND");

  return await prisma.invoiceItem.delete({
    where: { id },
  });
};