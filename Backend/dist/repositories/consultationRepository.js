import prisma from "../lib/prisma.js";
// 1. Get all appointments waiting for the doctor
export const findDoctorQueue = async () => {
    return await prisma.appointment.findMany({
        where: { status: "PENDING" },
        include: {
            patient: true,
            triage: true
        },
        orderBy: { appointmentDate: "asc" }
    });
};
// 2. View a patient's historical medical records
export const findHistoryByPatientId = async (patientId) => {
    return await prisma.medicalRecord.findMany({
        where: { patientId },
        include: {
            user: { select: { name: true } },
            prescription: {
                include: {
                    prescriptionMedications: { include: { medication: true } }
                }
            }
        },
        orderBy: { visitDate: "desc" }
    });
};
export const saveConsultation = async (data, doctorId) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Safety check: Verify the appointment exists first
        const appointmentExists = await tx.appointment.findUnique({
            where: { id: data.appointmentId }
        });
        if (!appointmentExists) {
            throw new Error(`Appointment with ID ${data.appointmentId} does not exist.`);
        }
        const verifiedPatientId = appointmentExists.patientId;
        if (data.medications && data.medications.length > 0) {
            // Ensure medication IDs are numbers to satisfy Prisma typing
            const uniqueMedIds = Array.from(new Set(data.medications.map((m) => Number(m.medicationId))));
            const existingMedications = await tx.medication.findMany({
                where: { id: { in: uniqueMedIds } },
                select: { id: true }
            });
            if (existingMedications.length !== uniqueMedIds.length) {
                throw new Error("One or more medication IDs provided do not exist in the stock inventory.");
            }
        }
        // A. Use upsert so testing multiple times with the same appointmentId won't crash!
        const record = await tx.medicalRecord.upsert({
            where: { appointmentId: data.appointmentId },
            update: {
                diagnosis: data.diagnosis,
                notes: data.notes || "",
                userId: doctorId
            },
            create: {
                appointmentId: data.appointmentId,
                patientId: verifiedPatientId,
                userId: doctorId,
                diagnosis: data.diagnosis,
                notes: data.notes || ""
            }
        });
        // B. Create a single PENDING prescription header to group all medicines together
        if (data.medications && data.medications.length > 0) {
            // Clean old prescription if it exists to avoid 1-to-1 unique blocks during multiple tests
            await tx.prescription.deleteMany({
                where: { medicalRecordId: record.id }
            });
            const prescription = await tx.prescription.create({
                data: {
                    patientId: verifiedPatientId,
                    userId: doctorId,
                    medicalRecordId: record.id,
                    status: "PENDING"
                }
            });
            const medicationRecords = data.medications.map((med) => ({
                prescriptionId: prescription.id,
                medicationId: med.medicationId,
                dosage: med.dosage,
                frequency: med.frequency,
                duration: med.duration
            }));
            await tx.prescriptionMedication.createMany({
                data: medicationRecords
            });
            console.log("Medication Records:", medicationRecords);
        }
        await tx.appointment.update({
            where: { id: data.appointmentId },
            data: { status: "COMPLETED" }
        });
        return record;
    });
};
// 4. Retrieve a list of consultations handled by a single doctor today
export const findDailyLogByDoctor = async (doctorId) => {
    const cleanDoctorId = Number(doctorId);
    return await prisma.medicalRecord.findMany({
        where: {
            userId: cleanDoctorId
        },
        include: {
            patient: true,
            appointment: true
        },
        orderBy: { visitDate: "desc" }
    });
};
export const updateConsultation = async (appointmentId, diagnosis, notes) => {
    return await prisma.medicalRecord.update({
        where: {
            appointmentId
        },
        data: {
            diagnosis,
            notes
        }
    });
};
//# sourceMappingURL=consultationRepository.js.map