export const formatDateOnly = (date: Date | string | null | undefined) => {
    if (!date) return null;

    return new Date(date).toISOString().split("T")[0];
};

export const toUserDTO = (user: any) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    roleId: user.roleId,
    dateOfBirth: formatDateOnly(user.dateOfBirth)
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
    userId: appointment.userId,  // Verify if needed to be specific rolea
    patientId: appointment.patientId,
});
