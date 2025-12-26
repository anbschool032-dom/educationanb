import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setAuthData = (token, userData) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      try {
        const meRes = await api.get('/auth/me');
        setAuthData(storedToken, meRes.data);
      } catch (err) {
        try {
          const refreshRes = await api.post('/auth/token/refresh');
          const newToken = refreshRes.data.accessToken;
          setAuthData(newToken, refreshRes.data.user); 
        } catch {
          clearAuth();
        }
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken, user } = res.data;
    if (!accessToken || !user) {
      throw new Error('Invalid login response');
    }
    setAuthData(accessToken, user);
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      clearAuth();
      navigate('/login', { replace: true });
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      role: user?.role_name || null,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);