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
  
  // Debug logging for client-side session
  console.log('🔍 CLIENT: useAuth session data:', session);
  console.log('🔍 CLIENT: useAuth user:', user);
  console.log('🔍 CLIENT: useAuth user roles:', user?.roles);
  console.log('🔍 CLIENT: useAuth status:', status);
  
  const signIn = async (callbackUrl = '/promptcraft-analyzer') => {
    await nextAuthSignIn('google', { callbackUrl });
  };
  
  const signOut = async () => {
    await nextAuthSignOut({ callbackUrl: '/' });
  };
  
  return { user, isLoading, signIn, signOut };
} 