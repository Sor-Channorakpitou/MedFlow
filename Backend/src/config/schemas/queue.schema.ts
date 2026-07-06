const queue = {
  QueueDTO: {
    type: "object",
    properties: {
      id: { type: "integer" },
      patientId: { type: "integer" },
      stage: {
        type: "string",
        enum: ["RECEPTION", "TRIAGE", "DOCTOR", "LABORATORY", "PHARMACY", "BILLING", "COMPLETED"],
      },
      status: {
        type: "string",
        enum: ["WAITING", "IN_PROGRESS", "TRANSFERRED", "COMPLETED", "CANCELLED"],
      },
      queueNumber: { type: "integer" },
      userId: { type: "integer", nullable: true },
    },
  },
};

export default queue;