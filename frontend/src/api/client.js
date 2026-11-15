import axios from 'axios';

export const API_BASE = 'https://funconnect-b7i4.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('funconnect_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If server says 401, clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('funconnect_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
