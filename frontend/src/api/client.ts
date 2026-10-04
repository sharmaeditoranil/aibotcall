import axios from 'axios';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aibotcall_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Clear token if expired
      localStorage.removeItem('aibotcall_token');
    }
    return Promise.reject(error);
  }
);
