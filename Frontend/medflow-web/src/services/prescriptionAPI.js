
import api from './api';
const RESOURCE_URL = '/prescriptions';

export const getPendingPrescriptions = async () => {
  const response = await api.get(`${RESOURCE_URL}/pending`);
  return response.data;
};
export const getPrescriptionById = async (id) => {
  const response = await api.get(`${RESOURCE_URL}/${id}`);
  return response.data;
};
export const dispensePrescription = async (id) => {
  const response = await api.put(`${RESOURCE_URL}/${id}/dispense`);
  return response.data;
};