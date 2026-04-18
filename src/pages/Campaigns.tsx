import { useState, useMemo } from 'react';
import { campaigns, platforms, seasons, products } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Download, FileText, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  Active: 'bg-success/10 text-success',
  Paused: 'bg-warning/10 text-warning',
  Completed: 'bg-muted text-muted-foreground',
};

export default function Campaigns() {
  const { hasPermission, user } = useAuth();
  const canCreate = hasPermission('campaign.create');
  const canExport = hasPermission('analytics.export') || !user; // demo allowed for guests
  const [platformFilter, setPlatformFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    return campaigns.filter(c =>
      (platformFilter === 'All' || c.platform === platformFilter) &&
      (seasonFilter === 'All' || c.season === seasonFilter) &&
      (!dateFrom || c.created_at >= dateFrom) &&
      (!dateTo || c.created_at <= dateTo)
    );
  }, [platformFilter, seasonFilter, dateFrom, dateTo]);

  const handleNew = () => {
    if (!canCreate) {
      toast({ title: 'Access Denied', description: `Your role (${user?.role}) cannot create campaigns. Contact an Admin or Marketing Manager.`, variant: 'destructive' });
      return;
    }
    toast({ title: 'New Campaign', description: 'Campaign creation form would open here.' });
  };


  const downloadCSV = () => {
    const headers = 'Name,Platform,Budget,Revenue,ROI,Success Rate,Season,Status\n';
    const rows = filtered.map(c => `${c.name},${c.platform},${c.budget},${c.revenue},${c.ROI}%,${c.success_rate}%,${c.season},${c.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'campaigns.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const html = `
      <html>
      <head>
        <title>MarketPulse Campaign Report</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; }
          h1 { color: #6366f1; font-size: 28px; margin-bottom: 4px; }
          .subtitle { color: #888; font-size: 14px; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          th { background: #f3f4f6; padding: 10px 12px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600; }
          td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
          tr:hover { background: #fafafa; }
          .positive { color: #22c55e; font-weight: 600; }
          .status { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
          .status-Active { background: #dcfce7; color: #16a34a; }
          .status-Paused { background: #fef3c7; color: #d97706; }
          .status-Completed { background: #f3f4f6; color: #6b7280; }
          .summary { display: flex; gap: 24px; margin-bottom: 30px; }
          .summary-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 24px; }
          .summary-card .label { font-size: 12px; color: #888; }
          .summary-card .value { font-size: 24px; font-weight: 700; }
          .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: 11px; }
        </style>
      </head>
      <body>
        <h1>📊 MarketPulse Campaign Report</h1>
        <p class="subtitle">Generated on ${new Date().toLocaleDateString()} • ${filtered.length} campaigns</p>
        <div class="summary">
          <div class="summary-card"><div class="label">Total Budget</div><div class="value">$${filtered.reduce((s, c) => s + c.budget, 0).toLocaleString()}</div></div>
          <div class="summary-card"><div class="label">Total Revenue</div><div class="value">$${filtered.reduce((s, c) => s + c.revenue, 0).toLocaleString()}</div></div>
          <div class="summary-card"><div class="label">Avg ROI</div><div class="value">${Math.round(filtered.reduce((s, c) => s + c.ROI, 0) / filtered.length)}%</div></div>
        </div>
        <table>
          <thead><tr><th>Campaign</th><th>Platform</th><th>Budget</th><th>Revenue</th><th>ROI</th><th>Success</th><th>Season</th><th>Status</th></tr></thead>
          <tbody>
            ${filtered.map(c => `<tr>
              <td><strong>${c.name}</strong></td>
              <td>${c.platform}</td>
              <td>$${c.budget.toLocaleString()}</td>
              <td>$${c.revenue.toLocaleString()}</td>
              <td class="${c.ROI >= 200 ? 'positive' : ''}">${c.ROI}%</td>
              <td>${c.success_rate}%</td>
              <td>${c.season}</td>
              <td><span class="status status-${c.status}">${c.status}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">MarketPulse © ${new Date().getFullYear()} • Confidential</div>
      </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">{filtered.length} campaigns found</p>
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
          <Button variant="outline" size="sm" onClick={downloadCSV}><Download className="w-4 h-4 mr-1" /> CSV</Button>
          <Button variant="outline" size="sm" onClick={downloadPDF}><FileText className="w-4 h-4 mr-1" /> PDF</Button>
          {user && (
            <Button
              size="sm"
              onClick={handleNew}
              disabled={!canCreate}
              className={canCreate ? "gradient-primary text-primary-foreground border-0" : ""}
              variant={canCreate ? 'default' : 'outline'}
              title={canCreate ? 'Create new campaign' : `${user.role} cannot create campaigns`}
            >
              {canCreate ? <Plus className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />}
              New
            </Button>
          )}
        </div>

      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">Campaign</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Platform</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Budget</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Revenue</th>
                <th className="text-left p-4 font-medium text-muted-foreground">ROI</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Season</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const product = products.find(p => p._id === c.product_id);
                return (
                  <tr key={c._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{product?.name}</p>
                    </td>
                    <td className="p-4">{c.platform}</td>
                    <td className="p-4">${c.budget.toLocaleString()}</td>
                    <td className="p-4 font-medium">${c.revenue.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={c.ROI >= 200 ? 'text-success font-medium' : ''}>{c.ROI}%</span>
                    </td>
                    <td className="p-4">{c.season}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
