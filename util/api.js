// src/api.js
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const API_BASE_URL = "https://localizable-superdelicate-mae.ngrok-free.dev";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// Attach token from SecureStore before every request
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
