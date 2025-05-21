'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import AIxLayout from '@/components/AIxLayout';

export default function SignInPage() {
  const { user, signIn, isLoading } = useAuth();
  const router = useRouter();
  
  // Redirect authenticated users to the analyzer page
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/promptcraft-analyzer');
    }
  }, [user, isLoading, router]);
  
  // Auto-trigger sign in
  useEffect(() => {
    if (!user && !isLoading) {
      signIn();
    }
  }, [user, isLoading, signIn]);
  
  return (
    <AIxLayout
      title="Sign In"
      subtitle="Sign in to access the PromptCraft Analyzer"
    >
      <div className="flex items-center justify-center py-12">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aixblue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Redirecting to Sign In</h2>
          <p className="text-gray-600 mb-6">
            You're being redirected to the authentication provider. If nothing happens, click the button below.
          </p>
          <button
            onClick={signIn}
            className="px-6 py-3 bg-aixblue-600 text-white font-medium rounded-md hover:bg-aixblue-700 transition-colors"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    </AIxLayout>
  );
} 