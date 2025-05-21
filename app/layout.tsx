import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth';
import { EventTrackingProvider } from '@/lib/tracking/hooks';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI PromptCraft Analyzer',
  description: 'Analyze, evaluate, and improve your AI prompts for education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <EventTrackingProvider>
            {children}
          </EventTrackingProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 