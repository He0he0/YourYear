import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredAuth, logout as apiLogout } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { user } = getStoredAuth();
    setUser(user);
    setLoading(false);
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const updateUser = (updates) => setUser(u => ({ ...u, ...updates }));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
