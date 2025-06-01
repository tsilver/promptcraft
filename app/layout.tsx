import './globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { EventTrackingProvider } from '@/lib/tracking/hooks';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI PromptCraft Analyzer',
  description: 'Analyze, evaluate, and improve your AI prompts for education',
};

import ClientLayout from '@/components/ClientLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 