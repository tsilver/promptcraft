'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AIxLayout from '@/components/AIxLayout';

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const user = session?.user || null;
  const router = useRouter();

  // Redirect authenticated users to the PromptCraft Analyzer page
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/promptcraft-analyzer');
    }
  }, [user, isLoading, router]);

  // If still loading or user is authenticated, show a loading state
  if (isLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aixblue-600"></div>
      </div>
    );
  }

  return (
    <AIxLayout
      title="AI PromptCraft Analyzer"
      subtitle="Tools for educators to evaluate and improve AI prompts for education"
    >
      {/* Hero Section with CTA */}
      <div className="py-12">
        <div className="grid grid-cols-1 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Democratizing AI in Education
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              AIxPromptCraft brings together educators, researchers, and AI experts to build 
              AI prompt engineering solutions for education.
            </p>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4 text-aixblue-800">Craft and Analyze Your AI Prompts</h3>
              <p className="text-gray-600 mb-6">
                Enter your prompt below to evaluate its effectiveness, test it with an AI model, 
                and get suggestions for improvement.
              </p>
              
              {/* Mock Prompt Input */}
              <div className="mb-4">
                <div className="relative">
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-4 min-h-[150px] bg-gray-50 text-gray-400"
                    placeholder="Enter your prompt here..."
                    disabled
                  ></textarea>
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 rounded-lg">
                    <div className="text-center p-4">
                      <p className="text-aixblue-700 font-medium mb-3">
                        Sign in to access the full PromptCraft Analyzer
                      </p>
                      <button
                        onClick={() => router.push('/auth/signin')}
                        className="px-5 py-2 bg-aixblue-600 text-white font-medium rounded-md hover:bg-aixblue-700 transition-colors"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Demo Version</span>
                <Link href="/example-prompts" className="text-aixblue-600 hover:text-aixblue-800">
                  View example prompts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Approach</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-aixblue-100 rounded-full flex items-center justify-center text-aixblue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Learn Prompt Engineering</h3>
            <p className="text-gray-600">
              Explore our resources to improve your prompt writing skills and AI literacy.
            </p>
            <Link 
              href="/resources"
              className="mt-4 text-aixblue-600 hover:text-aixblue-800 font-medium"
            >
              View Resources →
            </Link>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-aixblue-100 rounded-full flex items-center justify-center text-aixblue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Your Saved Prompts</h3>
            <p className="text-gray-600">
              Access, edit, and reuse your previously saved prompts for educational contexts.
            </p>
            <button 
              onClick={() => router.push('/auth/signin')}
              className="mt-4 text-aixblue-600 hover:text-aixblue-800 font-medium"
            >
              Sign In to View →
            </button>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-aixblue-100 rounded-full flex items-center justify-center text-aixblue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Prompt Templates</h3>
            <p className="text-gray-600">
              Get started with pre-built effective prompt templates for education.
            </p>
            <Link 
              href="/example-prompts" 
              className="mt-4 text-aixblue-600 hover:text-aixblue-800 font-medium"
            >
              Browse Templates →
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Educators Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600 italic mb-4">
              "AIxPromptCraft's tools provided our teachers with practical AI prompt strategies that transformed our classroom engagement and technology integration."
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-aixblue-100 text-aixblue-600 flex items-center justify-center font-bold">
                MG
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Dr. Maria Garcia</p>
                <p className="text-sm text-gray-500">Principal, Jefferson High School</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600 italic mb-4">
              "The prompt evaluation feature was eye-opening. I now have systematic approaches to generate more accurate and reliable AI outputs for my curriculum development."
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-aixblue-100 text-aixblue-600 flex items-center justify-center font-bold">
                JW
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">Prof. James Wilson</p>
                <p className="text-sm text-gray-500">Computer Science Department, Stanford University</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AIxLayout>
  );
} 