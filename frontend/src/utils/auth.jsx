// Authentication context and utilities for SetuConnect

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "./api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await authAPI.refreshToken();

        if (response?.success) {
          setUser(response.user);
          setIsAuthenticated(true);
          localStorage.setItem("token", response.token);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        localStorage.removeItem("token");
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async ({ email, password }) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // important if using cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.user); // store user in context
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Network error' };
  }
};


  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(userData);

      if (response?.success) {
        return {
          success: true,
          message:
            response.message ||
            "Registration successful. Please check your email.",
          requiresVerification: response.requiresVerification || false,
        };
      } else {
        setError(response.message || "Registration failed");
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred during registration";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);

    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
