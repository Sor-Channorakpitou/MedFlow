import api from './api';

export const getAllMedications = async () => {
  const response = await api.get('/medications');
  return response.data;
};