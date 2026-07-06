export const formatDateOnly = (date?: Date | string | null | undefined) => {
  if (!date) return null;

  return new Date(date).toISOString().split("T")[0];
};

export const formatTimeOnly = (date?: Date | string | null | undefined) => {
    if (!date) return null;

    return new Date(date).toLocaleTimeString([], { 
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, 
    })
};

export const toUserDTO = (user: any) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    roleId: user.roleId,
    role: user.role
        ? {
            id: user.role.id,
            name: user.role.name,
        }
        : null,
    dateOfBirth: formatDateOnly(user.dateOfBirth),
    profileImage: user.profileImage,
    isActive: user.isActive,
});

export const toPatientDTO = (patient: any) => ({
    id: patient.id,
    fullName: patient.fullName,
    gender: patient.gender,
    phone: patient.phone,
    address: patient.address,
    dateOfBirth: formatDateOnly(patient.dateOfBirth)
});

export const toAppointmentDTO = (appointment: any) => ({
    id: appointment.id,
    reason: appointment.reason,
    appointmentDate: formatDateOnly(appointment.appointmentDate),
    status: appointment.status,
    createdAt: appointment.createdAt,
    userId: appointment.userId,
    patientId: appointment.patientId,
    endTime: formatTimeOnly(appointment.endTime),
    startTime: formatTimeOnly(appointment.startTime),
    queue: appointment.queue,
    invoice: appointment.invoice,
    medicalRecord: appointment.medicalRecord,

    patient: appointment.patient
      ? {
          id: appointment.patient.id,
          fullName: appointment.patient.fullName,
          gender: appointment.patient.gender,
          phone: appointment.patient.phone,
        }
      : null,

    user: appointment.user
      ? {
          id: appointment.user.id,
          name: appointment.user.name,
          role: appointment.user.role?.name ?? null,
        }
      : null,

    urgencyLevel: appointment.triage?.urgencyLevel ?? null,
});

export const toMedicalRecordDTO = (record: any) => ({
  id: record.id,
  notes: record.notes,
  diagnosis: record.diagnosis,
  visitDate: formatDateOnly(record.visitDate),
  userId: record.userId,
  patientId: record.patientId,
  appointmentId: record.appointmentId,
});

export const toInvoiceDTO = (invoice: any) => ({
  id: invoice.id,
  paymentMethod: invoice.paymentMethod,
  issuedDate: formatDateOnly(invoice.issuedDate),
  paymentStatus: invoice.paymentStatus,
  totalAmount: Number(invoice.totalAmount),
  invoiceItem: invoice.invoiceItems,

  appointmentId: invoice.appointmentId,
  patientId: invoice.patientId,
  userId: invoice.userId,
});
