import * as consultRepo from "../repositories/consultationRepository.js";
export const getDoctorWaitingQueue = async () => {
    return await consultRepo.findDoctorQueue();
};
export const getPatientHistory = async (patientId) => {
    return await consultRepo.findHistoryByPatientId(patientId);
};
export const logNewConsultation = async (data, doctorId) => {
    return await consultRepo.saveConsultation(data, doctorId);
};
export const editConsultation = async (appointmentId, diagnosis, notes) => {
    return await consultRepo.updateConsultation(appointmentId, diagnosis, notes);
};
export const getDoctorDailyLog = async (doctorId) => {
    return await consultRepo.findDailyLogByDoctor(doctorId);
};
//# sourceMappingURL=consultationService.js.map