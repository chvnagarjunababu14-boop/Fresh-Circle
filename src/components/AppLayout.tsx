import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import { useAppStore } from '@/lib/store';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const user = useAppStore((s) => s.currentUser);

  return (
    <div className="min-h-screen bg-background">
      <main className={user ? 'pb-24' : ''}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
