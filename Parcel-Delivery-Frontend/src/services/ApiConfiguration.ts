import axios from 'axios';
import { TokenManager } from './TokenManager';

const API_BASE_URL = 'https://parcel-delivery-api.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    const fromLocalStorage = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    console.log('🔍 [API Request] URL:', (config.baseURL || '') + (config.url || ''));
    console.log('🔑 [API Request] Token from TokenManager:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('🔑 [API Request] Token from localStorage:', fromLocalStorage ? `${fromLocalStorage.substring(0, 20)}...` : 'NO TOKEN');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [API Request] Authorization header set:', config.headers.Authorization?.substring(0, 30) + '...');
    } else if (fromLocalStorage) {
      // Fallback to localStorage if TokenManager fails
      config.headers.Authorization = `Bearer ${fromLocalStorage}`;
      console.log('✅ [API Request] Authorization header set from localStorage fallback');
    } else {
      console.error('⚠️ [API Request] NO TOKEN AVAILABLE - Request will likely fail with 401!');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ [API Request] Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes('/auth/refresh-token')) {
      TokenManager.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
          const refreshToken = TokenManager.getRefreshToken();

          if (!refreshToken) {
            TokenManager.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(error);
          }

          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          if (refreshResponse.data?.accessToken) {
            TokenManager.setTokens(
              refreshResponse.data.accessToken,
              refreshResponse.data?.refreshToken || refreshToken
            );
          } else {
            
            TokenManager.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshResponse);
          }

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${TokenManager.getAccessToken()}`;
          return api(originalRequest);
      } catch (refreshError: any) {
        
        TokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
