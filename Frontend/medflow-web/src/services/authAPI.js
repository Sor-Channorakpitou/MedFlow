import api from "./api";
const API_BASE_URL = '/auth';

export const login = async (credentials) => {
    const res = await api.post(`${API_BASE_URL}/login`, credentials);
    return res.data;
};

export const logout = async () => {
    const res = await api.post(`${API_BASE_URL}/logout`);
    return res.data;    
};

export const getCurrentUser = async () => {
    const res = await api.get(`${API_BASE_URL}/me`);
    return res.data;
};

export const refresh = async () => {
    const res = await api.post(`${API_BASE_URL}/refresh`);
    return res.data;
};

