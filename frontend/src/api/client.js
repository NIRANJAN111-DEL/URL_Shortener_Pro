import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('linkflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('linkflow_token');
      localStorage.removeItem('linkflow_user');
    }
    return Promise.reject(error);
  }
);

export const shortBase = import.meta.env.VITE_SHORT_URL_BASE || 'http://localhost:5000';
