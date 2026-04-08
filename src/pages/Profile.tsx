import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Camera, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [previewImage, setPreviewImage] = useState<string | undefined>(user?.profile_image);

  // Sync state when user changes
  if (user && name === '' && email === '') {
    // Initial load
  }

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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({
      name: name || user.name,
      email: email || user.email,
      profile_image: previewImage,
    });
    toast({
      title: 'Profile updated',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in max-w-2xl">
      <h1 className="font-display text-3xl font-bold mb-8">Profile</h1>

      <div className="bg-card border border-border rounded-xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden">
              {previewImage ? (
                <img src={previewImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{name || user.name}</h2>
            <p className="text-muted-foreground">{user.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2"><User className="w-4 h-4" /> Full Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={user.name}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={user.email}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="flex items-center gap-2"><Shield className="w-4 h-4" /> Role</Label>
            <Input value={user.role} disabled className="mt-1" />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button onClick={handleSave} className="gradient-primary text-primary-foreground border-0">
            <Check className="w-4 h-4 mr-1" /> Save Changes
          </Button>
          <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
        </div>
      </div>
    </div>
  );
}
