import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (stored) setToken(stored);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveToken = useCallback(async (newToken) => {
    if (!newToken) return;
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const clearToken = useCallback(async () => {
    setToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading, saveToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
