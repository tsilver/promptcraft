'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/lib/auth';
import { EventTrackingProvider } from '@/lib/tracking/hooks';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <EventTrackingProvider>
          {children}
        </EventTrackingProvider>
      </AuthProvider>
    </SessionProvider>
  );
} 