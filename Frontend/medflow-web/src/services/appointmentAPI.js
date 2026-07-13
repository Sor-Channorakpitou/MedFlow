// services/appointmentAPI.js
import api from "./api";
const API_BASE_URL = '/appointments';

export const getAllAppointments = async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const res = await api.get(`${API_BASE_URL}`, { params });
    return res.data;
};

export const getAppointmentById = async (id) => {
    const res = await api.get(`${API_BASE_URL}/${id}`);
    return res.data;
};

export const createAppointment = async (appointmentData) => {
    const res = await api.post(`${API_BASE_URL}`, appointmentData);
    return res.data;
};

export const updateAppointment = async (id, updates) => {
    const res = await api.patch(`${API_BASE_URL}/${id}`, updates);
    return res.data;
};

export const cancelAppointment = async (id) => {
    const res = await api.patch(`${API_BASE_URL}/${id}/cancel`);
    return res.data;
};

export const assignDoctor = async (id, doctorId) => {
    const res = await api.patch(`${API_BASE_URL}/${id}/assignToDoctor`, { userId: doctorId });
    return res.data;
};