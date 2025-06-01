import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import aixLongFormLogo from '@/images/Aix_darklogoLongForm.png';
import FeedbackButton from './FeedbackButton';
import type { Session } from 'next-auth';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  sessionData?: Session;
};

const Layout: React.FC<LayoutProps> = ({ children, title = 'Prompting for Educators', sessionData }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };
  
  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{`${title} | AIxponential`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header based on AIxponential design */}
      <header className="bg-[#140e26] text-white fixed top-0 w-full z-50 shadow-md">
        <div className="container mx-auto py-2 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-[60px] w-[180px] relative">
                <Image
                  src={aixLongFormLogo}
                  alt="AIxponential Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <div className="ml-3 pl-3 border-l border-white/20 hidden sm:block">
              <span className="text-white/80 text-xs">presents:</span>
              <h2 className="text-white font-semibold text-lg leading-tight">Prompting for Educators</h2>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/course" className="text-white font-medium hover:text-white/80 transition-colors py-2">
              Course
            </Link>
            
            <div className="relative group">
              <button 
                className="text-white/90 hover:text-white transition-colors flex items-center py-2"
                onClick={() => toggleDropdown('resources')}
              >
                Resources
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div className={`absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden transition-all duration-300 ${activeDropdown === 'resources' ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'} origin-top`}>
                <div className="py-2">
                  <Link href="/resources" className="block px-4 py-2 text-[#1A202C] hover:bg-[#EDF2F7]" onClick={closeDropdown}>
                    All Resources
                  </Link>
                  <Link href="/resources/prompt-library" className="block px-4 py-2 text-[#1A202C] hover:bg-[#EDF2F7]" onClick={closeDropdown}>
                    Prompt Library
                  </Link>
                  <Link href="/resources/glossary" className="block px-4 py-2 text-[#1A202C] hover:bg-[#EDF2F7]" onClick={closeDropdown}>
                    Glossary
                  </Link>
                </div>
              </div>
            </div>
            
            <Link href="/about" className="text-white/90 hover:text-white transition-colors py-2">
              About
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <FeedbackButton sessionData={sessionData} />
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-[#140e26]`}>
          <div className="px-4 pt-2 pb-4 space-y-1">
            <div className="py-2 px-2 mb-2 border-b border-white/20">
              <span className="text-white/80 text-xs">Course:</span>
              <h2 className="text-white font-semibold text-lg">Prompting for Educators</h2>
            </div>
            <Link href="/course" className="block py-2 text-white hover:text-white/80" onClick={() => setMobileMenuOpen(false)}>
              Course
            </Link>
            <Link href="/resources" className="block py-2 text-white hover:text-white/80" onClick={() => setMobileMenuOpen(false)}>
              Resources
            </Link>
            <Link href="/about" className="block py-2 text-white hover:text-white/80" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <div className="py-2">
              <FeedbackButton sessionData={sessionData} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {children}
      </main>

      {/* Footer based on AIxponential design */}
      <footer className="bg-[#140e26] text-white py-8">
        <div className="container mx-auto px-4">
          {/* Logo and mission statement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center justify-center md:justify-start">
              <div className="h-[60px] w-[180px] relative">
                <Image
                  src={aixLongFormLogo}
                  alt="AIxponential Logo"
                  fill
                  className="object-contain"
                />
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <h3 className="text-base font-semibold mb-2 text-white">Course</h3>
              <ul className="space-y-1">
                <li><Link href="/course" className="text-white/80 hover:text-white transition">Course Home</Link></li>
                <li><Link href="/course/pre-assessment" className="text-white/80 hover:text-white transition">Assessment</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-2 text-white">Resources</h3>
              <ul className="space-y-1">
                <li><Link href="/resources" className="text-white/80 hover:text-white transition">All Resources</Link></li>
                <li><Link href="/resources/prompt-library" className="text-white/80 hover:text-white transition">Prompt Library</Link></li>
                <li><Link href="/resources/glossary" className="text-white/80 hover:text-white transition">Glossary</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-2 text-white">Contact</h3>
              <ul className="space-y-1">
                <li><a href="https://aixponential.org" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition">AIxponential</a></li>
                <li><a href="mailto:info@aixponential.org" className="text-white/80 hover:text-white transition">info@aixponential.org</a></li>
                <li>
                  <div className="flex space-x-3 mt-2">
                    <a href="https://twitter.com/aixponential" className="text-white/80 hover:text-white transition" aria-label="Twitter">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                    <a href="https://linkedin.com/company/aixponential" className="text-white/80 hover:text-white transition" aria-label="LinkedIn">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                      </svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/20 text-center text-white/70 text-xs">
            <p>© {new Date().getFullYear()} AIxponential. All rights reserved.</p>
            <p className="text-white/70 text-xs mt-1">
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
};

export default Layout; 