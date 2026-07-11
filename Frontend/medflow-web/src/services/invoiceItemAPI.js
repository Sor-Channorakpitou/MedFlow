import api from "./api";

const API_BASE_URL = "/invoice-items";

export const createInvoiceItem = async (data) => {
  const res = await api.post(API_BASE_URL, data);
  return res.data;
};

export const getInvoiceItemsByInvoice = async (invoiceId) => {
  const res = await api.get(`${API_BASE_URL}/invoice/${invoiceId}`);
  return res.data;
};

export const updateInvoiceItem = async (id, data) => {
  const res = await api.patch(`${API_BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteInvoiceItem = async (id) => {
  const res = await api.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};