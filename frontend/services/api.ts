import axios from 'axios';

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // We will get the token from localStorage
    const authStore = localStorage.getItem('auth-storage');
    if (authStore) {
      try {
        const { state } = JSON.parse(authStore);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth storage', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url ?? '';
    if (error.response?.status === 401 && !requestUrl.includes('/auth/login')) {
      if (typeof window !== 'undefined') {
        // Clear storage and redirect
        localStorage.removeItem('auth-storage');
        window.location.href = '/login?expired=true';
      }
    } else if (error.response?.status === 403) {
      // We can redirect or just let the component handle the 403 toast
      console.warn('Access denied (403)');
    }
    return Promise.reject(error);
  }
);

export const getApiData = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export default api;
