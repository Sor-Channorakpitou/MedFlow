import swaggerJsdoc from "swagger-jsdoc";
const options = {
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
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./dist/routes/*.js"]
};
export default swaggerJsdoc(options);
//# sourceMappingURL=swagger.js.map