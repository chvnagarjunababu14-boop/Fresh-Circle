import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, UtensilsCrossed, Truck, Warehouse, Leaf } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { useAppStore } from '@/lib/store';

const roles: { role: UserRole; label: string; icon: typeof Store; desc: string }[] = [
  { role: 'vendor', label: 'Vendor', icon: Store, desc: 'Sell fresh produce' },
  { role: 'buyer', label: 'Buyer', icon: UtensilsCrossed, desc: 'Restaurant / Hotel' },
  { role: 'logistics', label: 'Logistics', icon: Truck, desc: 'Deliver goods' },
  { role: 'storage', label: 'Cold Storage', icon: Warehouse, desc: 'Store surplus' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);

  const selectRole = (role: UserRole) => {
    setCurrentUser({
      id: `user-${role}`,
      email: `${role}@demo.app`,
      role,
      business_name: `Demo ${role}`,
      lat: 12.9716,
      lng: 77.5946,
    });
    navigate(role === 'vendor' ? '/vendor/dashboard' : '/buyer/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <Leaf size={32} className="text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          FreshLink
        </h1>
        <p className="text-lg font-medium text-muted-foreground mt-2">
          Hyperlocal Produce · Zero Waste
        </p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        <p className="text-kiosk-sm text-center">I am a...</p>
        {roles.map(({ role, label, icon: Icon, desc }, i) => (
          <motion.button
            key={role}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => selectRole(role)}
            className="btn-fresh w-full justify-start"
          >
            <Icon size={32} />
            <div className="text-left">
              <div className="text-xl font-bold">{label}</div>
              <div className="text-sm opacity-80 font-medium">{desc}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
