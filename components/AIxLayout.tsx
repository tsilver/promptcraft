'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/nextauth';
import MobileNav from './MobileNav';

interface AIxLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AIxLayout({ children, title, subtitle }: AIxLayoutProps) {
  const { user, signIn, signOut, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-[#140e26] text-white fixed top-0 w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/brand/Aix_darklogoLongForm.png"
                  alt="AIxPromptCraft Logo"
                  width={120}
                  height={120}
                  className="w-auto"
                />
                <span className="ml-2 text-xl font-semibold text-gray-900 sm:hidden">
                  AIxPromptCraft
                </span>
              </Link>
            </div>

            {/* Main Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-aixblue-600 font-medium transition duration-150">
                Home
              </Link>
              {user && (
                <Link href="/promptcraft-analyzer" className="text-white hover:text-aixblue-600 font-medium transition duration-150">
                  PromptCraft Analyzer
                </Link>
              )}
              <Link href="/example-prompts" className="text-white hover:text-aixblue-600 font-medium transition duration-150">
                Examples
              </Link>
              <Link href="/example-prompts/test-gemini" className="text-white hover:text-aixblue-600 font-medium transition duration-150">
                Test Gemini
              </Link>
              <Link href="/my-prompts" className="text-white hover:text-aixblue-600 font-medium transition duration-150">
                My Prompts
              </Link>
              <Link href="/resources" className="text-white hover:text-aixblue-600 font-medium transition duration-150">
                Resources
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <MobileNav />

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center">
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  {user.image && (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={user.image}
                        alt="User profile"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <button
                    onClick={signOut}
                    className="px-4 py-2 rounded-md bg-white text-aixblue-600 border border-aixblue-600 hover:bg-aixblue-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={signIn}
                  className="px-4 py-2 rounded-md bg-aixblue-600 text-white hover:bg-aixblue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="h-20"></div>
      {/* Page Title Section */}
      {(title || subtitle) && (

        <div className="bg-aixblue-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {title && <h1 className="text-3xl font-bold">{title}</h1>}
            {subtitle && <p className="mt-2 text-aixblue-100">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Image
                  src="/images/brand/Aix_darklogoLongForm.png"
                  alt="AIxPromptCraft"
                  width={200}
                  height={40}
                  className="w-auto"
                />
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                Democratizing access to AI technologies and empowering individuals to leverage AI responsibly and effectively.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Initiatives</h3>
              <ul className="space-y-2">
                <li><Link href="/resources" className="text-gray-400 hover:text-white transition duration-150">AI in Education</Link></li>
                <li><Link href="/resources" className="text-gray-400 hover:text-white transition duration-150">AI Trustworthiness</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/example-prompts" className="text-gray-400 hover:text-white transition duration-150">Prompting Course</Link></li>
                <li><Link href="/resources" className="text-gray-400 hover:text-white transition duration-150">AI Tools</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Get Involved</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition duration-150">Donate</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition duration-150">Volunteer</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition duration-150">Partnerships</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 AIxPromptCraft. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white">Terms</Link>
              <Link href="#" className="text-gray-400 hover:text-white">Privacy</Link>
              <Link href="#" className="text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 