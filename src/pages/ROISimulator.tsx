import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { campaigns, platforms, products } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ROISimulator() {
  const [budget, setBudget] = useState(5000);
  const [revenue, setRevenue] = useState(15000);
  const [roiIncrease, setRoiIncrease] = useState(10);

  const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;
  const profit = revenue - budget;
  const isPositive = roi > 0;

  // Platform impact analysis
  const platformImpact = useMemo(() => {
    return platforms.map(p => {
      const pc = campaigns.filter(c => c.platform === p);
      const currentROI = pc.length ? Math.round(pc.reduce((s, c) => s + c.ROI, 0) / pc.length) : 0;
      const newROI = Math.round(currentROI * (1 + roiIncrease / 100));
      const currentRevenue = pc.reduce((s, c) => s + c.revenue, 0);
      const projectedRevenue = Math.round(currentRevenue * (1 + roiIncrease / 100));
      return { platform: p, currentROI, newROI, currentRevenue, projectedRevenue, gain: projectedRevenue - currentRevenue };
    });
  }, [roiIncrease]);

  // Product impact analysis
  const productImpact = useMemo(() => {
    return products.map(prod => {
      const pc = campaigns.filter(c => c.product_id === prod._id);
      const currentROI = pc.length ? Math.round(pc.reduce((s, c) => s + c.ROI, 0) / pc.length) : 0;
      const newROI = Math.round(currentROI * (1 + roiIncrease / 100));
      const currentRevenue = pc.reduce((s, c) => s + c.revenue, 0);
      const projectedRevenue = Math.round(currentRevenue * (1 + roiIncrease / 100));
      return { name: prod.name, currentROI, newROI, currentRevenue, projectedRevenue, gain: projectedRevenue - currentRevenue };
    });
  }, [roiIncrease]);

  const overallCurrentROI = Math.round(campaigns.reduce((s, c) => s + c.ROI, 0) / campaigns.length);
  const overallNewROI = Math.round(overallCurrentROI * (1 + roiIncrease / 100));
  const totalCurrentRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalProjectedRevenue = Math.round(totalCurrentRevenue * (1 + roiIncrease / 100));

  const chartData = platformImpact.map(p => ({ name: p.platform.split('/')[0], Current: p.currentROI, Projected: p.newROI }));

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold mb-2">ROI Simulator</h1>
        <p className="text-muted-foreground">Calculate ROI and see the impact of increasing it across platforms & products</p>
      </div>

      {/* Basic Calculator */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label className="text-base">Budget ($)</Label>
              <Input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="mt-2 text-lg" />
              <input type="range" min={0} max={100000} step={500} value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full mt-2 accent-primary" />
            </div>
            <div>
              <Label className="text-base">Revenue ($)</Label>
              <Input type="number" value={revenue} onChange={e => setRevenue(Number(e.target.value))} className="mt-2 text-lg" />
              <input type="range" min={0} max={200000} step={500} value={revenue} onChange={e => setRevenue(Number(e.target.value))} className="w-full mt-2 accent-primary" />
            </div>
          </div>
          <div className="border-t border-border pt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={`rounded-xl p-5 text-center ${isPositive ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {isPositive ? <TrendingUp className="w-6 h-6 mx-auto mb-2 text-success" /> : <TrendingDown className="w-6 h-6 mx-auto mb-2 text-destructive" />}
                <p className={`text-3xl font-bold font-display ${isPositive ? 'text-success' : 'text-destructive'}`}>{roi.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">ROI</p>
              </div>
              <div className="bg-muted rounded-xl p-5 text-center">
                <Calculator className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold font-display">${profit.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Net Profit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Increase Impact */}
      <div className="mb-8">
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-bold">What if ROI increases by...</h2>
              <p className="text-sm text-muted-foreground">See the projected impact across all platforms and products</p>
            </div>
            <div className="flex items-center gap-3">
              <input type="range" min={5} max={100} step={5} value={roiIncrease} onChange={e => setRoiIncrease(Number(e.target.value))} className="w-40 accent-primary" />
              <span className="text-2xl font-bold text-primary font-display">+{roiIncrease}%</span>
            </div>
          </div>

          {/* Overall Summary */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Current Avg ROI</p>
              <p className="text-2xl font-bold font-display">{overallCurrentROI}%</p>
            </div>
            <div className="bg-success/10 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Projected Avg ROI</p>
              <p className="text-2xl font-bold font-display text-success">{overallNewROI}%</p>
            </div>
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Revenue Gain</p>
              <p className="text-2xl font-bold font-display text-primary">+${((totalProjectedRevenue - totalCurrentRevenue) / 1000).toFixed(0)}K</p>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="Current" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Projected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Breakdown */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg mb-4">Platform Impact (+{roiIncrease}% ROI)</h3>
            <div className="space-y-3">
              {platformImpact.map(p => (
                <div key={p.platform} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{p.platform}</p>
                    <p className="text-xs text-muted-foreground">ROI: {p.currentROI}% → <span className="text-success">{p.newROI}%</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +${(p.gain / 1000).toFixed(1)}K
                    </p>
                    <p className="text-[10px] text-muted-foreground">${(p.projectedRevenue / 1000).toFixed(0)}K projected</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display font-semibold text-lg mb-4">Product Impact (+{roiIncrease}% ROI)</h3>
            <div className="space-y-3">
              {productImpact.map(p => (
                <div key={p.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">ROI: {p.currentROI}% → <span className="text-success">{p.newROI}%</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +${(p.gain / 1000).toFixed(1)}K
                    </p>
                    <p className="text-[10px] text-muted-foreground">${(p.projectedRevenue / 1000).toFixed(0)}K projected</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <strong>Tip:</strong> An ROI above 100% means you've doubled your investment. Use the slider to explore how even a small ROI increase impacts revenue across all platforms and products.
      </div>
    </div>
  );
}
