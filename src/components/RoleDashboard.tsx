import { useMemo } from 'react';
import { campaigns, platforms, seasons, products, surveys } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { DollarSign, TrendingUp, Target, BarChart3, Users, Settings, FileText, ClipboardList, Shield, Eye } from 'lucide-react';
import type { UserRole } from '@/types';

const COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#3B82F6'];

interface RoleDashboardProps {
  role: UserRole;
  userName: string;
}

export default function RoleDashboard({ role, userName }: RoleDashboardProps) {
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const avgROI = Math.round(campaigns.reduce((s, c) => s + c.ROI, 0) / campaigns.length);
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const avgSuccess = Math.round(campaigns.reduce((s, c) => s + c.success_rate, 0) / campaigns.length);

  const roiByPlatform = platforms.map(p => {
    const pc = campaigns.filter(c => c.platform === p);
    return {
      platform: p,
      ROI: pc.length ? Math.round(pc.reduce((s, c) => s + c.ROI, 0) / pc.length) : 0,
      revenue: pc.reduce((s, c) => s + c.revenue, 0),
    };
  });

  const seasonalData = seasons.map(s => ({
    season: s,
    revenue: campaigns.filter(c => c.season === s).reduce((sum, c) => sum + c.revenue, 0),
    budget: campaigns.filter(c => c.season === s).reduce((sum, c) => sum + c.budget, 0),
  }));

  const platformShare = platforms.map(p => ({
    name: p,
    value: campaigns.filter(c => c.platform === p).reduce((s, c) => s + c.revenue, 0),
  }));

  const roleConfig: Record<UserRole, { title: string; subtitle: string; icon: React.ElementType }> = {
    'Admin': { title: 'Admin Dashboard', subtitle: 'Full system access — manage users, campaigns, and settings', icon: Shield },
    'CMO': { title: 'Executive Dashboard', subtitle: 'Strategic high-level KPIs and performance overview', icon: Eye },
    'Marketing Manager': { title: 'Campaign Manager', subtitle: 'Create and manage campaigns, view analytics', icon: Target },
    'Business Owner': { title: 'Business Overview', subtitle: 'Revenue, ROI, and platform performance insights', icon: DollarSign },
    'Digital Marketing Specialist': { title: 'Analytics Hub', subtitle: 'Deep campaign analysis and survey data insights', icon: BarChart3 },
    'Freelancer': { title: 'Freelancer View', subtitle: 'View campaigns and submit surveys', icon: ClipboardList },
  };

  const config = roleConfig[role];
  const RoleIcon = config.icon;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Role Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
          <RoleIcon className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground">{config.subtitle}</p>
          <p className="text-xs text-primary font-medium mt-1">Logged in as {userName} · {role}</p>
        </div>
      </div>

      {/* Admin Dashboard */}
      {role === 'Admin' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { icon: DollarSign, label: 'Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, color: 'text-success' },
              { icon: TrendingUp, label: 'Avg ROI', value: `${avgROI}%`, color: 'text-primary' },
              { icon: Target, label: 'Active', value: `${activeCampaigns}`, color: 'text-accent' },
              { icon: Users, label: 'Users', value: '6 roles', color: 'text-info' },
              { icon: Settings, label: 'System', value: 'Healthy', color: 'text-success' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <p className="text-xl font-bold font-display">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">ROI by Platform</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ROI" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Revenue Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={platformShare} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name }) => name}>
                    {platformShare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Admin: All campaigns table */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4">All Campaigns</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-left">
                  <th className="pb-2 text-muted-foreground font-medium">Name</th>
                  <th className="pb-2 text-muted-foreground font-medium">Platform</th>
                  <th className="pb-2 text-muted-foreground font-medium">Budget</th>
                  <th className="pb-2 text-muted-foreground font-medium">Revenue</th>
                  <th className="pb-2 text-muted-foreground font-medium">ROI</th>
                  <th className="pb-2 text-muted-foreground font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c._id} className="border-b border-border/50">
                      <td className="py-2 font-medium">{c.name}</td>
                      <td className="py-2">{c.platform}</td>
                      <td className="py-2">${c.budget.toLocaleString()}</td>
                      <td className="py-2 text-success">${c.revenue.toLocaleString()}</td>
                      <td className="py-2">{c.ROI}%</td>
                      <td className="py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${c.status === 'Active' ? 'bg-success/10 text-success' : c.status === 'Paused' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CMO Dashboard */}
      {role === 'CMO' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: DollarSign, label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, color: 'text-success' },
              { icon: TrendingUp, label: 'Overall ROI', value: `${avgROI}%`, color: 'text-primary' },
              { icon: BarChart3, label: 'Budget Spent', value: `$${(totalBudget / 1000).toFixed(0)}K`, color: 'text-warning' },
              { icon: Target, label: 'Success Rate', value: `${avgSuccess}%`, color: 'text-accent' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Strategic: Revenue by Platform</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Seasonal Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="season" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="budget" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Marketing Manager */}
      {role === 'Marketing Manager' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Target, label: 'Active Campaigns', value: `${activeCampaigns}`, color: 'text-accent' },
              { icon: TrendingUp, label: 'Avg ROI', value: `${avgROI}%`, color: 'text-primary' },
              { icon: DollarSign, label: 'Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, color: 'text-success' },
              { icon: BarChart3, label: 'Budget', value: `$${(totalBudget / 1000).toFixed(0)}K`, color: 'text-warning' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Platform ROI</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ROI" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Revenue Share</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={platformShare} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name }) => name}>
                    {platformShare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4">Campaign Management</h3>
            <div className="space-y-3">
              {campaigns.filter(c => c.status === 'Active').map(c => (
                <div key={c._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.platform} · {c.season}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">{c.ROI}% ROI</p>
                    <p className="text-xs text-muted-foreground">${c.revenue.toLocaleString()} revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Business Owner */}
      {role === 'Business Owner' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              { icon: DollarSign, label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, color: 'text-success' },
              { icon: TrendingUp, label: 'ROI', value: `${avgROI}%`, color: 'text-primary' },
              { icon: BarChart3, label: 'Total Investment', value: `$${(totalBudget / 1000).toFixed(0)}K`, color: 'text-warning' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Revenue by Platform</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Seasonal Revenue Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="season" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Digital Marketing Specialist */}
      {role === 'Digital Marketing Specialist' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: TrendingUp, label: 'Avg ROI', value: `${avgROI}%`, color: 'text-primary' },
              { icon: Target, label: 'Success Rate', value: `${avgSuccess}%`, color: 'text-accent' },
              { icon: FileText, label: 'Surveys', value: `${surveys.length}`, color: 'text-info' },
              { icon: BarChart3, label: 'Campaigns', value: `${campaigns.length}`, color: 'text-warning' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Campaign Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ROI" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Survey Insights</h3>
              <div className="space-y-3">
                {surveys.map(s => (
                  <div key={s._id} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{s.type}</span>
                      <span className="text-primary font-bold">⭐ {s.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(s.answers).map(([k, v]) => (
                        <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{k}: {v}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Freelancer */}
      {role === 'Freelancer' && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: Target, label: 'Total Campaigns', value: `${campaigns.length}`, color: 'text-accent' },
              { icon: ClipboardList, label: 'Surveys Submitted', value: `${surveys.length}`, color: 'text-primary' },
            ].map((kpi, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-bold font-display">{kpi.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h3 className="font-display font-semibold mb-4">Available Campaigns</h3>
            <div className="space-y-3">
              {campaigns.map(c => (
                <div key={c._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.platform} · {c.season}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${c.status === 'Active' ? 'bg-success/10 text-success' : c.status === 'Paused' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4">Survey Responses</h3>
            <div className="space-y-3">
              {surveys.map(s => (
                <div key={s._id} className="p-3 bg-muted/30 rounded-lg flex justify-between items-center">
                  <span className="font-medium text-sm">{s.type}</span>
                  <span className="text-primary font-bold">⭐ {s.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
