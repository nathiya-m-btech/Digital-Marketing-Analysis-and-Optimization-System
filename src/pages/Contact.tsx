import { Mail, Phone, MapPin, User } from 'lucide-react';

const commonContact = {
  phone: '+1 (800) 555-0199',
  email: 'support@marketpulse.io',
  address: '123 Marketing Ave, San Francisco, CA 94102',
};

const teamContacts = [
  { name: 'Sarah Johnson', role: 'Head of Product', email: 'sarah.johnson@marketpulse.io', phone: '+1 (800) 555-0102' },
  { name: 'Mike Chen', role: 'Lead Engineer', email: 'mike.chen@marketpulse.io', phone: '+1 (800) 555-0103' },
  { name: 'Emily Davis', role: 'Marketing Director', email: 'emily.davis@marketpulse.io', phone: '+1 (800) 555-0104' },
  { name: 'James Wilson', role: 'Customer Success Lead', email: 'james.wilson@marketpulse.io', phone: '+1 (800) 555-0105' },
];

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">Get in touch with our team. We're here to help you succeed.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold mb-1">Phone</h3>
          <p className="text-sm text-muted-foreground">{commonContact.phone}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold mb-1">Email</h3>
          <p className="text-sm text-muted-foreground">{commonContact.email}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold mb-1">Address</h3>
          <p className="text-sm text-muted-foreground">{commonContact.address}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-center mb-8">Team Directory</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamContacts.map(t => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{t.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
