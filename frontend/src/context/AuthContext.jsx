import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../lib/axios';
import axios from 'axios';


const backendUrl = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = backendUrl;


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await axiosInstance.get('/api/auth/check');
      if (data.success) {
        setAuthUser(data.user);
      } else {
        localStorage.removeItem('token');
        setAuthUser(null);
      }
    } catch {
      localStorage.removeItem('token');
      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    const { data } = await axiosInstance.post('/api/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('token', data.token);
      setAuthUser(data.userData);
    }
    return data;
  }, []);

  const signUp = useCallback(async (fullName, email, password, bio) => {
    const { data } = await axiosInstance.post('/api/auth/signUp', { fullName, email, password, bio });
    if (data.success) {
      localStorage.setItem('token', data.token);
      setAuthUser(data.userData);
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setAuthUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, isLoading, login, signUp, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
