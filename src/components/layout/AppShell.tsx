'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { StudyProvider } from '@/lib/study-context';
import Sidebar from './Sidebar';
import StudyPanel from '@/components/ui/StudyPanel';
import SimulazionePanel from '@/components/ui/SimulazionePanel';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, isDemo } = useAuth();

  const isLoginPage = pathname === '/login';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isDemo && !user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Reindirizzamento al login...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 min-w-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-16 pb-8 lg:pt-8">
          {children}
        </div>
      </main>
      <StudyPanel />
      <SimulazionePanel />
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StudyProvider>
        <AuthGuard>{children}</AuthGuard>
      </StudyProvider>
    </AuthProvider>
  );
}
