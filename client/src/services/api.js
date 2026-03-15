import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movie/TV endpoints
export const movieApi = {
  search: (query, page = 1) => api.get('/movies/search', { params: { q: query, page } }),
  getDetails: (tmdbId, mediaType = 'movie') => api.get(`/movies/${tmdbId}`, { params: { mediaType } }),
  getPopular: (mediaType = 'movie', page = 1) => api.get('/movies/popular', { params: { mediaType, page } }),
  getTrending: (mediaType = 'all', timeWindow = 'week') => api.get('/movies/trending', { params: { mediaType, timeWindow } }),
  getGenres: (mediaType = 'movie') => api.get('/movies/genres', { params: { mediaType } }),
};

// Rating endpoints
export const ratingApi = {
  create: (data) => api.post('/ratings', data),
  getUserRatings: (userId) => api.get('/ratings', { params: { userId } }),
  update: (id, data) => api.put(`/ratings/${id}`, data),
  delete: (id) => api.delete(`/ratings/${id}`),
};

// Preferences endpoints
export const preferencesApi = {
  get: (userId) => api.get('/preferences', { params: { userId } }),
  update: (data) => api.post('/preferences', data),
};

// Recommendations endpoints
export const recommendationsApi = {
  get: (userId, options = {}) => {
    const params = { userId, ...options };
    return api.get('/recommendations', { params });
  },
  hide: (tmdbId, userId) => api.post(`/recommendations/hide/${tmdbId}`, { userId }),
};

export default api;
