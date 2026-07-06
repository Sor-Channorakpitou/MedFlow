const patient = {
  CreatePatientDTO: {
    type: "object",
    required: ["fullName", "gender", "phone"],
    properties: {
      fullName: { type: "string", example: "John Doe" },
      gender: {
        type: "string",
        enum: ["MALE", "FEMALE", "OTHER"],
      },
      phone: { type: "string", example: "0123456789" },
      address: { type: "string" },
      dateOfBirth: { type: "string", format: "date" },
    },
  },

  UpdatePatientDTO: {
    type: "object",
    properties: {
      fullName: { type: "string" },
      gender: { type: "string", enum: ["MALE", "FEMALE", "OTHER"] },
      phone: { type: "string" },
      address: { type: "string" },
      dateOfBirth: { type: "string", format: "date" },
    },
  },

  PatientDTO: {
    type: "object",
    properties: {
      id: { type: "integer" },
      fullName: { type: "string" },
      gender: { type: "string" },
      phone: { type: "string" },
      address: { type: "string" },
      dateOfBirth: { type: "string", format: "date" },
    },
  },
};

export default patient;