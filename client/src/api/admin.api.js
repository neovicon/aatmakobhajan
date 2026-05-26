import { api } from './axios';

export const adminApi = {
  getAnalytics: async () => {
    const { data } = await api.get('/admin/analytics');
    return data.data;
  },
  
  getUsers: async (params = {}) => {
    const { data } = await api.get('/users', { params });
    return data.data;
  },
  
  getAuditLogs: async (params = {}) => {
    const { data } = await api.get('/admin/logs', { params });
    return data.data;
  }
};
