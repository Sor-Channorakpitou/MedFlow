import api from './api';
const RESOURCE_URL = '/consultation';

export const getAwaitingPatients = async () => {
  const response = await api.get(`${RESOURCE_URL}/queue`);
  return response.data;
};

export const getPatientHistory = async (patientId) => {
  const response = await api.get(`${RESOURCE_URL}/history/${patientId}`);
  return response.data;
};

export const submitConsultation = async (consultationData) => {
  const response = await api.post(RESOURCE_URL, consultationData);
  return response.data;
};

export const updateConsultation = async (appointmentId, updatedData) => {

  const response = await api.put(`${RESOURCE_URL}/${appointmentId}`, updatedData);
  return response.data;
};

/**
 * Doctor claims a waiting consultation patient.
 * PATCH /consultation/queue/:queueId/claim
 */
export const claimConsultationPatient = async (queueId) => {
  const response = await api.patch(`${RESOURCE_URL}/queue/${queueId}/claim`);
  return response.data;
};
