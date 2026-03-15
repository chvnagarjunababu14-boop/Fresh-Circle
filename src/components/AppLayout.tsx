import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useAuth } from '@/hooks/useAuth';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <main className={profile ? 'pb-24' : ''}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
