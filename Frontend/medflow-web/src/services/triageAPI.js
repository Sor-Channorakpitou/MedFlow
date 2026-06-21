import axios from 'axios';

// Vite reads env variables using import.meta.env instead of process.env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_BASE_URL = `${BASE_URL}/triage`;

/**
 * Helper function to automatically attach the JWT 
 * Authorization bearer token from localStorage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

/**
 * 1. Create Triage Record (POST)
 */
export const createTriageRecord = async (triageData) => {
  const response = await axios.post(`${API_BASE_URL}`, triageData, getAuthHeaders());
  return response.data;
};

/**
 * 2. Get Live Priority Sorted Queue (GET)
 */
export const getLiveQueue = async () => {
  const response = await axios.get(`${API_BASE_URL}/queue`, getAuthHeaders());
  return response.data;
};

/**
 * 3. Filter Queue by Urgency Level (GET)
 */
export const filterQueueByUrgency = async (urgency) => {
  const response = await axios.get(`${API_BASE_URL}/filter?urgency=${urgency}`, getAuthHeaders());
  return response.data;
};

/**
 * 4. Update Patient Vitals or Urgency (PUT)
 */
export const updateTriageRecord = async (triageData) => {
  const response = await axios.put(`${API_BASE_URL}`, triageData, getAuthHeaders());
  return response.data;
};

/**
 * 5. Delete Triage / Revert Patient (DELETE)
 */
export const deleteTriageRecord = async (appointmentId) => {
  const response = await axios.delete(`${API_BASE_URL}/${appointmentId}`, getAuthHeaders());
  return response.data;
};