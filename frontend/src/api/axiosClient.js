import axios from 'axios';
import { tokenStore } from '../auth/tokenStore.js';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach the access token to every request.
axiosClient.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, try a single refresh + retry; otherwise force logout.
let refreshing = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes('/auth/');

    if (status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        if (!refreshing) {
          const refreshToken = tokenStore.getRefresh();
          if (!refreshToken) throw new Error('No refresh token');
          // Bare axios to avoid interceptor recursion.
          refreshing = axios
            .post(`${baseURL}/auth/refresh`, { refreshToken })
            .then((res) => {
              tokenStore.setAccess(res.data.accessToken);
              tokenStore.setRefresh(res.data.refreshToken);
              return res.data.accessToken;
            })
            .finally(() => { refreshing = null; });
        }
        const newAccess = await refreshing;
        original.headers.Authorization = `Bearer ${newAccess}`;
        return axiosClient(original);
      } catch (e) {
        tokenStore.clear();
        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

// Normalize the backend ApiError body into a readable message.
export function apiMessage(error) {
  const data = error?.response?.data;
  if (!data) return error?.message || 'Network error';
  if (data.fieldErrors) {
    return Object.entries(data.fieldErrors).map(([f, m]) => `${f}: ${m}`).join('; ');
  }
  return data.message || data.error || 'Request failed';
}

export default axiosClient;
