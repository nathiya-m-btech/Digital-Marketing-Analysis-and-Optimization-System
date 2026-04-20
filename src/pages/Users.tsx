import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Loader2, Users as UsersIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { UserRole } from '@/types';

const ROLES: UserRole[] = ['Admin', 'CMO', 'Marketing Manager', 'Business Owner', 'Digital Marketing Specialist', 'Freelancer'];

interface Row {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
  role: UserRole;
}

export default function Users() {
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from('profiles').select('id, name, email, profile_image'),
      supabase.from('user_roles').select('user_id, role'),
    ]);
    const roleMap = new Map((roles ?? []).map(r => [r.user_id, r.role as UserRole]));
    setRows((profiles ?? []).map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      profile_image: p.profile_image,
      role: roleMap.get(p.id) ?? 'Freelancer',
    })));
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'Admin') fetchUsers();
  }, [user]);

  if (authLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Shield className="w-12 h-12 text-destructive mx-auto mb-3" />
        <h1 className="font-display text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">Only Administrators can manage users.</p>
      </div>
    );
  }

  const changeRole = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    // Upsert by deleting then inserting (ensures single role per user under current schema)
    const { error: delErr } = await supabase.from('user_roles').delete().eq('user_id', userId);
    if (delErr) {
      toast({ title: 'Update failed', description: delErr.message, variant: 'destructive' });
      setUpdatingId(null);
      return;
    }
    const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: newRole });
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Role updated', description: `User role set to ${newRole}` });
      setRows(prev => prev.map(r => r.id === userId ? { ...r, role: newRole } : r));
    }
    setUpdatingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
          <UsersIcon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage roles and access for {rows.length} users</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold overflow-hidden">
                        {r.profile_image ? <img src={r.profile_image} alt={r.name} className="w-full h-full object-cover" /> : r.name.charAt(0)}
                      </div>
                      <span className="font-medium">{r.name}</span>
                      {r.id === user._id && <span className="text-xs text-primary">(you)</span>}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{r.email}</td>
                  <td className="p-4">
                    <select
                      value={r.role}
                      onChange={e => changeRole(r.id, e.target.value as UserRole)}
                      disabled={updatingId === r.id || r.id === user._id}
                      className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm disabled:opacity-50"
                    >
                      {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                    {updatingId === r.id && <Loader2 className="w-4 h-4 animate-spin inline ml-2 text-primary" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
