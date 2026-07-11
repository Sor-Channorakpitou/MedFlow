import prisma from "../lib/prisma.js";

// Doctor queue filtered by specialty, shows WAITING + PROCESSING
export const findDoctorQueue = async (specialtyId?: number) => {
  return prisma.queue.findMany({
    where: {
      stage: "DOCTOR",
      status: { in: ["WAITING", "PROCESSING"] },
      ...(specialtyId !== undefined && { requiredSpecialtyId: specialtyId }),
    },
    include: {
      patient: true,
      appointment: {
        include: {
          triage: { select: { urgencyLevel: true } },
        },
      },
      currentUser: {
        select: { id: true, name: true },
      },
    },
    orderBy: { queueNumber: "asc" },
  });
};

// Doctor claims a WAITING patient → PROCESSING
export const claimConsultationPatient = async (
  queueId: number,
  doctorId: number
) => {
  const queue = await prisma.queue.findUnique({
    where: { id: queueId },
  });

  if (!queue) throw new Error("QUEUE_NOT_FOUND");
  if (queue.stage !== "DOCTOR") throw new Error("QUEUE_NOT_IN_DOCTOR_STAGE");
  if (queue.status !== "WAITING") throw new Error("QUEUE_ALREADY_CLAIMED");

  return prisma.queue.update({
    where: { id: queueId },
    data: {
      status: "PROCESSING",
      currentUserId: doctorId,
    },
    include: {
      patient: true,
      currentUser: {
        select: { id: true, name: true },
      },
    },
  });
};

// Patient's full medical record history
export const findHistoryByPatientId = async (patientId: number) => {
  return await prisma.medicalRecord.findMany({
    where: { patientId },
    include: {
      user: { select: { name: true } },
      prescription: {
        include: {
          prescriptionMedications: { include: { medication: true } },
        },
      },
    },
    orderBy: { visitDate: "desc" },
  });
};

export const saveConsultation = async (data: any, doctorId: number) => {
  return await prisma.$transaction(async (tx) => {
    const appointmentExists = await tx.appointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointmentExists) {
      throw new Error(
        `Appointment with ID ${data.appointmentId} does not exist.`
      );
    }

    const verifiedPatientId = appointmentExists.patientId;

    const queue = await tx.queue.findFirst({
      where: { appointmentId: data.appointmentId },
    });

    if (!queue) throw new Error("QUEUE_NOT_FOUND");

    if (data.medications && data.medications.length > 0) {
      const uniqueMedIds = Array.from(
        new Set(data.medications.map((m: any) => Number(m.medicationId)))
      ) as number[];

      const existingMedications = await tx.medication.findMany({
        where: { id: { in: uniqueMedIds } },
        select: { id: true },
      });

      if (existingMedications.length !== uniqueMedIds.length) {
        throw new Error(
          "One or more medication IDs provided do not exist in the stock inventory."
        );
      }
    }

    // A. Upsert medical record so re-submissions on same appointmentId won't crash
    const record = await tx.medicalRecord.upsert({
      where: { appointmentId: data.appointmentId },
      update: {
        diagnosis: data.diagnosis,
        notes: data.notes || "",
        userId: doctorId,
        needsFollowUp: data.needsFollowUp ?? false,
      },
      create: {
        appointmentId: data.appointmentId,
        patientId: verifiedPatientId,
        userId: doctorId,
        diagnosis: data.diagnosis,
        notes: data.notes || "",
        needsFollowUp: data.needsFollowUp ?? false,
      },
    });

    const hasMedications = data.medications && data.medications.length > 0;

    // B. Create prescription + medications when prescribed
    if (hasMedications) {
      await tx.prescription.deleteMany({
        where: { medicalRecordId: record.id },
      });

      const prescription = await tx.prescription.create({
        data: {
          status: "PENDING",
          medicalRecord: { connect: { id: record.id } },
          patient: { connect: { id: verifiedPatientId } },
          user: { connect: { id: doctorId } },
          appointment: { connect: { id: data.appointmentId } },
        },
      });

      const medicationRecords = data.medications.map((med: any) => ({
        prescriptionId: prescription.id,
        medicationId: med.medicationId,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
      }));

      await tx.prescriptionMedication.createMany({
        data: medicationRecords,
      });
    }

    // C. Skip PHARMACY and go straight to BILLING when no medications prescribed
    const nextStage = hasMedications ? "PHARMACY" : "BILLING";

    await tx.queue.updateMany({
      where: { appointmentId: data.appointmentId },
      data: {
        stage: nextStage,
        status: "WAITING",
        currentUserId: null,
      },
    });

    return { record, nextStage };
  });
};

export const updateConsultation = async (
  appointmentId: number,
  diagnosis: string,
  notes: string | null
) => {
  return await prisma.medicalRecord.update({
    where: { appointmentId },
    data: { diagnosis, notes },
  });
};
