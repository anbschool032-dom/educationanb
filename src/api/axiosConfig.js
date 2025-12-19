import axios from 'axios';

// Create a custom Axios instance
const api = axios.create({
  // *** CRUCIAL FIX: Add the /api/v1 prefix to match server.js ***
  baseURL: 'http://localhost:3000/api/v1', 
  // baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// --- Request Interceptor: Attach Access Token ---
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// --- Response Interceptor: Handle Token Expiration (401) ---
// Note: This full logic is good practice for production apps.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check for 401 Unauthorized status and prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // ... Add token refresh logic here when implemented ...
    }
    
    return Promise.reject(error);
  }
);

// Remove the misplaced fetchIndustries function
// It should live inside your PositionManagement component.

export default api;


// // src/api/axiosConfig.js

// import axios from 'axios';

// // Create a custom Axios instance
// const api = axios.create({
//   // Your backend routes are under /api/v1 (e.g., /api/v1/admin/users)
//   baseURL: 'http://localhost:3000/api/v1',
//   withCredentials: true, // Important for sending cookies (refresh token)
//   timeout: 10000, // Optional: prevent hanging requests (10 seconds)
// });

// // --- Request Interceptor: Automatically attach Access Token ---
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken');
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // --- Response Interceptor: Handle 401 (Token Expired) ---
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // If 401 and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // Prevent infinite loop

//       try {
//         // Call refresh token endpoint
//         const refreshResponse = await axios.post(
//           'http://localhost:3000/api/v1/auth/token/refresh',
//           {},
//           { withCredentials: true } // Send refresh cookie
//         );

//         const { accessToken } = refreshResponse.data;

//         // Save new access token
//         localStorage.setItem('accessToken', accessToken);

//         // Update header for original request
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;

//         // Retry the original request with new token
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Refresh failed → user must log in again
//         localStorage.removeItem('accessToken');
//         window.location.href = '/login'; // Redirect to login
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;