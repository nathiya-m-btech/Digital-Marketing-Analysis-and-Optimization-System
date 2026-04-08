import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Target, TrendingUp, Zap } from 'lucide-react';
import { reviews } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import heroDashboard from '@/assets/hero-dashboard.jpg';

const features = [
  { icon: BarChart3, title: 'Multi-Platform Analytics', desc: 'Track campaigns across Instagram, Google Ads, YouTube, Facebook, Twitter/X, and LinkedIn.' },
  { icon: TrendingUp, title: 'ROI Optimization', desc: 'Calculate and simulate ROI with real-time data and seasonal insights.' },
  { icon: Target, title: 'Campaign Intelligence', desc: 'Manage campaigns with smart filters by platform, season, and product.' },
  { icon: Zap, title: 'Real-time Notifications', desc: 'Get instant updates on campaign performance and survey responses.' },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10" />
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

            {/* Hero Image */}
            <div className="flex-1 relative animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 gradient-primary rounded-3xl blur-2xl opacity-20 animate-float" />
                <img
                  src={heroDashboard}
                  alt="MarketPulse Analytics Dashboard"
                  className="relative rounded-3xl shadow-2xl border border-border/50 hover:scale-[1.02] transition-transform duration-500"
                  width={1280}
                  height={720}
                />
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

      {/* Quick Links */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-4">Explore More</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">Dive deeper into seasonal trends and product performance.</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/seasonal-insights" className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning to-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Seasonal Insights</h3>
              <p className="text-sm text-muted-foreground">Explore how seasons shape marketing performance and product demand.</p>
            </Link>
            <Link to="/product-portfolio" className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Product Portfolio</h3>
              <p className="text-sm text-muted-foreground">View product lineup with performance metrics and campaign links.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
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
