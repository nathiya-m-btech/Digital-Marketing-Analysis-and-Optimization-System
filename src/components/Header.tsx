import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, LogOut, Menu, X, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { notifications as initialNotifs } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import type { Notification } from '@/types';
import logoImg from '@/assets/marketpulse-logo.png';

const publicNavItems = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/campaigns', label: 'Campaigns' },
  { path: '/roi-simulator', label: 'ROI Simulator' },
  { path: '/platform-comparison', label: 'Platforms' },
  { path: '/surveys', label: 'Surveys' },
  { path: '/seasonal-insights', label: 'Seasons' },
  { path: '/product-portfolio', label: 'Products' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifs);

  const unread = notifs.filter(n => !n.read_status).length;

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read_status: true })));
  };

  const navItems = isAuthenticated
    ? [...publicNavItems, { path: '/profile', label: 'Settings' }]
    : publicNavItems;

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoImg} alt="MarketPulse" className="w-9 h-9 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            MarketPulse
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">{unread}</span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-xl p-3 space-y-2 animate-slide-up">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold">Notifications</p>
                      {unread > 0 && (
                        <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                    </div>
                    {notifs.slice(0, 5).map(n => (
                      <div key={n._id} className={`p-2 rounded-lg text-xs ${n.read_status ? 'text-muted-foreground' : 'bg-primary/5 text-foreground font-medium'}`}>
                        {n.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold overflow-hidden">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name.charAt(0)
                  )}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </Link>
              <button onClick={logout} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/login"><Button size="sm">Sign Up</Button></Link>
            </div>
          )}

          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-card p-4 space-y-1 animate-slide-up">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                location.pathname === item.path ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
