import api from './api';

const RESOURCE_URL = '/triage'; 


export const createTriageRecord = async (triageData) => {
  const response = await api.post(RESOURCE_URL, triageData);
  return response.data;
};

export const getLiveQueue = async () => {
  const response = await api.get(`${RESOURCE_URL}/queue`, {
    params: { page: 1, limit: 50 },
  });
  return response.data;
};

export const getTriageByAppointment = async (appointmentId) => {
  const response = await api.get(`${RESOURCE_URL}/${appointmentId}`);
  return response.data;
};

export const updateTriageRecord = async (appointmentId, triageData) => {
  const response = await api.put(`${RESOURCE_URL}/${appointmentId}`, triageData);
  return response.data;
};


