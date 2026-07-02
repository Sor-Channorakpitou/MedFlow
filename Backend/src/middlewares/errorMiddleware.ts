import type { Request, Response, NextFunction } from "express";

export const errorHandler = ( err: any, req: Request, res: Response, next: NextFunction ) => {
    console.error(err);

    if (err.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    if (err.message === "NO_REFRESH_TOKEN") {
        return res.status(401).json({ 
            success: false,
            message: "No refresh token"
        });
    }   

    if (err.message === "NOT_FOUND") {
        return res.status(404).json({
            success: false,
            message: "Not found"
        });
    }

    if (err.message === "NO_RESOURCES") {
        return res.status(404).json({
            success: false,
            message: "No resources"
        });
    }

    if (err.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
            success: false,
            message: "Email already exists"
        });
    }

    if (err.message === "PATIENT_ALREADY_EXISTS") {
        return res.status(409).json({
            success: false,
            message: "Email already exists"
        });
    }

    if (err.message === "INVOICE_ALREADY_EXISTS") {
        return res.status(409).json({
            success: false,
            message: "Invoice already exists"
        });
    }

    if (err.message === "PASSWORD_TOO_SHORT") {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters"
        });
    }

    if (err.message === "PASSWORD_MISSING_UPPERCASE") {
        return res.status(400).json({
            success: false,
            message: "Password must contain an uppercase letter"
        });
    }

    if (err.message === "PASSWORD_MISSING_LOWERCASE") {
        return res.status(400).json({
            success: false,
            message: "Password must contain a lowercase letter"
        });
    }

    if (err.message === "PASSWORD_MISSING_NUMBER") {
        return res.status(400).json({
            success: false,
            message: "Password must contain a number"
        });
    }

    if (err.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(400).json({
            success: false,
            message: "Email is already existed"
        });
    }

    if (err.message === "INVALID_TIME_RANGE") {
        return res.status(400).json({
            success: false,
            message: "Invalid time range"
        });
    }

    if (err.message === "APPOINTMENT_TIME_CONFLICT") {
        return res.status(409).json({
            success: false,
            message: "Appointment time conflict"
        });
    }

    if (err.message === "ALREADY_CANCELLED") {
        return res.status(400).json({
            success: false,
            message: "Already cancelled"
        });
    }

    if (err.message === "MEDICAL_RECORD_ALREADY_EXISTS") {
        return res.status(409).json({
            success: false,
            message: "Medical record already exists"
        });
    }

    if (err.message === "ALREADY_PAID") {
        return res.status(409).json({
            success: false,
            message: "Invoice already marked as paid"
        });
    }

    // fallback (unknown errors)
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};