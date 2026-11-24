
import axios from "axios";

// Use Vite's dev proxy by default so API requests reach Express instead of
// being sent to the frontend server (port 5173).
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const getAccessToken = () =>
  localStorage.getItem("accessToken");

export const getRefreshToken = () =>
  localStorage.getItem("refreshToken");

export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh token handling
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/register")
    ) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(error);
      }

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(
            `${BASE_URL}/auth/refresh/`,
            { refreshToken }
          );
        }

        const response = await refreshPromise;

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        if (!newAccessToken) {
          throw new Error("Access token missing in refresh response");
        }

        saveTokens(newAccessToken, newRefreshToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        clearTokens();
        window.dispatchEvent(new Event("auth:logout"));

        return Promise.reject(refreshError);

      } finally {
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
