import { api } from './axios';

export const usersApi = {
  getFavorites: async () => {
    const { data } = await api.get('/users/favorites');
    return data.data;
  },
  
  toggleFavorite: async (songId) => {
    const { data } = await api.post(`/users/favorites/${songId}`);
    return data.data;
  }
};
