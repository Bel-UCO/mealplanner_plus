import axios from "axios";
import * as SecureStore from "expo-secure-store";


// set where API is hosted
export const API_BASE_URL = "https://localizable-superdelicate-mae.ngrok-free.dev";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// every api request if they got token add token to header
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
