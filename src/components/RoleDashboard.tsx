import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaigns as allCampaigns, platforms, seasons, products, surveys } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { DollarSign, TrendingUp, Target, BarChart3, Users, Settings, FileText, ClipboardList, Shield, Eye, Download, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/types';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--success))', 'hsl(var(--info))'];

// Role-specific quick actions — defines what each role CAN do
const ROLE_ACTIONS: Record<UserRole, { label: string; to: string; icon: React.ElementType; primary?: boolean }[]> = {
  'Admin': [
    { label: 'New Campaign', to: '/campaigns', icon: Plus, primary: true },
    { label: 'Manage Users', to: '/profile', icon: Users },
    { label: 'System Settings', to: '/profile', icon: Settings },
  ],
  'CMO': [
    { label: 'Strategic Insights', to: '/seasonal-insights', icon: Eye, primary: true },
    { label: 'Platform Analysis', to: '/platform-comparison', icon: BarChart3 },
  ],
  'Marketing Manager': [
    { label: 'New Campaign', to: '/campaigns', icon: Plus, primary: true },
    { label: 'View Analytics', to: '/platform-comparison', icon: BarChart3 },
  ],
  'Business Owner': [
    { label: 'Revenue Report', to: '/campaigns', icon: DollarSign, primary: true },
    { label: 'Platform Performance', to: '/platform-comparison', icon: TrendingUp },
  ],
  'Digital Marketing Specialist': [
    { label: 'Analyze Campaigns', to: '/campaigns', icon: BarChart3, primary: true },
    { label: 'Survey Data', to: '/surveys', icon: FileText },
  ],
  'Freelancer': [
    { label: 'View Campaigns', to: '/campaigns', icon: Eye, primary: true },
    { label: 'Submit Survey', to: '/surveys', icon: ClipboardList },
  ],
};


interface RoleDashboardProps {
  role: UserRole;
  userName: string;
}

function generateDashboardPDF(role: UserRole, userName: string, campaigns: typeof allCampaigns) {
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const avgROI = campaigns.length ? Math.round(campaigns.reduce((s, c) => s + c.ROI, 0) / campaigns.length) : 0;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;

  const html = `<html><head><title>${role} Dashboard Report</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; }
      h1 { color: #6366f1; font-size: 24px; margin-bottom: 4px; }
      .subtitle { color: #888; font-size: 13px; margin-bottom: 24px; }
      .kpis { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
      .kpi { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 20px; min-width: 140px; }
      .kpi .label { font-size: 11px; color: #888; text-transform: uppercase; }
      .kpi .value { font-size: 22px; font-weight: 700; margin-top: 4px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 16px; }
      th { background: #f3f4f6; padding: 8px 10px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; }
      td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
      .positive { color: #22c55e; font-weight: 600; }
      .status { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
      .status-Active { background: #dcfce7; color: #16a34a; }
      .status-Paused { background: #fef3c7; color: #d97706; }
      .status-Completed { background: #f3f4f6; color: #6b7280; }
      .footer { margin-top: 30px; text-align: center; color: #aaa; font-size: 10px; }
    </style></head><body>
    <h1>📊 ${role} Dashboard Report</h1>
    <p class="subtitle">Generated for ${userName} on ${new Date().toLocaleDateString()} · Role: ${role}</p>
    <div class="kpis">
      <div class="kpi"><div class="label">Total Revenue</div><div class="value">$${(totalRevenue / 1000).toFixed(0)}K</div></div>
      <div class="kpi"><div class="label">Total Budget</div><div class="value">$${(totalBudget / 1000).toFixed(0)}K</div></div>
      <div class="kpi"><div class="label">Average ROI</div><div class="value">${avgROI}%</div></div>
      <div class="kpi"><div class="label">Active Campaigns</div><div class="value">${activeCampaigns}</div></div>
    </div>
    <h3>Campaign Details</h3>
    <table>
      <thead><tr><th>Campaign</th><th>Platform</th><th>Budget</th><th>Revenue</th><th>ROI</th><th>Status</th></tr></thead>
      <tbody>${campaigns.map(c => `<tr>
        <td><strong>${c.name}</strong></td><td>${c.platform}</td>
        <td>$${c.budget.toLocaleString()}</td><td>$${c.revenue.toLocaleString()}</td>
        <td class="${c.ROI >= 200 ? 'positive' : ''}">${c.ROI}%</td>
        <td><span class="status status-${c.status}">${c.status}</span></td>
      </tr>`).join('')}</tbody>
    </table>
    <div class="footer">MarketPulse © ${new Date().getFullYear()} · ${role} Report · Confidential</div>
  </body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); w.print(); }
}

function KPICard({ icon: Icon, label, value, color, delay }: { icon: React.ElementType; label: string; value: string; color: string; delay: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-scale-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
    </div>
  );
}

export default function RoleDashboard({ role, userName }: RoleDashboardProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const campaigns = useMemo(
    () => allCampaigns.filter(c =>
      (!dateFrom || c.created_at >= dateFrom) &&
      (!dateTo || c.created_at <= dateTo)
    ),
    [dateFrom, dateTo]
  );

  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const avgROI = campaigns.length ? Math.round(campaigns.reduce((s, c) => s + c.ROI, 0) / campaigns.length) : 0;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const avgSuccess = campaigns.length ? Math.round(campaigns.reduce((s, c) => s + c.success_rate, 0) / campaigns.length) : 0;

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center animate-scale-in">
            <RoleIcon className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">{config.title}</h1>
            <p className="text-muted-foreground">{config.subtitle}</p>
            <p className="text-xs text-primary font-medium mt-1">Logged in as {userName} · {role}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => generateDashboardPDF(role, userName)}>
          <Download className="w-4 h-4 mr-1" /> PDF Report
        </Button>
      </div>

      {/* Admin Dashboard */}
      {role === 'Admin' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { icon: DollarSign, label: 'Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, color: 'text-success' },
              { icon: TrendingUp, label: 'Avg ROI', value: `${avgROI}%`, color: 'text-primary' },
              { icon: Target, label: 'Active', value: `${activeCampaigns}`, color: 'text-accent' },
              { icon: Users, label: 'Users', value: '6 roles', color: 'text-primary' },
              { icon: Settings, label: 'System', value: 'Healthy', color: 'text-success' },
            ].map((kpi, i) => (
              <KPICard key={i} icon={kpi.icon} label={kpi.label} value={kpi.value} color={kpi.color} delay={i * 60} />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display font-semibold mb-4">ROI by Platform</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="ROI" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
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
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
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
                  {campaigns.map((c, i) => (
                    <tr key={c._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
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
              <KPICard key={i} icon={kpi.icon} label={kpi.label} value={kpi.value} color={kpi.color} delay={i * 80} />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display font-semibold mb-4">Strategic: Revenue by Platform</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display font-semibold mb-4">Seasonal Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="season" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
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
              <KPICard key={i} icon={kpi.icon} label={kpi.label} value={kpi.value} color={kpi.color} delay={i * 80} />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display font-semibold mb-4">Platform ROI</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="ROI" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
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
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="font-display font-semibold mb-4">Active Campaigns</h3>
            <div className="space-y-3">
              {campaigns.filter(c => c.status === 'Active').map((c, i) => (
                <div key={c._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
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
              <KPICard key={i} icon={kpi.icon} label={kpi.label} value={kpi.value} color={kpi.color} delay={i * 80} />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display font-semibold mb-4">Revenue by Platform</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display font-semibold mb-4">Seasonal Revenue Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="season" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
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
              { icon: FileText, label: 'Surveys', value: `${surveys.length}`, color: 'text-primary' },
              { icon: BarChart3, label: 'Campaigns', value: `${campaigns.length}`, color: 'text-warning' },
            ].map((kpi, i) => (
              <KPICard key={i} icon={kpi.icon} label={kpi.label} value={kpi.value} color={kpi.color} delay={i * 80} />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display font-semibold mb-4">Campaign Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="ROI" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display font-semibold mb-4">Survey Insights</h3>
              <div className="space-y-3">
                {surveys.map((s, i) => (
                  <div key={s._id} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
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
              <KPICard key={i} icon={kpi.icon} label={kpi.label} value={kpi.value} color={kpi.color} delay={i * 80} />
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-6 mb-6 hover:shadow-md transition-shadow">
            <h3 className="font-display font-semibold mb-4">Available Campaigns</h3>
            <div className="space-y-3">
              {campaigns.map((c, i) => (
                <div key={c._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.platform} · {c.season}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${c.status === 'Active' ? 'bg-success/10 text-success' : c.status === 'Paused' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
            <h3 className="font-display font-semibold mb-4">Survey Responses</h3>
            <div className="space-y-3">
              {surveys.map((s, i) => (
                <div key={s._id} className="p-3 bg-muted/30 rounded-lg flex justify-between items-center hover:bg-muted/50 transition-colors animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
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
