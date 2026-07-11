import swaggerJsdoc from "swagger-jsdoc";
import schemas from "./schemas";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MedFlow API",
      version: "1.0.0",
      description: "Hospital Management System API",
    },

    servers: [
      {
        url: process.env.FRONTEND_URL,
        description: "Development Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas,
    },
  },

  apis: ["./src/routes/*.ts"],
};

export default swaggerJsdoc(options);