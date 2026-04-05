import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearSession,
} from '../auth/token';
import { refreshSession } from './auth';

const apiClient = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach access token ──
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: refresh on 401 with single-flight lock ──

let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function onRefreshSuccess(newAccessToken: string) {
  pendingRequests.forEach(({ resolve }) => resolve(newAccessToken));
  pendingRequests = [];
}

function onRefreshFailure(error: unknown) {
  pendingRequests.forEach(({ reject }) => reject(error));
  pendingRequests = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh for 401 on non-auth endpoints
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.startsWith('/auth/')
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const currentRefreshToken = getRefreshToken();
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const result = await refreshSession(currentRefreshToken);
      if (result.success && result.data) {
        const { access_token, refresh_token } = result.data;
        setTokens(access_token, refresh_token);
        onRefreshSuccess(access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } else {
        throw new Error('Refresh failed');
      }
    } catch (refreshError) {
      onRefreshFailure(refreshError);
      clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
