import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import { setupInterceptors } from '../api/axios';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  
  setAccessToken: (token) => set({ accessToken: token }),
  
  login: async (credentials) => {
    const data = await authApi.login(credentials);
    set({
      user: data,
      accessToken: data.accessToken,
      isAuthenticated: true
    });
    return data;
  },
  
  register: async (userData) => {
    const data = await authApi.register(userData);
    set({
      user: data,
      accessToken: data.accessToken,
      isAuthenticated: true
    });
    return data;
  },
  
  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false
      });
    }
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // API call to /me will trigger token refresh if needed via interceptor
      const user = await authApi.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

// Setup interceptors with access to store
setupInterceptors({
  getState: useAuthStore.getState
});
