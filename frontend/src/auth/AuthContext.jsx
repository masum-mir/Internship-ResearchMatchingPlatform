import { createContext, useContext, useMemo, useState } from 'react';
import { authApi } from '../api/authApi.js';
import { tokenStore } from './tokenStore.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    tokenStore.setSession(data);
    setUser(tokenStore.getUser());
    return data;
  };

  const register = async (body) => {
    const data = await authApi.register(body);
    tokenStore.setSession(data);
    setUser(tokenStore.getUser());
    return data;
  };

  const logout = async () => {
    const refreshToken = tokenStore.getRefresh();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch (_) {
      /* best effort */
    }
    tokenStore.clear();
    setUser(null);
  };

  const value = useMemo(() => {
    const role = user?.roles?.[0] || null;
    return {
      user,
      role,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
