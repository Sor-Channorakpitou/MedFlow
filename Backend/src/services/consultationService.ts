import * as consultRepo from "../repositories/consultationRepository.js";

export const getDoctorWaitingQueue = async () => {
  return await consultRepo.findDoctorQueue();
};

export const getPatientHistory = async (patientId: number) => {
  return await consultRepo.findHistoryByPatientId(patientId);
};

export const logNewConsultation = async (data: any, doctorId: number) => {
  return await consultRepo.saveConsultation(data, doctorId);
};

export const editConsultation = async (
  appointmentId: number,
  diagnosis: string,
  notes: string | null
) => {
  return await consultRepo.updateConsultation(
    appointmentId,
    diagnosis,
    notes
  );
};

export const getDoctorDailyLog = async (doctorId: number) => {
  return await consultRepo.findDailyLogByDoctor(doctorId);
};