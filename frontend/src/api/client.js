import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('ml_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  r => r,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url.includes('/api/auth/refresh') ||
        originalRequest.url.includes('/api/auth/login')
      ) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('ml_refresh_token');
      if (refreshToken) {
        try {
          const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
          const res = await axios.post(`${apiBase}/api/auth/refresh`, { refreshToken });
          const { token } = res.data.data;
          
          localStorage.setItem('ml_token', token);
          client.defaults.headers.common.Authorization = `Bearer ${token}`;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          processQueue(null, token);
          isRefreshing = false;
          return client(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          isRefreshing = false;
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshErr);
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default client;
