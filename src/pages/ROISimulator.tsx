import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';

export default function ROISimulator() {
  const [budget, setBudget] = useState(5000);
  const [revenue, setRevenue] = useState(15000);

  const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0;
  const profit = revenue - budget;
  const isPositive = roi > 0;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold mb-2">ROI Simulator</h1>
          <p className="text-muted-foreground">Calculate your campaign return on investment</p>
        </div>

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
                <div className="flex items-center justify-center mb-2">
                  {isPositive ? <TrendingUp className="w-6 h-6 text-success" /> : <TrendingDown className="w-6 h-6 text-destructive" />}
                </div>
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

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <strong>Tip:</strong> An ROI above 100% means you've doubled your investment. The best campaigns on MarketPulse average 200%+ ROI.
          </div>
        </div>
      </div>
    </div>
  );
}
