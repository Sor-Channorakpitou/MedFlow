import { toPatientDTO } from "../utils/dataFormat.js";
import prisma from "../lib/prisma.js";
export const insertPatient = async (data) => {
    if (!data.fullName ||
        !data.gender ||
        !data.phone ||
        !data.address ||
        !data.dateOfBirth)
        throw new Error("MISSING_REQUIRED_FIELDS");
    const VALID_GENDERS = ["MALE", "FEMALE", "OTHER"];
    if (!VALID_GENDERS.includes(data.gender.toUpperCase())) {
        throw new Error("INVALID_GENDER");
    }
    const existing = await prisma.patient.findFirst({
        where: {
            AND: [
                { phone: data.phone },
                { fullName: data.fullName }
            ]
        }
    });
    if (existing) {
        throw new Error("PATIENT_ALREADY_EXISTS");
    }
    return toPatientDTO(await prisma.patient.create({
        data: {
            fullName: data.fullName.trim(),
            gender: data.gender.toUpperCase(),
            phone: data.phone.trim(),
            address: data.address.trim(),
            dateOfBirth: new Date(data.dateOfBirth),
        },
        select: {
            id: true,
            fullName: true,
            gender: true,
            phone: true,
            address: true,
            dateOfBirth: true
        }
    }));
};
export const findAllPatients = async () => {
    const patients = await prisma.patient.findMany();
    if (!patients)
        throw new Error("NOT_FOUND");
    return patients.map(toPatientDTO);
};
export const findPatientById = async (id) => {
    const patient = await prisma.patient.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            gender: true,
            phone: true,
            address: true,
            dateOfBirth: true
        }
    });
    if (!patient)
        throw new Error("NOT_FOUND");
    return toPatientDTO(patient);
};
export const modifyPatient = async (id, data) => {
    const patient = await prisma.patient.findUnique({
        where: { id }
    });
    if (!patient)
        throw new Error("NOT_FOUND");
    const updateData = {};
    if (data.phone !== undefined) {
        const existing = await prisma.user.findFirst({
            where: { phone: data.phone }
        });
        if (existing && existing.id !== id) {
            throw new Error("PATIENT_ALREADY_EXISTS");
        }
        updateData.phone = data.phone.trim();
    }
    ;
    if (data.fullName !== undefined)
        updateData.name = data.fullName;
    if (data.phone !== undefined)
        updateData.phone = data.phone;
    if (data.dateOfBirth !== undefined)
        updateData.dateOfBirth = data.dateOfBirth;
    return toPatientDTO(await prisma.patient.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            fullName: true,
            gender: true,
            phone: true,
            address: true,
            dateOfBirth: true
        }
    }));
};
export const removePatient = async (id) => {
    const patient = await prisma.patient.findUnique({
        where: { id }
    });
    if (!patient)
        throw new Error("USER_NOT_FOUND");
    return toPatientDTO(await prisma.patient.delete({ where: { id } }));
};
//# sourceMappingURL=patientService.js.map