// import axios from 'axios';

// // ✅ កែត្រង់នេះ៖ ប្រើ VITE_API_URL (អត់មាន BASE)
// // ហើយដក /api/v1 ចេញ (ព្រោះ Server បងអត់មាន Route v1 ទេ)
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// // --- Request Interceptor (ទុកដដែល) ---
// api.interceptors.request.use(
//   (config) => {
//     // ពិនិត្យមើលថាបង Save Token ឈ្មោះអី? accessToken ឬ token?
//     // បើក្នុង Login.jsx ដាក់ localStorage.setItem('token', ...) ខាងក្រោមនេះត្រូវដាក់ 'token' ដែរ
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

// ❌ លុបកូដចាស់នេះចោល៖
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ✅ ដាក់កូដថ្មីនេះ (ដាក់តែប៉ុណ្ណេះគឺដើរទាំង Local ទាំង Server):
// ហេតុផល៖ ពេលនៅ Local (Vite Proxy) ឬ Server (Nginx/Express) វាចាប់យក Domain ស្វ័យប្រវត្តិ
const API_URL = '/api/v1'; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// --- Request Interceptor (ទុកដដែល) ---
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor (ទុកដដែល) ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // TODO: Handle token refresh logic here
    }
    return Promise.reject(error);
  }
);

export default api;