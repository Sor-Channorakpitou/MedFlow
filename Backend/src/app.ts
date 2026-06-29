import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";
import userRoute from "./routes/userRoute.js";
import medicalRecordRoute from "./routes/medicalRecordRoute.js";
import billingRoute from "./routes/billingRoute.js";
import { notFoundHandler } from "./middlewares/notFoundMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

// Danica 

import triageRouter from "./routes/triageRoute.js";
import consultationRouter from "./routes/consultationRoutes.js"
import prescriptionRouter from "./routes/prescriptionRoutes.js"

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute); 
app.use('/api/appointments', appointmentRoute);
app.use('/api/medicalRecords', medicalRecordRoute);
app.use('/api/billings', billingRoute);


app.use('/api/triage', triageRouter);
app.use("/api/consultation", consultationRouter);
app.use("/api/prescriptions", prescriptionRouter);

app.use(notFoundHandler);
app.use(errorHandler);



export default app;