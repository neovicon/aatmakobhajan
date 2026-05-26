import { api } from './axios';

export const songsApi = {
  getSongs: async (params = {}) => {
    const { data } = await api.get('/songs', { params });
    return data.data;
  },
  
  getSongBySlug: async (slug) => {
    const { data } = await api.get(`/songs/${slug}`);
    return data.data;
  },
  
  searchSongs: async (query, params = {}) => {
    const { data } = await api.get('/songs/search', { params: { q: query, ...params } });
    return data.data;
  },
  getTags: async () => {
    const { data } = await api.get('/songs/tags');
    return data.data;
  },
  
  // Get Trending Songs
  getTrendingSongs: async () => {
    const response = await api.get('/songs/trending');
    return response.data.data;
  },

  // Get Recent Songs
  getRecentSongs: async () => {
    const response = await api.get('/songs/recent');
    return response.data.data;
  },

  // Sync Songs
  syncSongs: async (since) => {
    const params = since ? { since } : {};
    const response = await api.get('/songs/sync', { params });
    return response.data.data;
  },
  
  createSong: async (songData) => {
    const { data } = await api.post('/songs', songData);
    return data.data;
  },
  
  updateSong: async (id, songData) => {
    const { data } = await api.put(`/songs/${id}`, songData);
    return data.data;
  },
  
  deleteSong: async (id) => {
    await api.delete(`/songs/${id}`);
  },
  
  restoreSong: async (id) => {
    const { data } = await api.post(`/songs/${id}/restore`);
    return data.data;
  }
};
