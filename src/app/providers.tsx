'use client'; // This component MUST be a Client Component

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // This component's only job is to provide the session context to your app
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}