import prisma from "../lib/prisma.js";
import { toMedicalRecordDTO } from "../utils/dataFormat.js";
export const insertRecord = async (data) => {
    if (!data.diagnosis ||
        !data.userId ||
        !data.patientId ||
        !data.appointmentId) {
        throw new Error("MISSING_REQUIRED_FIELDS");
    }
    const appointment = await prisma.appointment.findUnique({
        where: { id: data.appointmentId },
    });
    if (!appointment)
        throw new Error("NOT_FOUND");
    const patient = await prisma.patient.findUnique({
        where: { id: data.patientId },
    });
    if (!patient)
        throw new Error("NOT_FOUND");
    const doctor = await prisma.user.findUnique({
        where: { id: data.userId },
    });
    if (!doctor)
        throw new Error("NOT_FOUND");
    const existing = await prisma.medicalRecord.findUnique({
        where: { appointmentId: data.appointmentId },
    });
    if (existing)
        throw new Error("MEDICAL_RECORD_ALREADY_EXISTS");
    return toMedicalRecordDTO(await prisma.medicalRecord.create({
        data: {
            notes: data.notes?.trim() ?? null,
            diagnosis: data.diagnosis.trim(),
            userId: data.userId,
            patientId: data.patientId,
            appointmentId: data.appointmentId,
        },
        include: {
            patient: true,
            user: true,
            appointment: true,
        },
    }));
};
export const updateRecord = async (id, data) => {
    const record = await prisma.medicalRecord.findUnique({
        where: { id },
    });
    if (!record)
        throw new Error("NOT_FOUND");
    const updateData = {};
    if (data.notes !== undefined) {
        updateData.notes = data.notes.trim();
    }
    if (data.diagnosis !== undefined) {
        updateData.diagnosis = data.diagnosis.trim();
    }
    return toMedicalRecordDTO(await prisma.medicalRecord.update({
        where: { id },
        data: updateData,
        include: {
            patient: true,
            user: true,
            appointment: true,
        },
    }));
};
export const getPatientHistory = async (patientId) => {
    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
    });
    if (!patient)
        throw new Error("NOT_FOUND");
    const history = await prisma.medicalRecord.findMany({
        where: { patientId },
        include: {
            appointment: true,
            user: true,
            prescription: {
                include: {
                    prescriptionMedications: {
                        include: {
                            medication: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            visitDate: "desc",
        },
    });
    return history.map(toMedicalRecordDTO);
};
//# sourceMappingURL=medicalRecordService.js.map