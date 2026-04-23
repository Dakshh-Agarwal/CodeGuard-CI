import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export const submitCode = (code, language) => api.post('/review', { code, language });
export const getReport = (jobId) => api.get(`/review/${jobId}`);

export default api;
