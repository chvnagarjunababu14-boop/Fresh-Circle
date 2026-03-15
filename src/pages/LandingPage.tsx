import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, UtensilsCrossed, Truck, Warehouse, Leaf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LandingPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();

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
        {profile && (
          <p className="text-sm text-muted-foreground mt-1">
            Logged in as <span className="font-bold text-primary">{profile.role}</span>
          </p>
        )}
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        {profile?.role === 'vendor' && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/vendor/dashboard')} className="btn-fresh w-full justify-start">
            <Store size={32} />
            <div className="text-left">
              <div className="text-xl font-bold">Vendor Dashboard</div>
              <div className="text-sm opacity-80 font-medium">Manage your stock</div>
            </div>
          </motion.button>
        )}
        {profile?.role === 'buyer' && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/buyer/dashboard')} className="btn-fresh w-full justify-start">
            <UtensilsCrossed size={32} />
            <div className="text-left">
              <div className="text-xl font-bold">Buyer Dashboard</div>
              <div className="text-sm opacity-80 font-medium">Post requirements</div>
            </div>
          </motion.button>
        )}
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/profile')} className="card-surface flex items-center gap-3 min-h-[64px] px-4 w-full cursor-pointer">
          <div className="text-left">
            <div className="text-lg font-bold text-foreground">My Profile</div>
            <div className="text-sm text-muted-foreground font-medium">Update location & info</div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
