import { campaigns, platforms } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import { Instagram, Youtube, Facebook, Linkedin, Search, Twitter } from 'lucide-react';
import type { Platform } from '@/types';

const COLORS = ['#E1306C', '#4285F4', '#FF0000', '#1877F2', '#000000', '#0A66C2'];

const platformIcons: Record<Platform, { icon: React.ElementType; color: string }> = {
  'Instagram': { icon: Instagram, color: '#E1306C' },
  'Google Ads': { icon: Search, color: '#4285F4' },
  'YouTube': { icon: Youtube, color: '#FF0000' },
  'Facebook': { icon: Facebook, color: '#1877F2' },
  'Twitter/X': { icon: Twitter, color: '#1DA1F2' },
  'LinkedIn': { icon: Linkedin, color: '#0A66C2' },
};

export default function PlatformComparison() {
  const platformStats = platforms.map((p, i) => {
    const pCampaigns = campaigns.filter(c => c.platform === p);
    const count = pCampaigns.length;
    return {
      platform: p,
      avgROI: count ? Math.round(pCampaigns.reduce((s, c) => s + c.ROI, 0) / count) : 0,
      totalRevenue: pCampaigns.reduce((s, c) => s + c.revenue, 0),
      totalBudget: pCampaigns.reduce((s, c) => s + c.budget, 0),
      avgSuccess: count ? Math.round(pCampaigns.reduce((s, c) => s + c.success_rate, 0) / count) : 0,
      campaigns: count,
      colorIdx: i,
    };
  });

  const radarData = platforms.map(p => {
    const stats = platformStats.find(s => s.platform === p)!;
    return { metric: p, ROI: stats.avgROI, Success: stats.avgSuccess };
  });

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold mb-2">Platform Comparison</h1>
      <p className="text-muted-foreground mb-8">Compare performance across all platforms</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {platformStats.map((p) => {
          const pInfo = platformIcons[p.platform as Platform];
          const PlatformIcon = pInfo.icon;
          return (
            <div key={p.platform} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${pInfo.color}15` }}>
                  <PlatformIcon className="w-5 h-5" style={{ color: pInfo.color }} />
                </div>
                <h3 className="font-display font-semibold">{p.platform}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Avg ROI</span><p className="font-bold text-lg">{p.avgROI}%</p></div>
                <div><span className="text-muted-foreground">Revenue</span><p className="font-bold text-lg">${(p.totalRevenue / 1000).toFixed(0)}K</p></div>
                <div><span className="text-muted-foreground">Success</span><p className="font-bold">{p.avgSuccess}%</p></div>
                <div><span className="text-muted-foreground">Campaigns</span><p className="font-bold">{p.campaigns}</p></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Revenue by Platform</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={platformStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalRevenue" name="Revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="totalBudget" name="Budget" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <Radar name="ROI" dataKey="ROI" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
              <Radar name="Success Rate" dataKey="Success" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
