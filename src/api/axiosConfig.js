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

// ✅ ដាក់កូដនេះវិញ (ខ្លី តែខ្លឹម):
// ដោយសារយើងបាន Setup Proxy ក្នុង vite.config.js ហើយ
// យើងគ្រាន់តែហៅ '/api/v1' គឺវាដើរគ្រប់កន្លែង (Local & Server)
const API_URL = '/api/v1'; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

// --- Request Interceptor ---
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

// --- Response Interceptor ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Handle logout or refresh here
    }
    return Promise.reject(error);
  }
);

export default api;