import { createContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    // Only try to fetch user if a token exists
    if (!localStorage.getItem('authToken')) {
      setIsLoading(false);
      return;
    }
    try {
      const userData = await api.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user profile, logging out.", error);
      // If token is invalid or expired, clear auth state
      setAuthToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        setAuthToken(token);
    }
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      setAuthToken(data.token);
      // The useEffect will not re-run on token change, so we fetch user manually
      await fetchUser();
    } else {
        throw new Error("Login failed: No token received.");
    }
  }, [fetchUser]);

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
    setUser(null);
    localStorage.removeItem('authToken');
  }, []);

  const value = {
    authToken,
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
