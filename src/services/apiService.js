import api from './api'; // Day 1 ka axios instance

// =====================
// APIs
// =====================
export const apisService = {
  // Sare APIs fetch karo
  getAll: () => api.get('/apis'),

  // Single API
  getOne: (id) => api.get(`/apis/${id}`),

  // Nayi API create karo
  create: (data) => api.post('/apis', data),

  // API update karo
  update: (id, data) => api.put(`/apis/${id}`, data),

  // API delete karo
  delete: (id) => api.delete(`/apis/${id}`),
};

// =====================
// API Keys
// =====================
export const keysService = {
  // Sare keys
  getAll: (params) => api.get('/keys', { params }),

  // Key generate karo
  generate: (data) => api.post('/keys/generate', data),

  // Key revoke karo
  revoke: (id, reason) => api.patch(`/keys/${id}/revoke`, { reason }),

  // Key rotate karo
  rotate: (id) => api.post(`/keys/${id}/rotate`),

  // Key stats
  getStats: (id) => api.get(`/keys/${id}/stats`),
};