import { PrismaClient, TriageStatus } from "@prisma/client";
import type { CreateTriageInput, UpdateTriageInput } from "../validations/triageValidation.js";

const prisma = new PrismaClient();

export class TriageRepository {
  async createTriage(data: CreateTriageInput) {
    return prisma.$transaction(async (tx) => {
      const appointmentId = data.appointmentId;
      if (appointmentId === null || appointmentId === undefined) {
        throw new Error("APPOINTMENT_ID_REQUIRED");
      }

      const appointment = await tx.appointment.findUnique({
        where: {
          id: appointmentId,
        },
      });

      if (!appointment) {
        throw new Error("APPOINTMENT_NOT_FOUND");
      }

      const existing = await tx.triage.findUnique({
        where: {
          appointmentId,
        },
      });

      if (existing) {
        throw new Error("TRIAGE_ALREADY_EXISTS");
      }

      const triage = await tx.triage.create({
        data: {
          appointmentId,
          userId: data.userId,
          bloodPressure: data.bloodPressure ?? null,
          temperature: data.temperature ?? null,
          weight: data.weight ?? null,
          heartRate: data.heartRate ?? null,
          urgencyLevel: data.urgencyLevel,
          note: data.note ?? null,
        },
        include: {
          appointment: {
            include: {
              patient: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await tx.queue.updateMany({
        where: {
          patientId: appointment.patientId,
        },
        data: {
          stage: "DOCTOR",
          status: "WAITING",
          currentUserId: null,
        },
      });

      return triage;
    });
  }

  async getTriageByAppointmentId(appointmentId: number) {
    return prisma.triage.findUnique({
      where: { appointmentId },
      include: {
        appointment: { include: { patient: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async updateTriage(triageId: number, data: UpdateTriageInput) {
    const updateData: Record<string, any> = {};

    if (data.bloodPressure !== undefined) {
      updateData.bloodPressure = data.bloodPressure;
    }
    if (data.temperature !== undefined) {
      updateData.temperature = data.temperature;
    }
    if (data.weight !== undefined) {
      updateData.weight = data.weight;
    }
    if (data.heartRate !== undefined) {
      updateData.heartRate = data.heartRate;
    }
    if (data.urgencyLevel !== undefined) {
      updateData.urgencyLevel = data.urgencyLevel as TriageStatus;
    }
    if (data.note !== undefined) {
      updateData.note = data.note;
    }

    return prisma.triage.update({
      where: { id: triageId },
      data: updateData,
      include: {
        appointment: { include: { patient: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
