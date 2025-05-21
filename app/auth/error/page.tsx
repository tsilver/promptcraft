'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AIxLayout from '@/components/AIxLayout';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  
  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.';
      case 'AccessDenied':
        return 'Access was denied to this resource.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'OAuthAccountNotLinked':
      case 'Callback':
      case 'OAuthSignin':
        return 'There was a problem with the authentication service. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <div className="my-12 max-w-3xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/auth/signin"
            className="inline-block px-6 py-2 bg-aixblue-600 text-white font-medium rounded-md hover:bg-aixblue-700 transition-colors"
          >
            Try Again
          </Link>
          
          <div>
            <Link 
              href="/"
              className="text-aixblue-600 hover:text-aixblue-700 font-medium"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <AIxLayout title="Authentication Error" subtitle="There was a problem signing you in">
      <Suspense fallback={<div className="my-12 max-w-3xl mx-auto px-4 text-center">Loading...</div>}>
        <AuthErrorContent />
      </Suspense>
    </AIxLayout>
  );
} 