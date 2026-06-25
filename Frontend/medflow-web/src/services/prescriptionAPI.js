import axios from 'axios';


const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_BASE_URL = `${BASE_URL}/prescriptions`;


const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};


export const getPendingPrescriptions = async () => {
  const response = await axios.get(`${API_BASE_URL}/pending`, getAuthHeaders());
  return response.data;
};

export const getPrescriptionById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeaders());
  return response.data;
};


export const dispensePrescription = async (id) => {
  const response = await axios.put(`${API_BASE_URL}/${id}/dispense`, {}, getAuthHeaders());
  return response.data;
};