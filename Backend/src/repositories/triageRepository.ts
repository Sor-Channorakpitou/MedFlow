import { PrismaClient, TriageStatus } from '@prisma/client';
import type { CreateTriageInput, UpdateTriageInput } from '../validations/triageValidation';

const prisma = new PrismaClient();

export class TriageRepository {
 async createTriage(data: CreateTriageInput) {
    return prisma.triage.create({
      data: {
        appointmentId: data.appointmentId,
        userId: data.userId,
        bloodPressure: data.bloodPressure || null,
        temperature: data.temperature || null,
        weight: data.weight || null,
        heartRate: data.heartRate || null,
        urgencyLevel: data.urgencyLevel as TriageStatus,
        note: data.note || null,
      },
      include: {
        appointment: { include: { patient: true } },
        user: { select: { id: true, name: true, email: true } },
      },
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
    return prisma.triage.update({
      where: { id: triageId },
      data: {
        bloodPressure: data.bloodPressure !== undefined ? data.bloodPressure : undefined,
        temperature: data.temperature !== undefined ? data.temperature : undefined,
        weight: data.weight !== undefined ? data.weight : undefined,
        heartRate: data.heartRate !== undefined ? data.heartRate : undefined,
        urgencyLevel: data.urgencyLevel ? (data.urgencyLevel as TriageStatus) : undefined,
        note: data.note !== undefined ? data.note : undefined,
      },
      include: {
        appointment: { include: { patient: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

}