import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import { notFoundHandler } from "./middlewares/notFoundMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

// Danica 

import triageRouter from "./routes/triageRoute.js";
import consultationRouter from "./routes/consultationRoutes.js"

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute); 


app.use('/api/triage', triageRouter);
app.use("/api/consultation", consultationRouter)

app.use(notFoundHandler);
app.use(errorHandler);



export default app;