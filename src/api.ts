import axios from 'axios';

const api = axios.create({
  baseURL: 'https://panasonicstock.onrender.com',
});

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
