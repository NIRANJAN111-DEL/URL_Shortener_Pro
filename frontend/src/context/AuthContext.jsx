import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('linkflow_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('linkflow_token'));

  const persist = (payload) => {
    localStorage.setItem('linkflow_token', payload.token);
    localStorage.setItem('linkflow_user', JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.data);
  };

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form);
    persist(data.data);
  };

  const logout = () => {
    localStorage.removeItem('linkflow_token');
    localStorage.removeItem('linkflow_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ 
    user, 
    token, 
    isAuthenticated: Boolean(token || localStorage.getItem('linkflow_token')), 
    login, 
    register, 
    logout 
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
