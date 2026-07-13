import api from "./api";

const API_BASE = "/admin";

const cache = new Map();
const pendingRequests = new Map();

export const getAdminAnalytics = async (startDate, endDate) => {
  const key = `${startDate || ""}|${endDate || ""}`;

  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < 60000) {
    return cached.data;
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const promise = api.get(`${API_BASE}/analytics`, { params }).then((res) => {
    cache.set(key, { data: res.data, timestamp: Date.now() });
    pendingRequests.delete(key);
    return res.data;
  }).catch((err) => {
    pendingRequests.delete(key);
    throw err;
  });

  pendingRequests.set(key, promise);
  return promise;
};

export const clearAnalyticsCache = () => {
  cache.clear();
};
