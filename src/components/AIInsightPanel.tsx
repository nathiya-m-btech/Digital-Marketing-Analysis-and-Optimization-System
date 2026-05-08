import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { Campaign } from '@/types';

interface Props {
  campaigns: Campaign[];
  role: string;
}

export default function AIInsightPanel({ campaigns, role }: Props) {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const slim = campaigns.slice(0, 30).map(c => ({
        name: c.name, platform: c.platform, budget: c.budget,
        revenue: c.revenue, ROI: c.ROI, season: c.season,
      }));
      const { data, error } = await supabase.functions.invoke('campaign-insights', {
        body: { campaigns: slim, role },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setInsight(data?.insight ?? 'No insight returned.');
    } catch (e) {
      toast({ title: 'AI insight failed', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-primary/20 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-semibold">AI Insight</p>
            <p className="text-xs text-muted-foreground">Powered by Lovable AI · Gemini 2.5 Flash</p>
          </div>
        </div>
        <Button size="sm" onClick={generate} disabled={loading || campaigns.length === 0} className="gradient-primary text-primary-foreground border-0">
          {loading ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Analyzing</> : 'Generate'}
        </Button>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed min-h-[3rem]">
        {insight || (campaigns.length === 0 ? 'Upload data to enable insights.' : 'Click Generate to receive an AI-powered recommendation on your campaigns.')}
      </p>
    </div>
  );
}
