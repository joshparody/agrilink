// FILE: agrilink-frontend/src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
// In Vite, environment variables are accessed via import.meta.env
// NOT process.env (that's Create React App syntax)

// Axios instance with base URL pre-configured
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrilink_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('agrilink_token', response.data.token);
      localStorage.setItem('agrilink_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('agrilink_user');
    return user ? JSON.parse(user) : null;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;
// Export the axios instance so other service files can import and reuse it