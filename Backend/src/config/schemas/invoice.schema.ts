const invoice = {
  CreateInvoiceDTO: {
    type: "object",
    required: ["appointmentId", "patientId", "paymentMethod"],
    properties: {
      appointmentId: { type: "integer" },
      patientId: { type: "integer" },
      paymentMethod: { type: "string", example: "CASH" },
      totalAmount: { type: "number", example: 100.5 },
    },
  },

  UpdateInvoiceDTO: {
    type: "object",
    properties: {
      paymentMethod: { type: "string" },
      paymentStatus: { type: "string", example: "PAID" },
      totalAmount: { type: "number" },
    },
  },

  InvoiceDTO: {
    type: "object",
    properties: {
      id: { type: "integer" },
      paymentMethod: { type: "string" },
      issuedDate: { type: "string", format: "date-time" },
      paymentStatus: { type: "string" },
      totalAmount: { type: "number" },
      appointmentId: { type: "integer" },
      patientId: { type: "integer" },
      userId: { type: "integer" },
    },
  },
};

export default invoice;