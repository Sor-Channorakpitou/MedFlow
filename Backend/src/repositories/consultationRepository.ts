import prisma from "../lib/prisma.js";

export const findDoctorQueue = async () => {
  return prisma.queue.findMany({
    where: {
      stage: "DOCTOR",
      status: "WAITING",
    },
    include: {
      patient: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      queueNumber: "asc",
    },
  });
};

// 2. View a patient's historical medical records
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
        `Appointment with ID ${data.appointmentId} does not exist.`,
      );
    }

    const verifiedPatientId = appointmentExists.patientId;

    const queue = await tx.queue.findFirst({
      where: {
        appointmentId: data.appointmentId,
      },
    });

    if (!queue) {
      throw new Error("QUEUE_NOT_FOUND");
    }

    if (data.medications && data.medications.length > 0) {
      const uniqueMedIds = Array.from(
        new Set(data.medications.map((m: any) => Number(m.medicationId))),
      ) as number[];

      const existingMedications = await tx.medication.findMany({
        where: { id: { in: uniqueMedIds } },
        select: { id: true },
      });

      if (existingMedications.length !== uniqueMedIds.length) {
        throw new Error(
          "One or more medication IDs provided do not exist in the stock inventory.",
        );
      }
    }

    // A. Use upsert so testing multiple times with the same appointmentId won't crash!
    const record = await tx.medicalRecord.upsert({
      where: { appointmentId: data.appointmentId },
      update: {
        diagnosis: data.diagnosis,
        notes: data.notes || "",
        userId: doctorId,
      },
      create: {
        appointmentId: data.appointmentId,
        patientId: verifiedPatientId,
        userId: doctorId,
        diagnosis: data.diagnosis,
        notes: data.notes || "",
      },
    });

    // B. Create a single PENDING prescription header to group all medicines together
    if (data.medications && data.medications.length > 0) {
      await tx.prescription.deleteMany({
        where: { medicalRecordId: record.id },
      });

      const prescription = await tx.prescription.create({
        data: {
          status: "PENDING",
          medicalRecord: {
            connect: { id: record.id }
          },
          patient: {
            connect: { id: verifiedPatientId }
          },
          user: {
            connect: { id: doctorId }
          },
          appointment: {
            connect: { id: data.appointmentId }
          }
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

      console.log("Medication Records:", medicationRecords);
    }

    await tx.queue.updateMany({
      where: {
        appointmentId: data.appointmentId,
      },
      data: {
        stage: "PHARMACY",
        status: "WAITING",
        userId: null,
      },
    });

    return record;
  });
};

export const updateConsultation = async (
  appointmentId: number,
  diagnosis: string,
  notes: string | null,
) => {
  return await prisma.medicalRecord.update({
    where: {
      appointmentId,
    },
    data: {
      diagnosis,
      notes,
    },
  });
};
