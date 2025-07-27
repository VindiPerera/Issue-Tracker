// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      throw new Error(error.response.data.error || 'Request failed');
    }
    throw error;
  }
);

export default api;