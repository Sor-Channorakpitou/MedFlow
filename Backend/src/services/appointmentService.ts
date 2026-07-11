import prisma from "../lib/prisma.js";
import { toAppointmentDTO } from "../utils/dataFormat.js";

enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

type AppointmentInfo = {
  reason: string;
  appointmentDate: Date;
  status: AppointmentStatus;
  startTime: Date;
  endTime: Date;
  userId: number;
  patientId: number;
};

const validateTimeRange = (start: Date, end: Date) => {
  if (start >= end) {
    throw new Error("INVALID_TIME_RANGE");
  }
};

export const insertAppointment = async (data: AppointmentInfo) => {
    if (
      !data.appointmentDate ||
      !data.status ||
      !data.startTime ||
      !data.endTime ||
      !data.userId ||
      !data.patientId
    ) {
      throw new Error("MISSING_REQUIRED_FIELDS");
    }

    validateTimeRange(data.startTime, data.endTime);

    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });

    if (!patient) throw new Error("NOT_FOUND");

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) throw new Error("USER_NOT_FOUND");

    const conflict = await prisma.appointment.findFirst({
      where: {
        userId: data.userId,
        OR: [
          {
            AND: [
              { startTime: { lt: data.endTime } },
              { endTime: { gt: data.startTime } },
            ],
          },
        ],
      },
    });

    if (conflict) throw new Error("APPOINTMENT_TIME_CONFLICT");

    return toAppointmentDTO(
      await prisma.appointment.create({
        data: {
          reason: data.reason?.trim(),
          appointmentDate: new Date(data.appointmentDate),
          status: data.status,
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          userId: data.userId,
          patientId: data.patientId,
        },
        include: {
          patient: true,
          user: true,
        },
      })
    );
};

export const findAppointments = async () => {
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      user: { include: { role: true } },
      triage: true,
      invoice: true,
      queue: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return appointments.map(toAppointmentDTO);
};

export const findAppointmentById = async (id: number) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      user: true,
      invoice: true,
      medicalRecord: true,
      triage: true,
    },
  });

  if (!appointment) throw new Error("NOT_FOUND");

  return toAppointmentDTO(appointment);
};

export const modifyAppointment = async (id: number, data: Partial<AppointmentInfo>) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!appointment) throw new Error("NOT_FOUND");

  const updateData: any = {};

  if (data.reason !== undefined) {
    updateData.reason = data.reason?.trim();
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.startTime !== undefined) {
    updateData.startTime = new Date(data.startTime);
  }

  if (data.endTime !== undefined) {
    updateData.endTime = new Date(data.endTime);
  }

  if (updateData.startTime && updateData.endTime) {
    validateTimeRange(updateData.startTime, updateData.endTime);
  }

  return toAppointmentDTO(
    await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        user: true,
      },
    })
  );
};

export const cancelAppointment = async (id: number) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!appointment) throw new Error("NOT_FOUND");

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new Error("ALREADY_CANCELLED");
  }

  return toAppointmentDTO(
    await prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
      },
      include: {
        patient: true,
        user: true,
      },
    })
  );
};

export const assignDoctor = async (appointmentId: number, userId: number) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) throw new Error("NOT_FOUND");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("NOT_FOUND");

  return toAppointmentDTO(
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        userId,
      },
      include: {
        patient: true,
        user: true,
      },
    })
  );
};