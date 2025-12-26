// import axios from 'axios';

// // ❌ លុបកូដចាស់នេះចោល៖
// // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// // ✅ ដាក់កូដថ្មីនេះ (ដាក់តែប៉ុណ្ណេះគឺដើរទាំង Local ទាំង Server):
// // ហេតុផល៖ ពេលនៅ Local (Vite Proxy) ឬ Server (Nginx/Express) វាចាប់យក Domain ស្វ័យប្រវត្តិ
// const API_URL = '/api/v1'; 

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// // --- Request Interceptor (ទុកដដែល) ---
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // --- Response Interceptor (ទុកដដែល) ---
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       // TODO: Handle token refresh logic here
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';

// ✅ DYNAMIC URL:
// 1. Checks if VITE_API_URL is set (Production/Server/CI-CD)
// 2. If not set, falls back to 'http://localhost:3000/api/v1' (Local Development)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/sessions
});

// --- Request Interceptor (Attaches Token) ---
api.interceptors.request.use(
  (config) => {
    // Check your local storage key name (accessToken vs token)
    const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor (Handles Errors) ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 Unauthorized (Token expired), prevents infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Optional: Add logic here to refresh token or redirect to login
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;