import { useState, useMemo, useRef } from 'react';
import { platforms, seasons } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useUserCampaigns } from '@/hooks/useUserCampaigns';
import CampaignUploader from '@/components/CampaignUploader';
import { Button } from '@/components/ui/button';
import { Plus, Download, FileText, Lock, Loader2, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const statusColors: Record<string, string> = {
  Active: 'bg-success/10 text-success',
  Paused: 'bg-warning/10 text-warning',
  Completed: 'bg-muted text-muted-foreground',
};

export default function Campaigns() {
  const { user } = useAuth();
  const { campaigns, loading, refetch } = useUserCampaigns(true);
  const [platformFilter, setPlatformFilter] = useState('All');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ name: string; budget: number; revenue: number; status: string }>({ name: '', budget: 0, revenue: 0, status: 'Active' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return campaigns.filter(c =>
      (platformFilter === 'All' || c.platform === platformFilter) &&
      (seasonFilter === 'All' || c.season === seasonFilter) &&
      (!dateFrom || c.created_at >= dateFrom) &&
      (!dateTo || c.created_at <= dateTo)
    );
  }, [campaigns, platformFilter, seasonFilter, dateFrom, dateTo]);

  const canEditRow = (c: typeof campaigns[number]) =>
    !!user && (user.role === 'Admin' || c.user_id === user._id);

  const handleNew = () => {
    if (!user) {
      toast({ title: 'Access Denied', description: 'Please sign in to create campaigns.', variant: 'destructive' });
      return;
    }
    uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast({ title: 'Upload your dataset', description: 'Use the uploader above to add your campaign data — your dashboard will reflect it.' });
  };

  const startEdit = (c: typeof campaigns[number]) => {
    setEditingId(c._id);
    setEditDraft({ name: c.name, budget: c.budget, revenue: c.revenue, status: c.status });
  };

  const saveEdit = async (id: string) => {
    const budget = Number(editDraft.budget) || 0;
    const revenue = Number(editDraft.revenue) || 0;
    const roi = budget > 0 ? Math.round(((revenue - budget) / budget) * 100) : 0;
    const { error } = await supabase.from('campaigns').update({
      name: editDraft.name, budget, revenue, roi, status: editDraft.status,
    }).eq('id', id);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Saved', description: 'Campaign updated.' });
      setEditingId(null);
      refetch();
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('campaigns').delete().eq('id', deleteId);
    setDeleteId(null);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Deleted', description: 'Campaign removed.' }); refetch(); }
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
    const total = filtered.length || 1;
    const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const html = `<html><head><title>MarketPulse Campaign Report</title>
      <style>body{font-family:'Segoe UI',sans-serif;padding:40px;color:#1a1a1a}h1{color:#6366f1;font-size:28px;margin-bottom:4px}.subtitle{color:#888;font-size:14px;margin-bottom:30px}table{width:100%;border-collapse:collapse;font-size:13px}th{background:#f3f4f6;padding:10px 12px;text-align:left;border-bottom:2px solid #e5e7eb;font-weight:600}td{padding:10px 12px;border-bottom:1px solid #e5e7eb}.positive{color:#22c55e;font-weight:600}.status{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600}.status-Active{background:#dcfce7;color:#16a34a}.status-Paused{background:#fef3c7;color:#d97706}.status-Completed{background:#f3f4f6;color:#6b7280}.summary{display:flex;gap:24px;margin-bottom:30px}.summary-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px 24px}.summary-card .label{font-size:12px;color:#888}.summary-card .value{font-size:24px;font-weight:700}.footer{margin-top:40px;text-align:center;color:#aaa;font-size:11px}</style>
      </head><body>
      <h1>📊 MarketPulse Campaign Report</h1>
      <p class="subtitle">Generated on ${new Date().toLocaleDateString()} • ${filtered.length} campaigns</p>
      <div class="summary">
        <div class="summary-card"><div class="label">Total Budget</div><div class="value">$${filtered.reduce((s, c) => s + c.budget, 0).toLocaleString()}</div></div>
        <div class="summary-card"><div class="label">Total Revenue</div><div class="value">$${filtered.reduce((s, c) => s + c.revenue, 0).toLocaleString()}</div></div>
        <div class="summary-card"><div class="label">Avg ROI</div><div class="value">${Math.round(filtered.reduce((s, c) => s + c.ROI, 0) / total)}%</div></div>
      </div>
      <table><thead><tr><th>Campaign</th><th>Platform</th><th>Budget</th><th>Revenue</th><th>ROI</th><th>Season</th><th>Status</th></tr></thead>
      <tbody>${filtered.map(c => `<tr><td><strong>${c.name}</strong></td><td>${c.platform}</td><td>$${c.budget.toLocaleString()}</td><td>$${c.revenue.toLocaleString()}</td><td class="${c.ROI >= 200 ? 'positive' : ''}">${c.ROI}%</td><td>${c.season}</td><td><span class="status status-${c.status}">${c.status}</span></td></tr>`).join('')}</tbody></table>
      <div class="footer">MarketPulse © ${new Date().getFullYear()} • Confidential</div>
      </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
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
              className="gradient-primary text-primary-foreground border-0"
              title="Open uploader to add campaign data"
            >
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          )}
        </div>
      </div>

      {user && (
        <div className="mb-6" ref={uploaderRef}>
          <CampaignUploader onUploaded={refetch} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
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
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const editable = canEditRow(c);
                  const isEditing = editingId === c._id;
                  return (
                    <tr key={c._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        {isEditing ? (
                          <input value={editDraft.name} onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))} className="w-full px-2 py-1 rounded border border-input bg-background text-sm" />
                        ) : (
                          <>
                            <p className="font-medium">{c.name}</p>
                            {c.product_id && <p className="text-xs text-muted-foreground">{c.product_id}</p>}
                          </>
                        )}
                      </td>
                      <td className="p-4">{c.platform}</td>
                      <td className="p-4">
                        {isEditing
                          ? <input type="number" value={editDraft.budget} onChange={e => setEditDraft(d => ({ ...d, budget: Number(e.target.value) }))} className="w-24 px-2 py-1 rounded border border-input bg-background text-sm" />
                          : `$${c.budget.toLocaleString()}`}
                      </td>
                      <td className="p-4 font-medium">
                        {isEditing
                          ? <input type="number" value={editDraft.revenue} onChange={e => setEditDraft(d => ({ ...d, revenue: Number(e.target.value) }))} className="w-24 px-2 py-1 rounded border border-input bg-background text-sm" />
                          : `$${c.revenue.toLocaleString()}`}
                      </td>
                      <td className="p-4">
                        <span className={c.ROI >= 200 ? 'text-success font-medium' : ''}>{c.ROI}%</span>
                      </td>
                      <td className="p-4">{c.season}</td>
                      <td className="p-4">
                        {isEditing ? (
                          <select value={editDraft.status} onChange={e => setEditDraft(d => ({ ...d, status: e.target.value }))} className="px-2 py-1 rounded border border-input bg-background text-sm">
                            <option>Active</option><option>Paused</option><option>Completed</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => saveEdit(c._id)}><Check className="w-4 h-4 text-success" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                          </div>
                        ) : editable ? (
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => startEdit(c)} title="Edit"><Pencil className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => setDeleteId(c._id)} title="Delete"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground inline" />
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No campaigns yet. Upload a dataset to get started.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this campaign?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
