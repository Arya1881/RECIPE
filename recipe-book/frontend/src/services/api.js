import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const getAllRecipes = () => api.get('/recipes');

export const getRecipeById = (id) => api.get(`/recipes/${id}`);

export const createRecipe = (data) => api.post('/recipes', data);

export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data);

export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);

export const seedRecipes = () => api.post('/recipes/seed');

export const healthCheck = () => api.get('/health');

export default api;
