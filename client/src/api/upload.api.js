import { api } from './axios';

export const uploadApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
  },
  
  uploadAudio: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
  },
  
  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.data;
  }
};
