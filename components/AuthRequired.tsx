'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

interface AuthRequiredProps {
  children: ReactNode;
}

export default function AuthRequired({ children }: AuthRequiredProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If auth is loaded and there's no user, redirect to home
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // If not authenticated, show sign-in message
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be signed in to access this page. Please sign in to continue.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }
  
  // If authenticated, render children
  return <>{children}</>;
} 