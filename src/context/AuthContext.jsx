import React, { createContext, useContext, useState, useEffect } from 'react';
import api from 'api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMe = async () => {
    console.log('AuthProvider: Fetching current user...');
    try {
      const userData = await api.get('/api/me/');
      console.log('AuthProvider: User fetched successfully:', userData);
      setUser(userData);
      setError(null);
    } catch (err) {
      console.warn('AuthProvider: Fetching user failed or unauthorized:', err);
      setUser(null);
      // Don't set error if not logged in
      if (err.status !== 403 && err.status !== 401) {
        setError('Failed to fetch user profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (username, password) => {
    console.log('AuthProvider: Attempting login for:', username);
    setLoading(true);
    try {
      const response = await api.post('/api/login/', { username, password });
      console.log('AuthProvider: Login success response:', response);
      
      // If the backend returns user data in the login response, use it immediately
      if (response.user) {
        setUser(response.user);
        setLoading(false);
      } else {
        await fetchMe();
      }
      return true;
    } catch (err) {
      console.error('AuthProvider: Login failed:', err);
      setError(err.data?.error || 'Identifiants invalides');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout/');
      setUser(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
