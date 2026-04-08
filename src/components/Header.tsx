import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { notifications } from '@/data/mockData';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/campaigns', label: 'Campaigns' },
  { path: '/roi-simulator', label: 'ROI Simulator' },
  { path: '/platform-comparison', label: 'Platforms' },
  { path: '/surveys', label: 'Surveys' },
  { path: '/about', label: 'About' },
];

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter(n => !n.read_status).length;

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">M</div>
          MarketPulse
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
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
                    <p className="text-sm font-semibold mb-2">Notifications</p>
                    {notifications.slice(0, 5).map(n => (
                      <div key={n._id} className={`p-2 rounded-lg text-xs ${n.read_status ? 'text-muted-foreground' : 'bg-primary/5 text-foreground font-medium'}`}>
                        {n.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {user?.name.charAt(0)}
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

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-card p-4 space-y-1 animate-slide-up">
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
