import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let accessToken = '';
let tokenListeners = [];

export const addTokenListener = (listener) => {
  tokenListeners.push(listener);
  return () => {
    tokenListeners = tokenListeners.filter(l => l !== listener);
  };
};

export const setAccessToken = (token) => {
  accessToken = token;
  tokenListeners.forEach(listener => listener(token));
};

export const getAccessToken = () => {
  return accessToken;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request Interceptor: Đính kèm Bearer Token vào headers
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Tự động refresh token khi gặp lỗi 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    const url = originalRequest.url || '';
    const isAuthRequest = url.includes('/auth/login') || 
                          url.includes('/auth/refresh') || 
                          url.includes('/auth/logout') || 
                          url.includes('/auth/session') || 
                          url.includes('/auth/admin/login');

    if (
      (error.response?.status === 401 || error.response?.status === 403) && 
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
          .then((response) => {
            const { accessToken: newAccessToken } = response.data;
            setAccessToken(newAccessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            resolve(axiosInstance(originalRequest));
          })
          .catch((refreshError) => {
            setAccessToken('');
            processQueue(refreshError, null);
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
