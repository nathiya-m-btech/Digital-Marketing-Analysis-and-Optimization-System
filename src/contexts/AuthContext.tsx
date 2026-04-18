import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User as SupaUser } from '@supabase/supabase-js';
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
  'CMO': ['campaign.view', 'analytics.view', 'analytics.export', 'revenue.view', 'strategy.view', 'survey.view'],
  'Marketing Manager': ['campaign.create', 'campaign.edit', 'campaign.view', 'analytics.view', 'analytics.export', 'survey.view'],
  'Business Owner': ['campaign.view', 'analytics.view', 'revenue.view'],
  'Digital Marketing Specialist': ['campaign.view', 'analytics.view', 'analytics.export', 'survey.view', 'survey.submit'],
  'Freelancer': ['campaign.view', 'survey.submit'],
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  canEdit: boolean;
  hasPermission: (permission: Permission) => boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function loadProfile(supaUser: SupaUser): Promise<User | null> {
  const [{ data: profile }, { data: roleRow }] = await Promise.all([
    supabase.from('profiles').select('id, name, email, profile_image').eq('id', supaUser.id).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', supaUser.id).maybeSingle(),
  ]);

  if (!profile) return null;

  return {
    _id: profile.id,
    name: profile.name,
    email: profile.email,
    profile_image: profile.profile_image ?? undefined,
    role: (roleRow?.role as UserRole) ?? 'Freelancer',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST (do not await async work inside the callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Defer profile load to avoid deadlocks
        setTimeout(() => {
          loadProfile(newSession.user).then(p => setUser(p));
        }, 0);
      } else {
        setUser(null);
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        loadProfile(existingSession.user).then(p => {
          setUser(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name, role },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    const p = await loadProfile(session.user);
    setUser(p);
  }, [session]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.profile_image !== undefined) dbUpdates.profile_image = updates.profile_image;

    const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', user._id);
    if (error) throw error;
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, [user]);

  const hasPermission = useCallback((permission: Permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) ?? false;
  }, [user]);

  const canEdit = user?.role === 'Admin' || user?.role === 'Marketing Manager';

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      isAuthenticated: !!user,
      login, signup, logout,
      canEdit, hasPermission,
      updateProfile, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
