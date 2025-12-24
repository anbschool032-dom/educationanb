// // import axios from 'axios';

// // // Create a custom Axios instance
// // const api = axios.create({
// //   // *** CRUCIAL FIX: Add the /api/v1 prefix to match server.js ***
// //   baseURL: 'http://localhost:3000/api/v1', 
// //   // baseURL: 'http://localhost:3000',
// //   withCredentials: true,
// // });

// // // --- Request Interceptor: Attach Access Token ---
// // api.interceptors.request.use(
// //   (config) => {
// //     const accessToken = localStorage.getItem('accessToken');
// //     if (accessToken) {
// //       config.headers.Authorization = `Bearer ${accessToken}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );


// // // --- Response Interceptor: Handle Token Expiration (401) ---
// // // Note: This full logic is good practice for production apps.
// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;
    
// //     // Check for 401 Unauthorized status and prevent infinite loops
// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;
// //       // ... Add token refresh logic here when implemented ...
// //     }
    
// //     return Promise.reject(error);
// //   }
// // );




// // // Remove the misplaced fetchIndustries function
// // // It should live inside your PositionManagement component.

// // export default api;

// // import axios from 'axios';

// // // Create a custom Axios instance
// // const api = axios.create({
// //   // ✅ កែត្រង់នេះ៖ ឈប់ដាក់ localhost ត្រង់ៗ!
// //   // ឱ្យវាអានពី .env វិញ (បើនៅ Local វាអាន localhost, បើនៅ Server វាអាន IP)
// //   baseURL: import.meta.env.VITE_API_URL, 
// //   withCredentials: true,
// // });

// // // ... (កូដ Interceptors ខាងក្រោមទុកដដែល) ...

// // export default api;



// import axios from 'axios';

// // Create a custom Axios instance
// const api = axios.create({
//   // ✅ កែដាក់បែបនេះ៖
//   // 1. វាព្យាយាមរក VITE_API_BASE_URL ពី .env ជាមុន
//   // 2. បើរកមិនឃើញ វាប្រើ 'http://localhost:3000/api/v1' (សម្រាប់ Local ស្រួលតេស្ត)
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  
//   withCredentials: true,
// });

// // --- Request Interceptor ---
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken');
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // --- Response Interceptor ---
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       // TODO: Add refresh token logic
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;





// import axios from 'axios';

// // ✅ កែមកប្រើ VITE_API_URL (ឱ្យត្រូវនឹង .env)
// // និងដក /api/v1 ចេញ (យកត្រឹម Port 3000 បានហើយ)
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// // --- Request Interceptor ---
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken');
//     // ឬប្រើ 'token' តាមដែលបង Save ទុក (Check ក្នុង Application > Local Storage)
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // --- Response Interceptor ---
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       // TODO: Add refresh token logic here if needed
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';

// ✅ កែត្រង់នេះ៖ ប្រើ VITE_API_URL (អត់មាន BASE)
// ហើយដក /api/v1 ចេញ (ព្រោះ Server បងអត់មាន Route v1 ទេ)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// --- Request Interceptor (ទុកដដែល) ---
api.interceptors.request.use(
  (config) => {
    // ពិនិត្យមើលថាបង Save Token ឈ្មោះអី? accessToken ឬ token?
    // បើក្នុង Login.jsx ដាក់ localStorage.setItem('token', ...) ខាងក្រោមនេះត្រូវដាក់ 'token' ដែរ
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