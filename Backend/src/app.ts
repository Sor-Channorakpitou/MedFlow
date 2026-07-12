import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import authRoute from "./routes/authRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import userRoute from "./routes/userRoute.js";
import medicalRecordRoute from "./routes/medicalRecordRoute.js";
import patientRoute from "./routes/patientRoute.js";
import invoiceItemRoute from "./routes/invoiceItemRoute.js"
import billingRoute from "./routes/billingRoute.js";
import queueRoute from "./routes/queueRoute.js";
import { notFoundHandler } from "./middlewares/notFoundMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import dotenv from "dotenv";
import triageRouter from "./routes/triageRoute.js";
import consultationRouter from "./routes/consultationRoutes.js"
import prescriptionRouter from "./routes/prescriptionRoutes.js"
import medicationRouter from "./routes/medicationRoutes.js"

const app = express();
dotenv.configDotenv();


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(cookieParser());
app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/auth', authRoute);
app.use('/api/users', userRoute); 
app.use('/api/appointments', appointmentRoute);
app.use('/api/invoiceItems', invoiceItemRoute);
app.use('/api/medicalRecords', medicalRecordRoute);
app.use('/api/invoices', billingRoute);
app.use('/api/patients', patientRoute);
app.use('/api/queues', queueRoute);


app.use('/api/triage', triageRouter);
app.use("/api/consultation", consultationRouter);
app.use("/api/prescriptions", prescriptionRouter);
app.use("/api/medications", medicationRouter);
app.use(notFoundHandler);
app.use(errorHandler);



export default app; 