import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:10000';

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, 
});


api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;

    if (!response) {
      return Promise.reject(error);
    }

    if (response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(
        `${BACKEND_URL}/api/member/refresh`,
        null,
        { withCredentials: true }
      );

      const newAccessToken = refreshResponse.data?.data?.accessToken;
      if (!newAccessToken) {
        throw new Error('새로운 액세스 토큰을 받지 못했습니다.');
      }

    
      localStorage.setItem('accessToken', newAccessToken);

      isRefreshing = false;
      onRefreshed(newAccessToken); 

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      isRefreshing = false;
      onRefreshed(null);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('member');
      localStorage.removeItem('currentMember');
      localStorage.removeItem('isLoggedIn');

      window.location.href = '/auth/login';
      return Promise.reject(err);
    }
  }
);

export default api;
