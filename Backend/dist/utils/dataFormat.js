export const formatDateOnly = (date) => {
    if (!date)
        return null;
    return new Date(date).toISOString().split("T")[0];
};
export const toUserDTO = (user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    roleId: user.roleId,
    dateOfBirth: formatDateOnly(user.dateOfBirth)
});
export const toPatientDTO = (patient) => ({
    id: patient.id,
    fullName: patient.fullName,
    gender: patient.gender,
    phone: patient.phone,
    address: patient.address,
    dateOfBirth: formatDateOnly(patient.dateOfBirth)
});
export const toAppointmentDTO = (appointment) => ({
    id: appointment.id,
    reason: appointment.reason,
    appointmentDate: formatDateOnly(appointment.appointmentDate),
    status: appointment.status,
    userId: appointment.userId,
    patientId: appointment.patientId,
});
export const toMedicalRecordDTO = (record) => ({
    id: record.id,
    notes: record.notes,
    diagnosis: record.diagnosis,
    visitDate: record.visitDate,
    userId: record.userId,
    patientId: record.patientId,
    appointmentId: record.appointmentId,
});
export const toInvoiceDTO = (invoice) => ({
    id: invoice.id,
    paymentMethod: invoice.paymentMethod,
    issuedDate: invoice.issuedDate,
    paymentStatus: invoice.paymentStatus,
    totalAmount: Number(invoice.totalAmount),
    appointmentId: invoice.appointmentId,
    patientId: invoice.patientId,
    userId: invoice.userId,
});
//# sourceMappingURL=dataFormat.js.map