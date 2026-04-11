import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Camera, Check, ZoomIn, ZoomOut, RotateCcw, Bell, Globe, Lock, Palette } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [timezone, setTimezone] = useState('UTC-8 (Pacific)');
  const [language, setLanguage] = useState('English');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | undefined>(user?.profile_image);
  const [rawImage, setRawImage] = useState<HTMLImageElement | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const drawCanvas = useCallback((img: HTMLImageElement, s: number, ox: number, oy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
    const w = img.width * s;
    const h = img.height * s;
    const x = (size - w) / 2 + ox;
    const y = (size - h) / 2 + oy;
    ctx.drawImage(img, x, y, w, h);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <h1 className="font-display text-2xl font-bold mb-4">Please sign in</h1>
        <Button onClick={() => navigate('/login')} className="gradient-primary text-primary-foreground border-0">Go to Login</Button>
      </div>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        setRawImage(img);
        const initScale = 200 / Math.min(img.width, img.height);
        setScale(initScale);
        setOffsetX(0);
        setOffsetY(0);
        setShowEditor(true);
        setTimeout(() => drawCanvas(img, initScale, 0, 0), 50);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const updateCanvas = (newScale: number, newOx: number, newOy: number) => {
    setScale(newScale);
    setOffsetX(newOx);
    setOffsetY(newOy);
    if (rawImage) drawCanvas(rawImage, newScale, newOx, newOy);
  };

  const applyImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setPreviewImage(canvas.toDataURL('image/jpeg', 0.9));
    setShowEditor(false);
    setRawImage(null);
  };

  const handleSave = () => {
    updateProfile({
      name: name || user.name,
      email: email || user.email,
      profile_image: previewImage,
    });
    toast({ title: 'Settings saved', description: 'All your changes have been saved successfully.' });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">Settings</h1>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Profile</h2>
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden">
              {previewImage ? (
                <img src={previewImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold">{name || user.name}</h3>
            <p className="text-muted-foreground text-sm">{user.role}</p>
          </div>
        </div>

        {showEditor && (
          <div className="mb-6 bg-muted/50 border border-border rounded-xl p-6 animate-slide-up">
            <p className="text-sm font-semibold mb-4">Resize & Position Photo</p>
            <div className="flex flex-col items-center gap-4">
              <div className="relative bg-muted rounded-full overflow-hidden" style={{ width: 200, height: 200 }}>
                <canvas ref={canvasRef} width={200} height={200} className="w-full h-full" />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => updateCanvas(Math.max(scale * 0.8, 0.05), offsetX, offsetY)} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"><ZoomOut className="w-4 h-4" /></button>
                <input type="range" min={0.05} max={3} step={0.01} value={scale} onChange={e => updateCanvas(Number(e.target.value), offsetX, offsetY)} className="w-40 accent-primary" />
                <button onClick={() => updateCanvas(Math.min(scale * 1.25, 3), offsetX, offsetY)} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"><ZoomIn className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">X:</span><input type="range" min={-200} max={200} value={offsetX} onChange={e => updateCanvas(scale, Number(e.target.value), offsetY)} className="w-24 accent-primary" /></div>
                <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Y:</span><input type="range" min={-200} max={200} value={offsetY} onChange={e => updateCanvas(scale, offsetX, Number(e.target.value))} className="w-24 accent-primary" /></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={applyImage} className="gradient-primary text-primary-foreground border-0"><Check className="w-4 h-4 mr-1" /> Apply</Button>
                <Button size="sm" variant="outline" onClick={() => { if (rawImage) { const s = 200 / Math.min(rawImage.width, rawImage.height); updateCanvas(s, 0, 0); } }}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowEditor(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2"><User className="w-4 h-4" /> Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder={user.name} className="mt-1" />
          </div>
          <div>
            <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder={user.email} className="mt-1" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="mt-1" />
          </div>
          <div>
            <Label>Company</Label>
            <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company name" className="mt-1" />
          </div>
          <div>
            <Label className="flex items-center gap-2"><Shield className="w-4 h-4" /> Role</Label>
            <Input value={user.role} disabled className="mt-1" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Preferences</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Timezone</Label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option>UTC-8 (Pacific)</option>
              <option>UTC-5 (Eastern)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+5:30 (IST)</option>
              <option>UTC+8 (SGT)</option>
            </select>
          </div>
          <div>
            <Label>Language</Label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Notifications</h2>
        <div className="space-y-3">
          {[
            { label: 'Email Notifications', desc: 'Receive campaign updates via email', value: emailNotifs, set: setEmailNotifs },
            { label: 'Push Notifications', desc: 'Browser push notifications for alerts', value: pushNotifs, set: setPushNotifs },
            { label: 'Weekly Report', desc: 'Get a weekly performance summary', value: weeklyReport, set: setWeeklyReport },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => item.set(!item.value)}
                className={`w-11 h-6 rounded-full transition-colors relative ${item.value ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${item.value ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="gradient-primary text-primary-foreground border-0">
          <Check className="w-4 h-4 mr-1" /> Save Changes
        </Button>
        <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
      </div>
    </div>
  );
}
