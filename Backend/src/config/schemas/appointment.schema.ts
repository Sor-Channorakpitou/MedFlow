const appointment = {
  CreateAppointmentDTO: {
    type: "object",
    required: ["appointmentDate", "startTime", "endTime", "patientId"],
    properties: {
      reason: { type: "string", example: "Fever" },
      appointmentDate: { type: "string", format: "date" },
      startTime: { type: "string", format: "date-time" },
      endTime: { type: "string", format: "date-time" },
      status: { type: "string", example: "PENDING" },
      userId: { type: "integer" },
      patientId: { type: "integer" },
    },
  },

  AppointmentDTO: {
    type: "object",
    properties: {
      id: { type: "integer" },
      reason: { type: "string" },
      appointmentDate: { type: "string", format: "date" },
      startTime: { type: "string", format: "date-time" },
      endTime: { type: "string", format: "date-time" },
      status: { type: "string" },
      userId: { type: "integer" },
      patientId: { type: "integer" },
    },
  },
};

export default appointment;