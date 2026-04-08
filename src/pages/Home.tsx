import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Target, TrendingUp, Zap, Sun, CloudRain, Snowflake, PartyPopper, ShoppingBag } from 'lucide-react';
import { reviews, products, seasons, campaigns } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  { icon: BarChart3, title: 'Multi-Platform Analytics', desc: 'Track campaigns across Instagram, Google Ads, YouTube, Facebook, Twitter/X, and LinkedIn.' },
  { icon: TrendingUp, title: 'ROI Optimization', desc: 'Calculate and simulate ROI with real-time data and seasonal insights.' },
  { icon: Target, title: 'Campaign Intelligence', desc: 'Manage campaigns with smart filters by platform, season, and product.' },
  { icon: Zap, title: 'Real-time Notifications', desc: 'Get instant updates on campaign performance and survey responses.' },
];

const seasonIcons: Record<string, React.ElementType> = {
  Summer: Sun,
  Rainy: CloudRain,
  Winter: Snowflake,
  Festival: PartyPopper,
};

const seasonDescriptions: Record<string, string> = {
  Summer: 'Peak season for outdoor, beauty & fitness products. High engagement on Instagram & YouTube with lifestyle content.',
  Rainy: 'Strong demand for protective gear & indoor products. Cost-effective Google Ads and Facebook campaigns thrive.',
  Winter: 'Apparel & home comfort products surge. YouTube tutorials and LinkedIn B2B campaigns perform best.',
  Festival: 'Highest ROI season. Gift & decor products dominate. Multi-platform blitz with heavy social media spend.',
};

const seasonColors: Record<string, string> = {
  Summer: 'from-warning to-destructive',
  Rainy: 'from-info to-accent',
  Winter: 'from-primary to-info',
  Festival: 'from-accent to-warning',
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start animate-slide-up">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-lg font-bold overflow-hidden shadow-lg">
                    {user.profile_image ? (
                      <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Welcome back,</p>
                    <p className="font-display font-bold text-lg">{user.name}</p>
                  </div>
                </div>
              )}

              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-slide-up">
                🚀 Digital Marketing Intelligence Platform
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl animate-slide-up" style={{ animationDelay: '100ms' }}>
                Supercharge Your{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_3s_ease-in-out_infinite]">
                  Marketing ROI
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
                Track, analyze, and optimize campaigns across 6 platforms. Real-time dashboards, seasonal insights, and intelligent ROI simulation.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '300ms' }}>
                <Link to={isAuthenticated ? '/dashboard' : '/login'}>
                  <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started'} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline" className="px-8 text-base hover:scale-105 transition-all duration-300">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero image / visual */}
            <div className="flex-1 relative animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-2xl opacity-20 animate-float" />
                <div className="relative bg-card border border-border rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-xs text-muted-foreground ml-2">MarketPulse Dashboard</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      {[
                        { label: 'Revenue', value: '$204K', color: 'bg-success/10 text-success' },
                        { label: 'ROI', value: '203%', color: 'bg-primary/10 text-primary' },
                      ].map(kpi => (
                        <div key={kpi.label} className={`flex-1 rounded-xl p-3 ${kpi.color}`}>
                          <p className="text-[10px] opacity-70">{kpi.label}</p>
                          <p className="text-lg font-bold font-display">{kpi.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="h-32 rounded-xl bg-muted/50 flex items-end gap-1.5 p-3">
                      {[40, 65, 50, 80, 70, 90, 60, 85].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md gradient-primary opacity-80"
                          style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {['Instagram', 'Google', 'YouTube'].map(p => (
                        <span key={p} className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-4">Seasonal Marketing Insights</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Understand how different seasons impact marketing performance and product demand across platforms.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {seasons.map((season, i) => {
              const Icon = seasonIcons[season];
              const seasonCampaigns = campaigns.filter(c => c.season === season);
              const avgROI = seasonCampaigns.length
                ? Math.round(seasonCampaigns.reduce((s, c) => s + c.ROI, 0) / seasonCampaigns.length)
                : 0;
              const totalRevenue = seasonCampaigns.reduce((s, c) => s + c.revenue, 0);
              const seasonProducts = products.filter(p => p.season_peak === season);

              return (
                <div key={season} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${seasonColors[season]} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-xl mb-1">{season} Season</h3>
                      <p className="text-sm text-muted-foreground mb-3">{seasonDescriptions[season]}</p>
                      <div className="flex gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Avg ROI</p>
                          <p className="font-display font-bold text-success">{avgROI}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                          <p className="font-display font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Campaigns</p>
                          <p className="font-display font-bold">{seasonCampaigns.length}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {seasonProducts.map(p => (
                          <span key={p._id} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{p.name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-4">Product Portfolio</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Explore our product lineup with seasonal performance mapping and sales data.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product, i) => {
              const linkedCampaigns = campaigns.filter(c => c.product_id === product._id);
              const totalRev = linkedCampaigns.reduce((s, c) => s + c.revenue, 0);
              const SeasonIcon = seasonIcons[product.season_peak];

              return (
                <div key={product._id} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-sm">{product.name}</h3>
                      <span className="text-xs text-muted-foreground">{product.category}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Sales</span>
                      <span className="font-semibold">{(product.sales / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-semibold">${(totalRev / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Peak Season</span>
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <SeasonIcon className="w-3.5 h-3.5" /> {product.season_peak}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Campaigns</span>
                      <span className="font-semibold">{linkedCampaigns.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map(r => (
              <div key={r._id} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300">
                <p className="text-muted-foreground mb-4">"{r.feedback}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{r.name}</span>
                  <span className="text-sm font-medium text-success">+{r.ROI_change}% ROI</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 MarketPulse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
