import { useState, useMemo } from 'react';
import { campaigns, platforms, seasons, products } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

const statusColors: Record<string, string> = {
  Active: 'bg-success/10 text-success',
  Paused: 'bg-warning/10 text-warning',
  Completed: 'bg-muted text-muted-foreground',
};

export default function Campaigns() {
  const { canEdit } = useAuth();
  const [platformFilter, setPlatformFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');

  const filtered = useMemo(() => {
    return campaigns.filter(c =>
      (platformFilter === 'All' || c.platform === platformFilter) &&
      (seasonFilter === 'All' || c.season === seasonFilter)
    );
  }, [platformFilter, seasonFilter]);

  const downloadCSV = () => {
    const headers = 'Name,Platform,Budget,Revenue,ROI,Success Rate,Season,Status\n';
    const rows = filtered.map(c => `${c.name},${c.platform},${c.budget},${c.revenue},${c.ROI}%,${c.success_rate}%,${c.season},${c.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'campaigns.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">{filtered.length} campaigns found</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="All">All Platforms</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={seasonFilter} onChange={e => setSeasonFilter(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="All">All Seasons</option>
            {seasons.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={downloadCSV}><Download className="w-4 h-4 mr-1" /> CSV</Button>
          {canEdit && <Button size="sm" className="gradient-primary text-primary-foreground border-0"><Plus className="w-4 h-4 mr-1" /> New</Button>}
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
