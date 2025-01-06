// utils/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
 baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
 const token = localStorage.getItem('token');
 if (token) {
   config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
});

api.interceptors.response.use(
 (response) => response,
 (error) => {
   if (error.response?.status === 401) {
     useAuthStore.getState().logout();
     window.location.href = '/auth';
   }
   return Promise.reject(error);
 }
);

export default api;