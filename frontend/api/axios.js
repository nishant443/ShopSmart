// frontend/src/api/axios.js
import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging (remove in production)
    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful response (remove in production)
    console.log(`✅ Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    // Log error for debugging
    console.error('❌ Response Error:', error);

    // Handle different error scenarios
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      toast.error('Cannot connect to server. Please check if the backend is running.');
    } else if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message;

      switch (status) {
        case 400:
          toast.error(message || 'Bad request. Please check your input.');
          break;
        case 401:
          localStorage.removeItem('token');
          toast.error('Session expired. Please login again.');
          // Optionally redirect to login
          // window.location.href = '/login';
          break;
        case 403:
          toast.error('Access denied. You don\'t have permission.');
          break;
        case 404:
          toast.error(message || 'Resource not found.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(message || 'Something went wrong. Please try again.');
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something else went wrong
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default api;