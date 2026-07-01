import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MedFlow API",
            version: "1.0.0",
            description: "Hospital Management System API"
        },

        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Development Server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },

            schemas: {

                // User
                CreateUserDTO: {
                    type: "object",
                    required: ["email", "name", "password", "roleId"],
                    properties: {
                        email: { type: "string", example: "user@gmail.com" },
                        name: { type: "string", example: "Pitou" },
                        phone: { type: "string", example: "0123456789" },
                        password: { type: "string", example: "Password123!" },
                        roleId: { type: "integer", example: 1 },
                        dateOfBirth: { type: "string", format: "date", example: "2000-03-22" }
                    }
                },

                UpdateUserDTO: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        name: { type: "string" },
                        phone: { type: "string" },
                        roleId: { type: "integer" },
                        dateOfBirth: { type: "string", format: "date" }
                    }
                },

                UserDTO: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        email: { type: "string" },
                        name: { type: "string" },
                        phone: { type: "string" },
                        roleId: { type: "integer" },
                        dateOfBirth: { type: "string", format: "date", nullable: true }
                    }
                },

                // Patient
                CreatePatientDTO: {
                    type: "object",
                    required: ["fullName", "gender", "phone"],
                    properties: {
                        fullName: { type: "string", example: "Sor Channorakpitou" },
                        gender: { type: "string", example: "MALE" },
                        phone: { type: "string", example: "0123456789" },
                        address: { type: "string", example: "Phnom Penh" },
                        dateOfBirth: { type: "string", format: "date", example: "1995-09-12" }
                    }
                },

                UpdatePatientDTO: {
                    type: "object",
                    properties: {
                        fullName: { type: "string" },
                        gender: { type: "string" },
                        phone: { type: "string" },
                        address: { type: "string" },
                        dateOfBirth: { type: "string", format: "date" }
                    }
                },

                PatientDTO: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        fullName: { type: "string" },
                        gender: { type: "string" },
                        phone: { type: "string" },
                        address: { type: "string" },
                        dateOfBirth: { type: "string", format: "date", nullable: true }
                    }
                },

                // Appointment
                CreateAppointmentDTO: {
                    type: "object",
                    required: ["reason", "appointmentDate", "patientId"],
                    properties: {
                        reason: { type: "string", example: "Fever and headache" },
                        appointmentDate: { type: "string", format: "date", example: "2023-07-05" },
                        status: { type: "string", example: "PENDING" },
                        userId: { type: "integer", example: 1 },
                        patientId: { type: "integer", example: 10 }
                    }
                },

                AppointmentDTO: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        reason: { type: "string" },
                        appointmentDate: { type: "string", format: "date" },
                        status: { type: "string" },
                        userId: { type: "integer" },
                        patientId: { type: "integer" }
                    }
                },

                // Medical record
                MedicalRecordDTO: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        notes: { type: "string" },
                        diagnosis: { type: "string" },
                        visitDate: { type: "string", format: "date" },
                        userId: { type: "integer" },
                        patientId: { type: "integer" },
                        appointmentId: { type: "integer" }
                    }
                },

                // Invoice
                InvoiceDTO: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        paymentMethod: { type: "string", example: "CASH" },
                        issuedDate: { type: "string", format: "date" },
                        paymentStatus: { type: "string", example: "PAID" },
                        totalAmount: { type: "number", example: 150.5 },
                        appointmentId: { type: "integer" },
                        patientId: { type: "integer" },
                        userId: { type: "integer" }
                    }
                },

                // Common error
                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Something went wrong" },
                        statusCode: { type: "integer", example: 400 }
                    }
                }
            },
        },

        security: [
            {
                bearerAuth: []
            }
        ]
    },

    apis: ["./src/routes/*.ts"]
};

export default swaggerJsdoc(options);