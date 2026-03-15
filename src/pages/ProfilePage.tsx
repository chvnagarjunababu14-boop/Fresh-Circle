import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { profile, signOut, refreshProfile } = useAuth();
  const { lat, lng, loading: geoLoading, requestLocation } = useGeolocation();
  const [businessName, setBusinessName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setBusinessName(profile.business_name);
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        business_name: businessName,
        lat: lat ?? profile.lat,
        lng: lng ?? profile.lng,
      })
      .eq('id', profile.id);
    if (error) toast.error(error.message);
    else {
      toast.success('Profile updated!');
      await refreshProfile();
    }
    setSaving(false);
  };

  if (!profile) return null;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-kiosk mb-6">Profile</h1>

      <div className="card-surface space-y-4 mb-6">
        <div>
          <label className="text-sm font-bold text-muted-foreground mb-2 block">Email / Phone</label>
          <p className="text-kiosk-sm">{profile.email || profile.phone || '—'}</p>
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground mb-2 block">Role</label>
          <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">
            {profile.role}
          </span>
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground mb-2 block">Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full min-h-[56px] rounded-xl border border-border bg-background px-4 text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-muted-foreground mb-2 block">Location</label>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground flex-1">
              {profile.lat && profile.lng
                ? `${profile.lat.toFixed(4)}, ${profile.lng.toFixed(4)}`
                : 'Not set'}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={requestLocation}
              disabled={geoLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm font-bold text-foreground"
            >
              <MapPin size={16} />
              {geoLoading ? 'Getting...' : 'Update'}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="btn-fresh w-full"
        >
          <Save size={24} />
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={signOut}
          className="btn-kiosk w-full bg-destructive text-destructive-foreground"
        >
          <LogOut size={24} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
}
