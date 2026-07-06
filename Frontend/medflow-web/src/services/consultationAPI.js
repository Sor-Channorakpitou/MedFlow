import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_BASE_URL = `${BASE_URL}/consultation`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

export const getAwaitingPatients = async () => {
  const response = await axios.get(`${API_BASE_URL}/queue`, getAuthHeaders());
  return response.data;
};

export const getPatientHistory = async (patientId) => {
  const response = await axios.get(`${API_BASE_URL}/history/${patientId}`, getAuthHeaders());
  return response.data;
};

export const submitConsultation = async (consultationData) => {
  const response = await axios.post(`${API_BASE_URL}`, consultationData, getAuthHeaders());
  return response.data;
};

export const updateConsultation = async ( appointmentId, updatedData ) => { 
  const response = await axios.put( `${API_BASE_URL}/${appointmentId}`, updatedData, getAuthHeaders() );
  return response.data; 
};
