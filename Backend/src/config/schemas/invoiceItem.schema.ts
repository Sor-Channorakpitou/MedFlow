const invoiceItem = {
  CreateInvoiceItemDTO: {
    type: "object",
    required: ["invoiceId", "unitPrice", "description", "type", "quantity"],
    properties: {
      invoiceId: { type: "integer" },
      unitPrice: { type: "number" },
      description: { type: "string" },
      type: { type: "string", example: "MEDICATION" },
      quantity: { type: "integer" },
    },
  },

  InvoiceItemDTO: {
    type: "object",
    properties: {
      id: { type: "integer" },
      invoiceId: { type: "integer" },
      unitPrice: { type: "number" },
      description: { type: "string" },
      type: { type: "string" },
      quantity: { type: "integer" },
      subTotal: { type: "number" },
    },
  },
};

export default invoiceItem;