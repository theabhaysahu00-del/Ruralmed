import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.success) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password, endpoint = '/auth/login') => {
    try {
      const response = await api.post(endpoint, { email, password });
      if (response.success) {
        const { user: userData, token } = response.data || {};
        if (userData) {
          setUser(userData);
          localStorage.setItem('token', token || '');
          localStorage.setItem('role', userData.role || '');
          localStorage.setItem('user', JSON.stringify(userData));
          return userData;
        }
      }
    } catch (error) {
      console.error("Login Context Error:", error);
      throw error;
    }
    return null;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
