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
        enum: ["WAITING", "PROCESSING", "COMPLETED", "CANCELLED"],
      },
      queueNumber: { type: "integer" },
      currentUserId: { type: "integer", nullable: true },
    },
  },
};

export default queue;
