import { campaigns, products, seasons } from '@/data/mockData';
import { Sun, CloudRain, Snowflake, PartyPopper, TrendingUp, BarChart3, ShoppingBag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const seasonIcons: Record<string, React.ElementType> = {
  Summer: Sun, Rainy: CloudRain, Winter: Snowflake, Festival: PartyPopper,
};

const seasonDescriptions: Record<string, string> = {
  Summer: 'Peak season for outdoor, beauty & fitness products. High engagement on Instagram & YouTube with lifestyle content.',
  Rainy: 'Strong demand for protective gear & indoor products. Cost-effective Google Ads and Facebook campaigns thrive.',
  Winter: 'Apparel & home comfort products surge. YouTube tutorials and LinkedIn B2B campaigns perform best.',
  Festival: 'Highest ROI season. Gift & decor products dominate. Multi-platform blitz with heavy social media spend.',
};

const seasonColors: Record<string, { gradient: string; hex: string }> = {
  Summer: { gradient: 'from-warning to-destructive', hex: '#F59E0B' },
  Rainy: { gradient: 'from-info to-accent', hex: '#3B82F6' },
  Winter: { gradient: 'from-primary to-info', hex: '#8B5CF6' },
  Festival: { gradient: 'from-accent to-warning', hex: '#EC4899' },
};

export default function SeasonalInsights() {
  const seasonData = seasons.map(season => {
    const sc = campaigns.filter(c => c.season === season);
    const avgROI = sc.length ? Math.round(sc.reduce((s, c) => s + c.ROI, 0) / sc.length) : 0;
    const totalRevenue = sc.reduce((s, c) => s + c.revenue, 0);
    const totalBudget = sc.reduce((s, c) => s + c.budget, 0);
    const avgSuccess = sc.length ? Math.round(sc.reduce((s, c) => s + c.success_rate, 0) / sc.length) : 0;
    return { season, avgROI, totalRevenue, totalBudget, campaigns: sc.length, avgSuccess };
  });

  const chartData = seasonData.map(d => ({ name: d.season, Revenue: d.totalRevenue, Budget: d.totalBudget, ROI: d.avgROI }));
  const pieData = seasonData.map(d => ({ name: d.season, value: d.totalRevenue }));
  const COLORS = seasons.map(s => seasonColors[s].hex);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold mb-3">Seasonal Marketing Insights</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Deep dive into how seasons shape marketing performance, product demand, and campaign ROI across all platforms.</p>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Revenue vs Budget by Season</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="Budget" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Season Cards */}
      <div className="space-y-6">
        {seasons.map((season, i) => {
          const Icon = seasonIcons[season];
          const data = seasonData[i];
          const seasonProducts = products.filter(p => p.season_peak === season);
          const seasonCampaigns = campaigns.filter(c => c.season === season);

          return (
            <div key={season} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`h-2 bg-gradient-to-r ${seasonColors[season].gradient}`} />
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${seasonColors[season].gradient} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-2xl mb-2">{season} Season</h2>
                      <p className="text-muted-foreground mb-4">{seasonDescriptions[season]}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">Avg ROI</p>
                          <p className="font-display font-bold text-xl text-success">{data.avgROI}%</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">Total Revenue</p>
                          <p className="font-display font-bold text-xl">${(data.totalRevenue / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">Campaigns</p>
                          <p className="font-display font-bold text-xl">{data.campaigns}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground">Avg Success</p>
                          <p className="font-display font-bold text-xl">{data.avgSuccess}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products & Campaigns */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1"><ShoppingBag className="w-4 h-4" /> Top Products</h4>
                    <div className="space-y-2">
                      {seasonProducts.map(p => (
                        <div key={p._id} className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2 text-sm">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-muted-foreground">{p.category} · {(p.sales / 1000).toFixed(0)}K sales</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1"><BarChart3 className="w-4 h-4" /> Campaigns</h4>
                    <div className="space-y-2">
                      {seasonCampaigns.map(c => (
                        <div key={c._id} className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2 text-sm">
                          <span className="font-medium">{c.name}</span>
                          <span className="text-muted-foreground">{c.platform} · ROI {c.ROI}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
