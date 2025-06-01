'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/nextauth';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();

  return (
    <div className="md:hidden">
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-aixblue-600 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          )}
        </svg>
      </button>

      {/* Mobile Menu - Removed PromptCraft Analyzer and Test Gemini */}
      {isOpen && (
        <div className="absolute top-16 inset-x-0 z-50 bg-white shadow-lg border-b border-gray-200 py-3">
          <div className="px-4 space-y-3">
            <Link 
              href="/"
              className="block py-2 text-gray-700 hover:text-aixblue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/example-prompts"
              className="block py-2 text-gray-700 hover:text-aixblue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Examples
            </Link>
            <Link 
              href="/my-prompts"
              className="block py-2 text-gray-700 hover:text-aixblue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              My Prompts
            </Link>
            <Link 
              href="/resources"
              className="block py-2 text-gray-700 hover:text-aixblue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Resources
            </Link>
            
            {/* Auth Button */}
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{user.name || user.email}</p>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium rounded-md text-aixblue-600 border border-aixblue-600 hover:bg-aixblue-50 transition duration-150"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm font-medium rounded-md bg-aixblue-600 text-white hover:bg-aixblue-700 transition duration-150"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 