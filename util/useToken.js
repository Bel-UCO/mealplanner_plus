// src/hooks/useToken.js
import { useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

export default function useToken() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) {
          setToken(stored);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Save token
  const saveToken = useCallback(async (newToken) => {
    if (!newToken) return;
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  // Clear token
  const clearToken = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setToken(null);
  }, []);

  return { token, saveToken, clearToken, loading };
}
