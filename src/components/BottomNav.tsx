import { NavLink, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const vendorLinks = [
  { to: '/vendor/dashboard', icon: Home, label: 'Home' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const buyerLinks = [
  { to: '/buyer/dashboard', icon: Home, label: 'Home' },
  { to: '/match-results', icon: Package, label: 'Match' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { profile } = useAuth();
  const location = useLocation();

  if (!profile) return null;

  const links = profile.role === 'vendor' ? vendorLinks : buyerLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink key={to} to={to} className="touch-target flex-col gap-1 relative">
              {active && (
                <motion.div
                  layoutId="bottomnav"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={28} className={active ? 'text-primary' : 'text-muted-foreground'} />
              <span className={`text-xs font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
