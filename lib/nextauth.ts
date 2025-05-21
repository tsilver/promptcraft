'use client';

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

/**
 * A simplified hook for using NextAuth in the application
 * Provides similar interface to the existing useAuth hook
 */
export function useAuth() {
  const { data: session, status } = useSession();
  
  const isLoading = status === 'loading';
  const user = session?.user || null;
  
  const signIn = async () => {
    await nextAuthSignIn('google', { callbackUrl: '/promptcraft-analyzer' });
  };
  
  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: '/' });
  };
  
  return { user, isLoading, signIn, signOut };
} 