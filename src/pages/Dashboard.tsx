import { useState, useMemo } from 'react';
import { campaigns, platforms, seasons, products } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { DollarSign, TrendingUp, Target, BarChart3 } from 'lucide-react';

const COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#3B82F6'];

export default function Dashboard() {
  const [platformFilter, setPlatformFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');

  const filtered = useMemo(() => {
    return campaigns.filter(c =>
      (platformFilter === 'All' || c.platform === platformFilter) &&
      (seasonFilter === 'All' || c.season === seasonFilter)
    );
  }, [platformFilter, seasonFilter]);

  const totalRevenue = filtered.reduce((s, c) => s + c.revenue, 0);
  const totalBudget = filtered.reduce((s, c) => s + c.budget, 0);
  const avgROI = filtered.length ? Math.round(filtered.reduce((s, c) => s + c.ROI, 0) / filtered.length) : 0;
  const activeCampaigns = filtered.filter(c => c.status === 'Active').length;

  const roiByPlatform = platforms.map(p => ({
    platform: p,
    ROI: Math.round(campaigns.filter(c => c.platform === p).reduce((s, c) => s + c.ROI, 0) / Math.max(campaigns.filter(c => c.platform === p).length, 1)),
  }));

  const seasonalData = seasons.map(s => ({
    season: s,
    revenue: campaigns.filter(c => c.season === s).reduce((sum, c) => sum + c.revenue, 0),
    budget: campaigns.filter(c => c.season === s).reduce((sum, c) => sum + c.budget, 0),
  }));

  const platformShare = platforms.map(p => ({
    name: p,
    value: campaigns.filter(c => c.platform === p).reduce((s, c) => s + c.revenue, 0),
  }));

  const productPerf = products.slice(0, 6).map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    sales: p.sales,
    category: p.category,
  }));

  const kpis = [
    { icon: DollarSign, label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, color: 'text-success' },
    { icon: TrendingUp, label: 'Average ROI', value: `${avgROI}%`, color: 'text-primary' },
    { icon: Target, label: 'Active Campaigns', value: activeCampaigns.toString(), color: 'text-accent' },
    { icon: BarChart3, label: 'Total Budget', value: `$${(totalBudget / 1000).toFixed(0)}K`, color: 'text-warning' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your marketing performance</p>
        </div>
        <div className="flex gap-3">
          <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="All">All Platforms</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="All">All Seasons</option>
            {seasons.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-2xl font-bold font-display">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">ROI by Platform</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roiByPlatform}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="ROI" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Revenue Share by Platform</h3>
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Seasonal Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={seasonalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="season" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="budget" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Product Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productPerf} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
