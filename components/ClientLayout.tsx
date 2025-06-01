'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { EventTrackingProvider } from '@/lib/tracking/hooks';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <EventTrackingProvider>
        {children}
      </EventTrackingProvider>
    </SessionProvider>
  );
} 