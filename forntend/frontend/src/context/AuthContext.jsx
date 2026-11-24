
import { createContext, useContext, useState, useEffect } from "react";
import api, { saveTokens, clearTokens } from "../api";

const AuthContext = createContext();

const hasValidAccessToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token || token === "undefined" || token === "null") return false;

  // JWT access tokens include an expiry claim. Opaque tokens are validated by
  // the API when used, so only reject a JWT here when it is expired/malformed.
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof claims.exp !== "number" || claims.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidAccessToken);

  // Register
  const register = async (userData) => {
    const response = await api.post("/auth/register/", userData);
    return response.data;
  };

  // Login
  const login = async (credentials) => {
    const response = await api.post("/auth/login/", credentials);

    const { accessToken, refreshToken, user } = response.data;

    if (!accessToken) {
      throw new Error("Login response did not include an access token");
    }

    saveTokens(accessToken, refreshToken);

    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);

    return response.data;
  };

  // Logout
  const logout = () => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Handle automatic logout after refresh failure
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
    };
    const handleStorage = () => {
      setIsAuthenticated(hasValidAccessToken());
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };

    window.addEventListener("auth:logout", handleLogout);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const value = {
    user,
    loading,
    setLoading,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
