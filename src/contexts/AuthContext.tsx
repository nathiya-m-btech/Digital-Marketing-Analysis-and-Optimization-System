import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types';

export type Permission =
  | 'campaign.create'
  | 'campaign.edit'
  | 'campaign.delete'
  | 'campaign.view'
  | 'survey.submit'
  | 'survey.view'
  | 'analytics.view'
  | 'analytics.export'
  | 'users.manage'
  | 'system.settings'
  | 'revenue.view'
  | 'strategy.view';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'Admin': [
    'campaign.create', 'campaign.edit', 'campaign.delete', 'campaign.view',
    'survey.submit', 'survey.view', 'analytics.view', 'analytics.export',
    'users.manage', 'system.settings', 'revenue.view', 'strategy.view',
  ],
  'CMO': [
    'campaign.view', 'analytics.view', 'analytics.export',
    'revenue.view', 'strategy.view', 'survey.view',
  ],
  'Marketing Manager': [
    'campaign.create', 'campaign.edit', 'campaign.view',
    'analytics.view', 'analytics.export', 'survey.view',
  ],
  'Business Owner': [
    'campaign.view', 'analytics.view', 'revenue.view',
  ],
  'Digital Marketing Specialist': [
    'campaign.view', 'analytics.view', 'analytics.export',
    'survey.view', 'survey.submit',
  ],
  'Freelancer': [
    'campaign.view', 'survey.submit',
  ],
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  canEdit: boolean;
  hasPermission: (permission: Permission) => boolean;
  updateProfile: (updates: Partial<User>) => void;
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
    setUser({ ...defaultUser, email });
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, _password: string, role: UserRole) => {
    setUser({ _id: 'u_new', name, email, role });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const hasPermission = useCallback((permission: Permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  }, [user]);

  const canEdit = user?.role === 'Admin' || user?.role === 'Marketing Manager';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, canEdit, hasPermission, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
