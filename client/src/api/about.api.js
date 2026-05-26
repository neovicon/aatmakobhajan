import { api } from './axios';

export const aboutApi = {
  getAppInfo: async () => {
    const { data } = await api.get('/about');
    return data.data;
  },
  
  updateAppInfo: async (infoData) => {
    const { data } = await api.put('/about', infoData);
    return data.data;
  }
};
