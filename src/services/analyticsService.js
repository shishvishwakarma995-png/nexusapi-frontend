import api from './api';

export const analyticsService = {
  getOverview: () => api.get('/analytics/overview'),
  getTimeseries: (hours) => api.get('/analytics/timeseries', { params: { hours } }),
  getLogs: (params) => api.get('/analytics/logs', { params }),
};