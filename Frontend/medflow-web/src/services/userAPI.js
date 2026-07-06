import api from "./api";
const API_BASE_URL = '/users';

export const getUserById = async (id) => {
    const res = await api.get(`${API_BASE_URL}/${id}`);
    return res.data;
};

export const getAllUsers = async () => {
    const res = await api.get(`${API_BASE_URL}`);
    return res.data;
};

export const createUser = async (data) => {
    const res = await api.post(`${API_BASE_URL}`, data);
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await api.patch(`${API_BASE_URL}/${id}`, data);
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await api.delete(`${API_BASE_URL}/${id}`);
    return res.data;
};

export const deactivateUser = async (id) => {
    const res = await api.post(`${API_BASE_URL}/${id}/deactivate`);
    return res.data;
};

export const resetUserPassword = async (id) => {
    const res = await api.put(`${API_BASE_URL}/${id}/reset-password`);
    return res.data;
};

export const uploadProfileImage = async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const res = await api.post(
        `${API_BASE_URL}/profile/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};

export const activateUser = async (id) => {
    const res = await api.post(`${API_BASE_URL}/${id}/activate`);
    return res.data;
};