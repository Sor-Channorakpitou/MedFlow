import axios from "axios";
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true, 
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;


//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const res = await api.post("/auth/refresh");

//         const newAccessToken = res.data.accessToken;
//         setAccessToken(newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return api(originalRequest);
//       } catch (err) {
//         window.location.href = "/login";
//       } 

      
//     }

//     return Promise.reject(error);
//   }
// );


api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthEndpoint =
      original.url?.includes('/auth/refresh') || original.url?.includes('/auth/login');

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        const res = await api.post('/auth/refresh'); // call endpoint directly, no import
        setAccessToken(res.data.accessToken);
        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        setAccessToken(null); // just clear in-memory token
        return Promise.reject(refreshErr); // let the caller / route guard handle UI, don't hard-redirect
      }
    }
    return Promise.reject(error);
  }
);
export default api;