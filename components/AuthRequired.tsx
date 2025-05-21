'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/nextauth';

interface AuthRequiredProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AuthRequired({ children, redirectTo = '/auth/signin' }: AuthRequiredProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after the auth check is complete and user is not authenticated
    if (!isLoading && !user) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, isLoading, router, redirectTo]);

  // Show nothing while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aixblue-600"></div>
      </div>
    );
  }

  // If not authenticated, show nothing (redirect happens via useEffect)
  if (!user) {
    return null;
  }

  // If authenticated, show children
  return <>{children}</>;
} 