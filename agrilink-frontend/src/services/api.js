// FILE: agrilink-frontend/src/services/api.js
import axios from 'axios';

// Instantiate our custom Axios runtime reference linked to the environment file base variable
const API = axios.create({
  // 🛠️ FIX 1: Added local fallback string so your app won't throw 404s if Vite fails to read the .env file
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure a request interceptor to dynamically catch and process outgoing web requests
API.interceptors.request.use(
  (config) => {
    // Attempt to extract the stored JSON Web Token payload from local state storage
    const token = localStorage.getItem('agrilink_token');
    
    // If the token is found, automatically assign it to the security bearer header
    if (token) {
      // 🛠️ FIX 2: Ensure the headers object exists and use bracket notation for safety across Axios versions
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Bubble up configuration compilation errors to the parent application stream
    return Promise.reject(error);
  }
);

export default API;