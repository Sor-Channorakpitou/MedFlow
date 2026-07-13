import api from "./api";

const API_BASE_URL = "/invoices";

export const getAllInvoices = async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const res = await api.get(API_BASE_URL, { params });
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
    const res = await api.patch(`${API_BASE_URL}/${id}/issueInvoicePayment`, { PaymentStatus: "PAID" });
    return res.data;
};