import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  canEdit: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const defaultUser: User = {
  _id: 'u1',
  name: 'Alex Morgan',
  email: 'alex@marketpulse.io',
  role: 'Admin',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string) => {
    // Mock login
    setUser({ ...defaultUser, email });
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, _password: string, role: UserRole) => {
    setUser({ _id: 'u_new', name, email, role });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const canEdit = user?.role === 'Admin' || user?.role === 'Marketing Manager';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, canEdit }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
