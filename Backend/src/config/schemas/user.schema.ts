const user = {
  CreateUserDTO: {
    type: "object",
    required: ["email", "name", "password", "roleId"],
    properties: {
      email: { type: "string", example: "user@gmail.com" },
      name: { type: "string", example: "Pitou" },
      phone: { type: "string", example: "0123456789" },
      password: { type: "string", example: "Password123!" },
      roleId: { type: "integer", example: 1 },
      dateOfBirth: { type: "string", format: "date" },
    },
  },

  UpdateUserDTO: {
    type: "object",
    properties: {
      email: { type: "string" },
      name: { type: "string" },
      phone: { type: "string" },
      roleId: { type: "integer" },
      dateOfBirth: { type: "string", format: "date" },
    },
  },

  UserDTO: {
    type: "object",
    properties: {
      id: { type: "integer" },
      email: { type: "string" },
      name: { type: "string" },
      phone: { type: "string" },
      roleId: { type: "integer" },
      dateOfBirth: { type: "string", format: "date", nullable: true },
    },
  },
};

export default user;