import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, loginUser, registerUser } from "../api/auth.js";

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = "fitness_iot_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }
    setAuthLoading(true);
    fetchCurrentUser(token)
      .then((data) => setUser(data))
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setAuthLoading(false));
  }, [token]);

  const login = useCallback(async ({ identifier, password }) => {
    const data = await loginUser({ identifier, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
    setToken(data.access_token);
    return data;
  }, []);

  const register = useCallback(async ({ username, email, password }) => {
    await registerUser({ username, email, password });
    return login({ identifier: username, password });
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = { token, user, authLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
