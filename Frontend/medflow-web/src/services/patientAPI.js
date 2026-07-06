import api from "./api";

const API_BASE_URL = "/patients";

export const getAllPatients = async () => {
    const res = await api.get(API_BASE_URL);
    return res.data;
};

export const getPatientById = async (id) => {
    const res = await api.get(`${API_BASE_URL}/${id}`);
    return res.data;
};

export const createPatient = async (patientData) => {
    const res = await api.post(API_BASE_URL, patientData);
    return res.data;
};

export const updatePatientById = async (id, patientData) => {
    const res = await api.patch(`${API_BASE_URL}/${id}`, patientData);
    return res.data;
};

export const deletePatientById = async (id) => {
    const res = await api.delete(`${API_BASE_URL}/${id}`);
    return res.data;
};