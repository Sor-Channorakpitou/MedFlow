import axios from 'axios';


const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_BASE_URL = `${BASE_URL}/triage`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

export const createTriageRecord = async (triageData) => {
  const response = await axios.post(`${API_BASE_URL}`, triageData, getAuthHeaders());
  return response.data;
};

export const getLiveQueue = async () => {
  const response = await axios.get(`${API_BASE_URL}/queue`, getAuthHeaders());
  return response.data;
};


export const filterQueueByUrgency = async (urgency) => {
  const response = await axios.get(`${API_BASE_URL}/filter?urgency=${urgency}`, getAuthHeaders());
  return response.data;
};


export const updateTriageRecord = async (triageData) => {
  const response = await axios.put(`${API_BASE_URL}`, triageData, getAuthHeaders());
  return response.data;
};


export const deleteTriageRecord = async (appointmentId) => {
  const response = await axios.delete(`${API_BASE_URL}/${appointmentId}`, getAuthHeaders());
  return response.data;
};