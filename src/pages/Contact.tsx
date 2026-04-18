import { Mail, Phone, MapPin } from 'lucide-react';

const commonContact = {
  phone: '+91 8428625309',
  email: 'support@marketpulse.in',
  address: '123 Marketing Avenue, Chennai, Tamil Nadu 600001',
};

const teamContacts = [
  { name: 'Nathiya Marutharaj', role: 'CEO & Founder', email: 'nathiya.m@marketpulse.in', phone: '+91 8428625309' },
  { name: 'Navethasri RM', role: 'Head of Product', email: 'navethasri.rm@gmail.com', phone: '+91 9642578130' },
  { name: 'Roshanbegum J', role: 'Lead Engineer', email: 'roshanbegum.j@gmail.com', phone: '+91 9451267830' },
  { name: 'Monisha D', role: 'Marketing Director', email: 'monisha.d@gmail.com', phone: '+91 8635479201' },
];

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">Get in touch with our team. We're here to help you succeed.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold mb-1">Phone</h3>
          <p className="text-sm text-muted-foreground">{commonContact.phone}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold mb-1">Email</h3>
          <p className="text-sm text-muted-foreground">{commonContact.email}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold mb-1">Address</h3>
          <p className="text-sm text-muted-foreground">{commonContact.address}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-center mb-8">Team Directory</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {teamContacts.map((t, i) => (
            <div key={t.name} className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
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
