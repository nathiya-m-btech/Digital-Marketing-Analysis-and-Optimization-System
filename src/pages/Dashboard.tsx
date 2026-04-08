import { useState, useMemo } from 'react';
import { campaigns, platforms, seasons, products } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { DollarSign, TrendingUp, Target, BarChart3, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#3B82F6'];

export default function Dashboard() {
  const [platformFilter, setPlatformFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [drillPlatform, setDrillPlatform] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return campaigns.filter(c =>
      (platformFilter === 'All' || c.platform === platformFilter) &&
      (seasonFilter === 'All' || c.season === seasonFilter) &&
      (!dateFrom || c.created_at >= dateFrom) &&
      (!dateTo || c.created_at <= dateTo)
    );
  }, [platformFilter, seasonFilter, dateFrom, dateTo]);

  const totalRevenue = filtered.reduce((s, c) => s + c.revenue, 0);
  const totalBudget = filtered.reduce((s, c) => s + c.budget, 0);
  const avgROI = filtered.length ? Math.round(filtered.reduce((s, c) => s + c.ROI, 0) / filtered.length) : 0;
  const activeCampaigns = filtered.filter(c => c.status === 'Active').length;

  const roiByPlatform = platforms.map(p => ({
    platform: p,
    ROI: Math.round(filtered.filter(c => c.platform === p).reduce((s, c) => s + c.ROI, 0) / Math.max(filtered.filter(c => c.platform === p).length, 1)),
    revenue: filtered.filter(c => c.platform === p).reduce((s, c) => s + c.revenue, 0),
    budget: filtered.filter(c => c.platform === p).reduce((s, c) => s + c.budget, 0),
  }));

  const seasonalData = seasons.map(s => ({
    season: s,
    revenue: filtered.filter(c => c.season === s).reduce((sum, c) => sum + c.revenue, 0),
    budget: filtered.filter(c => c.season === s).reduce((sum, c) => sum + c.budget, 0),
  }));

  const platformShare = platforms.map(p => ({
    name: p,
    value: filtered.filter(c => c.platform === p).reduce((s, c) => s + c.revenue, 0),
  }));

  const productPerf = products.slice(0, 6).map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    sales: p.sales,
    category: p.category,
  }));

  // Drill-down data
  const drillData = drillPlatform
    ? filtered.filter(c => c.platform === drillPlatform).map(c => ({
        name: c.name.length > 20 ? c.name.slice(0, 20) + '…' : c.name,
        ROI: c.ROI,
        revenue: c.revenue,
        budget: c.budget,
      }))
    : [];

  const kpis = [
    { icon: DollarSign, label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, color: 'text-success' },
    { icon: TrendingUp, label: 'Average ROI', value: `${avgROI}%`, color: 'text-primary' },
    { icon: Target, label: 'Active Campaigns', value: activeCampaigns.toString(), color: 'text-accent' },
    { icon: BarChart3, label: 'Total Budget', value: `$${(totalBudget / 1000).toFixed(0)}K`, color: 'text-warning' },
  ];

  const handleBarClick = (data: any) => {
    if (data?.platform) {
      setDrillPlatform(prev => prev === data.platform ? null : data.platform);
    }
  };

  const downloadPDF = () => {
    // Build a printable HTML report and trigger print
    const reportHTML = `
      <html><head><title>MarketPulse Report</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a2e; }
        h1 { color: #7C3AED; margin-bottom: 8px; }
        h2 { color: #333; margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
        th { background: #f5f5f5; font-weight: 600; }
        .kpi-row { display: flex; gap: 16px; margin: 16px 0; }
        .kpi { background: #f8f8ff; border-radius: 8px; padding: 16px; flex: 1; }
        .kpi-label { font-size: 12px; color: #666; }
        .kpi-value { font-size: 24px; font-weight: bold; }
      </style></head><body>
      <h1>📊 MarketPulse Analytics Report</h1>
      <p style="color:#666">Generated on ${new Date().toLocaleDateString()}</p>
      <div class="kpi-row">
        ${kpis.map(k => `<div class="kpi"><div class="kpi-label">${k.label}</div><div class="kpi-value">${k.value}</div></div>`).join('')}
      </div>
      <h2>Campaign Data</h2>
      <table>
        <tr><th>Campaign</th><th>Platform</th><th>Budget</th><th>Revenue</th><th>ROI</th><th>Season</th><th>Status</th></tr>
        ${filtered.map(c => `<tr><td>${c.name}</td><td>${c.platform}</td><td>$${c.budget.toLocaleString()}</td><td>$${c.revenue.toLocaleString()}</td><td>${c.ROI}%</td><td>${c.season}</td><td>${c.status}</td></tr>`).join('')}
      </table>
      <h2>ROI by Platform</h2>
      <table>
        <tr><th>Platform</th><th>Average ROI</th><th>Total Revenue</th><th>Total Budget</th></tr>
        ${roiByPlatform.map(r => `<tr><td>${r.platform}</td><td>${r.ROI}%</td><td>$${r.revenue.toLocaleString()}</td><td>$${r.budget.toLocaleString()}</td></tr>`).join('')}
      </table>
      <h2>Seasonal Performance</h2>
      <table>
        <tr><th>Season</th><th>Revenue</th><th>Budget</th></tr>
        ${seasonalData.map(s => `<tr><td>${s.season}</td><td>$${s.revenue.toLocaleString()}</td><td>$${s.budget.toLocaleString()}</td></tr>`).join('')}
      </table>
      </body></html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(reportHTML);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your marketing performance</p>
        </div>
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">From</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">To</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="All">All Platforms</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="All">All Seasons</option>
            {seasons.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <FileDown className="w-4 h-4 mr-1" /> PDF Report
          </Button>
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
          <h3 className="font-display font-semibold mb-1">ROI by Platform</h3>
          <p className="text-xs text-muted-foreground mb-4">Click a bar to drill down into campaigns</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roiByPlatform} onClick={(e) => e?.activePayload && handleBarClick(e.activePayload[0]?.payload)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="ROI" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} cursor="pointer" />
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

      {/* Drill-down */}
      {drillPlatform && drillData.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">📊 {drillPlatform} Campaign Breakdown</h3>
            <Button variant="ghost" size="sm" onClick={() => setDrillPlatform(null)}>Close</Button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={drillData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="budget" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

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
