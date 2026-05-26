import { api } from './axios';

export const authApi = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  },
  
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
  },
  
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data.data;
  }
};
