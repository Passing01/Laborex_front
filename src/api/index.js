import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'https://gestion-suivi-documentaire.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add CSRF token to every non-GET request
api.interceptors.request.use((config) => {
  const method = config.method.toUpperCase();
  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    const csrftoken = Cookies.get('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      status: error.response?.status,
      data: error.response?.data || { error: 'Une erreur est survenue' },
      message: error.response?.data?.error || error.message
    };
    return Promise.reject(customError);
  }
);

export default api;
