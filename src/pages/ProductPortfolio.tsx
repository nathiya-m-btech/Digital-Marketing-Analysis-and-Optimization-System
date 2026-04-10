import { products, campaigns, seasons } from '@/data/mockData';
import { ShoppingBag, Sun, CloudRain, Snowflake, PartyPopper, TrendingUp, DollarSign, Target, Droplets, Shirt, Home, Gift, Cpu, Umbrella, Lamp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const seasonIcons: Record<string, React.ElementType> = {
  Summer: Sun, Rainy: CloudRain, Winter: Snowflake, Festival: PartyPopper,
};

const productIcons: Record<string, React.ElementType> = {
  'Sunscreen Pro': Sun,
  'Rain Jacket Elite': Droplets,
  'Thermal Mug': Home,
  'Gift Hamper Deluxe': Gift,
  'Fitness Tracker X': Cpu,
  'Umbrella Ultra': Umbrella,
  'Wool Sweater': Shirt,
  'Party Lights Set': Lamp,
};

const productColors: Record<string, string> = {
  'Sunscreen Pro': '#F59E0B',
  'Rain Jacket Elite': '#3B82F6',
  'Thermal Mug': '#8B5CF6',
  'Gift Hamper Deluxe': '#EC4899',
  'Fitness Tracker X': '#10B981',
  'Umbrella Ultra': '#06B6D4',
  'Wool Sweater': '#6366F1',
  'Party Lights Set': '#F97316',
};

export default function ProductPortfolio() {
  const productData = products.map(product => {
    const linked = campaigns.filter(c => c.product_id === product._id);
    const totalRevenue = linked.reduce((s, c) => s + c.revenue, 0);
    const totalBudget = linked.reduce((s, c) => s + c.budget, 0);
    const avgROI = linked.length ? Math.round(linked.reduce((s, c) => s + c.ROI, 0) / linked.length) : 0;
    const avgSuccess = linked.length ? Math.round(linked.reduce((s, c) => s + c.success_rate, 0) / linked.length) : 0;
    return { ...product, totalRevenue, totalBudget, avgROI, avgSuccess, campaignCount: linked.length, linkedCampaigns: linked };
  });

  const chartData = productData.map(p => ({ name: p.name.split(' ')[0], Sales: p.sales, Revenue: p.totalRevenue }));
  const radarData = productData.slice(0, 6).map(p => ({
    name: p.name.split(' ')[0], ROI: p.avgROI, Success: p.avgSuccess, Sales: Math.round(p.sales / 1000),
  }));

  const totalSales = products.reduce((s, p) => s + p.sales, 0);
  const totalRevenue = productData.reduce((s, p) => s + p.totalRevenue, 0);
  const avgROI = Math.round(productData.reduce((s, p) => s + p.avgROI, 0) / productData.length);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold mb-3">Product Portfolio</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Explore our complete product lineup with performance metrics, seasonal mapping, and campaign analytics.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-primary" /></div>
          <div><p className="text-sm text-muted-foreground">Total Sales</p><p className="font-display font-bold text-2xl">{(totalSales / 1000).toFixed(0)}K</p></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center"><DollarSign className="w-6 h-6 text-success" /></div>
          <div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="font-display font-bold text-2xl">${(totalRevenue / 1000).toFixed(0)}K</p></div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-warning" /></div>
          <div><p className="text-sm text-muted-foreground">Avg ROI</p><p className="font-display font-bold text-2xl">{avgROI}%</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-4">Sales & Revenue by Product</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="Sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold text-lg mb-4">Product Performance Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Radar name="ROI" dataKey="ROI" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              <Radar name="Success %" dataKey="Success" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {productData.map((product, i) => {
          const SeasonIcon = seasonIcons[product.season_peak];
          const ProductIcon = productIcons[product.name] || ShoppingBag;
          const productColor = productColors[product.name] || '#7C3AED';
          return (
            <div key={product._id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
              {/* Product Image/Icon Header */}
              <div className="h-32 flex items-center justify-center relative" style={{ backgroundColor: `${productColor}12` }}>
                <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 50% 50%, ${productColor}, transparent 70%)` }} />
                <ProductIcon className="w-16 h-16" style={{ color: productColor }} />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <h3 className="font-display font-semibold">{product.name}</h3>
                    <span className="text-xs text-muted-foreground">{product.category}</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Sales</span>
                    <span className="font-semibold">{(product.sales / 1000).toFixed(0)}K units</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-semibold text-success">${(product.totalRevenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Avg ROI</span>
                    <span className="font-semibold">{product.avgROI}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Peak Season</span>
                    <span className="flex items-center gap-1 text-xs font-medium"><SeasonIcon className="w-3.5 h-3.5" /> {product.season_peak}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Campaigns</span>
                    <span className="font-semibold">{product.campaignCount}</span>
                  </div>
                </div>
                {product.linkedCampaigns.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><Target className="w-3 h-3" /> Linked Campaigns</p>
                    <div className="flex flex-wrap gap-1">
                      {product.linkedCampaigns.map(c => (
                        <span key={c._id} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c.name.split(' ').slice(0, 2).join(' ')}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
