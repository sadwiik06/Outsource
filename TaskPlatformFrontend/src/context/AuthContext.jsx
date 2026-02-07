import React, { createContext, useState, useEffect } from 'react';
import api from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const role = user.role.toLowerCase();
      const res = await api.get(`/${role}/profile/${user.id}`);
      const updatedUser = { ...user, ...res.data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to refresh user data', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
