import { createContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        setAuthToken(token);
      }
    } catch (error) {
      console.error("Could not access localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    if (data.token) {
      setAuthToken(data.token);
      localStorage.setItem('authToken', data.token);
    } else {
        throw new Error("Login failed: No token received.");
    }
  }, []);

  const signup = useCallback(async (firstname, lastname, email, password) => {
    const data = await api.signup(firstname, lastname, email, password);
    if (!data.data.userId) {
        throw new Error("Signup failed: No user ID received.");
    }
    // Note: We don't log in the user automatically after signup in this flow.
    // They will be prompted to log in.
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
  }, []);

  const value = {
    authToken,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
