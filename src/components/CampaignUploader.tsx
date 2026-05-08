import { useRef, useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ParsedRow {
  name: string;
  platform: string;
  season: string;
  status?: string;
  budget: number;
  revenue: number;
  roi?: number;
  success_rate?: number;
  product_name?: string;
}

const ALIASES: Record<string, string> = {
  campaign: 'name', campaign_name: 'name', name: 'name',
  platform: 'platform', channel: 'platform',
  season: 'season',
  status: 'status',
  budget: 'budget', spend: 'budget', cost: 'budget',
  revenue: 'revenue', sales: 'revenue',
  roi: 'roi', return_on_investment: 'roi',
  success_rate: 'success_rate', success: 'success_rate',
  product: 'product_name', product_name: 'product_name',
};

const norm = (k: string) => k.toLowerCase().trim().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');

function mapRow(raw: Record<string, unknown>): ParsedRow | null {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = ALIASES[norm(k)];
    if (key) out[key] = v;
  }
  if (!out.name || !out.platform || !out.season) return null;
  const budget = Number(out.budget) || 0;
  const revenue = Number(out.revenue) || 0;
  const roi = out.roi !== undefined ? Number(out.roi) : (budget > 0 ? Math.round(((revenue - budget) / budget) * 100) : 0);
  return {
    name: String(out.name),
    platform: String(out.platform),
    season: String(out.season),
    status: out.status ? String(out.status) : 'Active',
    budget,
    revenue,
    roi,
    success_rate: Number(out.success_rate) || 75,
    product_name: out.product_name ? String(out.product_name) : undefined,
  };
}

interface Props {
  onUploaded?: () => void;
}

export default function CampaignUploader({ onUploaded }: Props) {
  const { user, hasPermission } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const canUpload = hasPermission('campaign.upload');

  const handleFile = async (file: File) => {
    if (!user || !canUpload) {
      toast({ title: 'Access Denied', description: 'Your role cannot upload campaign data.', variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      let rows: Record<string, unknown>[] = [];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'csv') {
        rows = await new Promise((resolve, reject) => {
          Papa.parse<Record<string, unknown>>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (r) => resolve(r.data),
            error: reject,
          });
        });
      } else if (ext === 'xlsx' || ext === 'xls') {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(sheet);
      } else {
        throw new Error('Unsupported file type. Use CSV or XLSX.');
      }

      const parsed = rows.map(mapRow).filter((r): r is ParsedRow => r !== null);
      if (parsed.length === 0) throw new Error('No valid rows. Required columns: name, platform, season, budget, revenue.');

      const payload = parsed.map(r => ({ ...r, owner_id: user._id, is_demo: false }));
      const { error } = await supabase.from('campaigns').insert(payload);
      if (error) throw error;

      toast({ title: 'Upload complete', description: `${parsed.length} campaigns imported. Your dashboard is now updated.` });
      onUploaded?.();
    } catch (err) {
      toast({ title: 'Upload failed', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csv = 'name,platform,season,status,budget,revenue,roi,success_rate,product_name\nSummer Push,Instagram,Summer,Active,5000,15000,200,85,Sunscreen Pro\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'campaign-template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!canUpload) return null;

  return (
    <div className="bg-card border border-dashed border-primary/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileSpreadsheet className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">Upload your marketing report</p>
          <p className="text-xs text-muted-foreground">CSV or XLSX · your dashboard updates from your data</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={downloadTemplate}>Template</Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <Button size="sm" onClick={() => inputRef.current?.click()} disabled={busy} className="gradient-primary text-primary-foreground border-0">
          {busy ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />}
          {busy ? 'Uploading…' : 'Upload Dataset'}
        </Button>
      </div>
    </div>
  );
}
