import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptor for access token
export const setupInterceptors = (store) => {
  api.interceptors.request.use(
    (config) => {
      const token = store.getState().accessToken;
      console.log(`[Axios Request] url=${config.url} hasToken=${!!token}`);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('[Axios Request Error]', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      console.warn(`[Axios Response Error] url=${originalRequest?.url} status=${error.response?.status} retry=${!!originalRequest?._retry}`);
      
      // If 401 and not already retried (prevent infinite loop)
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          console.log('[Axios Interceptor] Token expired or missing. Attempting refresh...');
          // Attempt to refresh token
          const refreshRes = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
          const newAccessToken = refreshRes.data.data.accessToken;
          console.log('[Axios Interceptor] Refresh succeeded. New token obtained.');
          
          // Update store
          store.getState().setAccessToken(newAccessToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log(`[Axios Interceptor] Retrying original request: url=${originalRequest.url}`);
          return api(originalRequest);
        } catch (refreshError) {
          console.error('[Axios Interceptor] Refresh failed. Logging out user.', refreshError);
          // Refresh failed, user is logged out
          store.getState().logout();
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
};
