import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  // Use a relative path to trigger the Next.js rewrite in development
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token') || process.env.NEXT_PUBLIC_DEV_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling (e.g., redirect to login on 401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Clear token and redirect to login
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
