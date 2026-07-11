import prisma from "../lib/prisma.js";
// 1. Create Triage Record (POST)
export const createTriageRecord = async (data) => {
    const appointment = await prisma.appointment.findUnique({
        where: { id: data.appointmentId }
    });
    if (!appointment)
        throw new Error("APPOINTMENT_NOT_FOUND");
    const existingTriage = await prisma.triage.findUnique({
        where: { appointmentId: data.appointmentId }
    });
    if (existingTriage)
        throw new Error("TRIAGE_ALREADY_EXISTS");
    return await prisma.$transaction(async (tx) => {
        const triage = await tx.triage.create({
            data: {
                appointmentId: data.appointmentId,
                userId: data.userId,
                bloodPressure: data.bloodPressure ?? null,
                temperature: data.temperature ?? null,
                weight: data.weight ?? null,
                heartRate: data.heartRate ?? null,
                urgencyLevel: data.urgencyLevel,
                note: data.note ?? null
            }
        });
        await tx.appointment.update({
            where: { id: data.appointmentId },
            data: { status: "CONFIRMED" }
        });
        return triage;
    });
};
// 2. Get Live Sorted Queue (GET /queue)
export const getSortedQueue = async () => {
    return await prisma.triage.findMany({
        where: {
            appointment: { status: "CONFIRMED" }
        },
        include: {
            appointment: { include: { patient: true } }
        },
        orderBy: [
            { urgencyLevel: "desc" }, // CRITICAL -> HIGH -> MEDIUM -> LOW[cite: 1]
            { createdAt: "asc" } // First-come, first-served within the same tier[cite: 1]
        ]
    });
};
// 3. Get All Triage History Records (GET /)
export const getAllTriageRecords = async () => {
    return await prisma.triage.findMany({
        include: {
            appointment: { include: { patient: true } }
        },
        orderBy: { createdAt: "desc" }
    });
};
// 4. Filter Queue by Urgency (FIXED: Checks both PENDING and CONFIRMED active states)
export const getFilteredQueueByUrgency = async (urgency) => {
    return await prisma.triage.findMany({
        where: {
            urgencyLevel: urgency,
            appointment: {
                status: { in: ["PENDING", "CONFIRMED"] } // Ensures it doesn't show COMPLETED appointments
            }
        },
        include: {
            appointment: { include: { patient: true } }
        },
        orderBy: { createdAt: "asc" }
    });
};
// 5. Get Triage by Appointment ID (GET /appointment/:id)
export const getTriageByAppointmentId = async (appointmentId) => {
    return await prisma.triage.findUnique({
        where: { appointmentId },
        include: {
            appointment: { include: { patient: true } }
        }
    });
};
// 6. Update Vitals or Urgency (FIXED: Pure type casting safety)
export const updateTriageRecord = async (appointmentId, updates) => {
    const existing = await prisma.triage.findUnique({ where: { appointmentId } });
    if (!existing)
        throw new Error("TRIAGE_RECORD_NOT_FOUND");
    const data = {};
    if (updates.bloodPressure !== undefined)
        data.bloodPressure = updates.bloodPressure;
    if (updates.temperature !== undefined)
        data.temperature = updates.temperature;
    if (updates.weight !== undefined)
        data.weight = updates.weight;
    if (updates.heartRate !== undefined)
        data.heartRate = updates.heartRate;
    if (updates.urgencyLevel !== undefined)
        data.urgencyLevel = updates.urgencyLevel;
    if (updates.note !== undefined)
        data.note = updates.note;
    return await prisma.triage.update({
        where: { appointmentId },
        data
    });
};
// 7. Delete Triage Record & Revert Status (DELETE /:id)
export const deleteTriageRecord = async (appointmentId) => {
    const existing = await prisma.triage.findUnique({ where: { appointmentId } });
    if (!existing)
        throw new Error("TRIAGE_RECORD_NOT_FOUND");
    return await prisma.$transaction(async (tx) => {
        await tx.triage.delete({ where: { appointmentId } });
        await tx.appointment.update({
            where: { id: appointmentId },
            data: { status: "PENDING" }
        });
    });
};
//# sourceMappingURL=triageService.js.map