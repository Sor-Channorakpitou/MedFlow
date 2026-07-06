import api from "./api";

const API_BASE_URL = "/queues";

// Get all queues
export const getAllQueues = async () => {
    const res = await api.get(`${API_BASE_URL}`);
    return res.data;
};

// Get queue by ID
export const getQueueById = async (id) => {
    const res = await api.get(`${API_BASE_URL}/${id}`);
    return res.data;
};

// Create a new queue
export const createQueue = async (queueData) => {
    const res = await api.post(`${API_BASE_URL}`, queueData);
    return res.data;
};

// Update queue
export const updateQueue = async (id, updates) => {
    const res = await api.patch(`${API_BASE_URL}/${id}`, updates);
    return res.data;
};

// Delete queue
export const deleteQueue = async (id) => {
    const res = await api.delete(`${API_BASE_URL}/${id}`);
    return res.data;
};

// Move queue stage
export const moveQueueStage = async (id, stage) => {
    const res = await api.patch(`${API_BASE_URL}/${id}/move-stage`, {
        stage,
    });
    return res.data;
};