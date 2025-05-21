'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface AuthRequiredProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AuthRequired({ children, redirectTo }: AuthRequiredProps) {
  const { user, isLoading, signIn } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Only redirect if redirectTo is specified and there's no user
    if (!isLoading && !user && redirectTo) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aixblue-600"></div>
      </div>
    );
  }
  
  // If not authenticated, show sign-in message
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            This feature requires a Google account to access your personal data and saved prompts.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <button
              onClick={signIn}
              className="px-4 py-2 rounded-md bg-aixblue-600 text-white font-medium hover:bg-aixblue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aixblue-500"
            >
              Sign In with Google
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aixblue-500"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // If authenticated, render children
  return <>{children}</>;
} 