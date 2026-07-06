import prisma from "../lib/prisma.js";

// 1. Get all pending prescriptions
export const findPendingPrescriptions = async () => {
  return await prisma.prescription.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      patient: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          dateOfBirth: true,
        },
      },

      user: {
        select: {
          name: true,
        },
      },

      medicalRecord: {
        select: {
          diagnosis: true,
          notes: true,
        },
      },

      prescriptionMedications: {
        include: {
          medication: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

// 2. Get prescription details
export const findPrescriptionById = async (id: number) => {
  return await prisma.prescription.findUnique({
    where: {
      id,
    },
    include: {
      patient: true,
      user: {
        select: {
          name: true,
        },
      },
      medicalRecord: {
        select: {
          diagnosis: true,
          notes: true,
        },
      },
      prescriptionMedications: {
        include: {
          medication: true,
        },
      },
    },
  });
};

// 3. Dispense prescription
export const executeDispenseTransaction = async (id: number) => {
  return await prisma.$transaction(async (tx) => {
    const prescription = await tx.prescription.findUnique({
      where: { id },
      include: {
        prescriptionMedications: true,
      },
    });

    if (!prescription) {
      throw new Error("Prescription not found.");
    }

    if (prescription.status === "SENT") {
      throw new Error("Prescription has already been dispensed.");
    }

    for (const item of prescription.prescriptionMedications) {
      const medication = await tx.medication.findUnique({
        where: {
          id: item.medicationId,
        },
      });

      if (!medication) {
        throw new Error(`Medication ID ${item.medicationId} does not exist.`);
      }

      if (medication.stockQuantity < item.dosage) {
        throw new Error(`Insufficient stock for ${medication.name}.`);
      }

      await tx.medication.update({
        where: {
          id: item.medicationId,
        },
        data: {
          stockQuantity: {
            decrement: item.dosage,
          },
        },
      });
    }

    const updatedPrescription = await tx.prescription.update({
      where: { id },
      data: { status: "SENT" },
    });

    await tx.queue.update({
      where: { appointmentId: prescription.appointmentId },
      data: {
        stage: "BILLING",
        status: "WAITING",
      },
    });

    await tx.queue.updateMany({
      where: { patientId: prescription.patientId },
      data: { stage: "COMPLETED", status: "COMPLETED", userId: null },
    });

    return updatedPrescription;
  });
};
