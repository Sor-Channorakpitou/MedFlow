import api from "./api";

const API_BASE_URL = "/invoices";

export const getAllInvoices = async () => {
    const res = await api.get(API_BASE_URL);
    return res.data;
};

export const createInvoice = async (invoiceData) => {
    const res = await api.post(API_BASE_URL, invoiceData);
    return res.data;
};

export const updateInvoiceById = async (id, invoiceData) => {
    const res = await api.patch(`${API_BASE_URL}/${id}`, invoiceData);
    return res.data;
};

export const issuePayment = async (id) => {
    const res = await api.patch(`${API_BASE_URL}/${id}/issueInvoicePayment`);
    return res.data;
};