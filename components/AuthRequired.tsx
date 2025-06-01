'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface AuthRequiredProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AuthRequired({ children, redirectTo = '/auth/signin' }: AuthRequiredProps) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const user = session?.user || null;
  const router = useRouter();

  useEffect(() => {
    // Only redirect after the auth check is complete and user is not authenticated
    if (!isLoading && !user) {
      // Add the current URL as a callback parameter so the user can be redirected back after login
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`${redirectTo}${redirectTo.includes('?') ? '&' : '?'}callbackUrl=${callbackUrl}`);
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