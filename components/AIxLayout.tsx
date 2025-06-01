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
            {/* Logo and Brand - Updated with external link */}
            <div className="flex items-center">
              <a href="https://www.aixponential.org/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Image
                  src="/images/brand/Aix_darklogoLongForm.png"
                  alt="AIxponential Logo"
                  width={120}
                  height={120}
                  className="w-auto"
                />
              </a>
            </div>

            {/* Main Navigation - Desktop - Removed Test Gemini and PromptCraft Analyzer */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-aixblue-600 font-medium transition duration-150">
                Home
              </Link>
              <Link href="/example-prompts" className="text-white hover:text-aixblue-600 font-medium transition duration-150">
                Examples
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
                  onClick={() => signIn()}
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

      {/* Footer - Updated to match AIxponential website */}
      <footer className="bg-[#140e26] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo and mission statement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center justify-center md:justify-start">
              <a href="https://www.aixponential.org/" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/images/brand/Aix_darklogoLongForm.png"
                  alt="AIxponential Logo"
                  width={180}
                  height={60}
                  className="w-auto"
                />
              </a>
            </div>
            <div className="flex flex-col justify-center">
              <blockquote className="border-l-4 border-white pl-4 italic text-white/80">
                <p className="text-lg leading-tight">
                  &quot;Democratizing access to AI technologies and empowering individuals and organizations
                  to leverage AI responsibly and effectively.&quot;
                </p>
              </blockquote>
            </div>
          </div>
          
          {/* Navigation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Initiatives</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.aixponential.org/initiatives/education" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/80 hover:text-white transition"
                  >
                    AI in Education
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.aixponential.org/initiatives/trustworthiness" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/80 hover:text-white transition"
                  >
                    AI Trustworthiness
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://prompting-course-v3.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/80 hover:text-white transition"
                  >
                    Prompting Course
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.aixponential.org/resources/podcasts" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/80 hover:text-white transition"
                  >
                    Podcast
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.aixponential.org/resources/parent-resources" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/80 hover:text-white transition"
                  >
                    AI Tools
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Get Involved</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://www.aixponential.org/get-involved" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/80 hover:text-white transition"
                  >
                    Donate
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.aixponential.org/get-involved" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/80 hover:text-white transition"
                  >
                    Volunteer
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.aixponential.org/get-involved" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white/80 hover:text-white transition"
                  >
                    Partnerships
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-white/20 text-center">
            <p className="text-white/70 text-sm">© {new Date().getFullYear()} AIxponential. All rights reserved.</p>
            <div className="mt-3 text-white/70 text-sm">
              <p>Contact:</p>
              <a 
                href="mailto:info@aixponential.org" 
                className="text-white/80 hover:text-white transition"
              >
                info@aixponential.org
              </a>
              <span className="mx-2">|</span>
              <a 
                href="https://www.aixponential.org/contact" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/80 hover:text-white transition"
              >
                Contact Form
              </a>
            </div>
            <p className="text-white/70 text-xs mt-3">
              This work is licensed under a{' '}
              <a 
                href="https://creativecommons.org/licenses/by-nc-nd/4.0/" 
                className="text-white/80 hover:text-white transition" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 