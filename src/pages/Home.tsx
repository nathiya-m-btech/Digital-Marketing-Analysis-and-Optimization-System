import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Target, TrendingUp, Zap } from 'lucide-react';
import { reviews } from '@/data/mockData';

const features = [
  { icon: BarChart3, title: 'Multi-Platform Analytics', desc: 'Track campaigns across Instagram, Google Ads, YouTube, Facebook, Twitter/X, and LinkedIn.' },
  { icon: TrendingUp, title: 'ROI Optimization', desc: 'Calculate and simulate ROI with real-time data and seasonal insights.' },
  { icon: Target, title: 'Campaign Intelligence', desc: 'Manage campaigns with smart filters by platform, season, and product.' },
  { icon: Zap, title: 'Real-time Notifications', desc: 'Get instant updates on campaign performance and survey responses.' },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            🚀 Digital Marketing Intelligence Platform
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Supercharge Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Marketing ROI</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Track, analyze, and optimize campaigns across 6 platforms. Real-time dashboards, seasonal insights, and intelligent ROI simulation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 text-base">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="px-8 text-base">
                View Demo
              </Button>
            </Link>
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

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map(r => (
              <div key={r._id} className="bg-card rounded-xl p-6 border border-border">
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
