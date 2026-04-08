import { BarChart3, Users, Globe, Shield } from 'lucide-react';

const team = [
  { name: 'Alex Morgan', role: 'CEO & Founder' },
  { name: 'Sarah Johnson', role: 'Head of Product' },
  { name: 'Mike Chen', role: 'Lead Engineer' },
];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="font-display text-4xl font-bold mb-4">About MarketPulse</h1>
        <p className="text-lg text-muted-foreground">
          MarketPulse is a comprehensive digital marketing intelligence platform that helps businesses track, analyze, and optimize their marketing campaigns across multiple platforms.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { icon: BarChart3, label: 'Analytics', desc: '6 platform integrations' },
          { icon: Users, label: 'Users', desc: '10K+ active marketers' },
          { icon: Globe, label: 'Global', desc: 'Used in 50+ countries' },
          { icon: Shield, label: 'Secure', desc: 'Enterprise-grade security' },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
            <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-display font-semibold">{item.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {team.map(t => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl">
                {t.name.charAt(0)}
              </div>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
