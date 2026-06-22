import axios from 'axios';
import { API_URL } from './utils';

const clientClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

clientClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

clientClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newToken = response.data.access;
        localStorage.setItem('token', newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return clientClient(originalRequest);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');

        if (window.location.pathname !== '/login') {
          window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { clientClient as stackbase };

export function parseApiError(error: any): string {
  const responseData = error?.response?.data;
  if (!responseData) {
    return error?.message || "An unexpected error occurred";
  }

  // If the backend wrapped the validation errors inside `error` property
  const errorObj = responseData.error || responseData;

  if (typeof errorObj === "object" && errorObj !== null) {
    const errorMessages = Object.entries(errorObj)
      .map(([field, msgs]) => {
        if (field === "status" || field === "message" || field === "error") return null;

        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        if (Array.isArray(msgs)) {
          return `${fieldName}: ${msgs.join(", ")}`;
        }
        if (typeof msgs === "string") {
          return `${fieldName}: ${msgs}`;
        }
        if (typeof msgs === "object" && msgs !== null) {
          return `${fieldName}: ${JSON.stringify(msgs)}`;
        }
        return `${fieldName}: ${msgs}`;
      })
      .filter(Boolean)
      .join("\n");

    if (errorMessages) {
      return errorMessages;
    }
  }

  if (responseData.message && typeof responseData.message === "string") {
    return responseData.message;
  }
  if (responseData.detail && typeof responseData.detail === "string") {
    return responseData.detail;
  }

  return "An unexpected error occurred";
}
