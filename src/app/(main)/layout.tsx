// src/app/(main)/layout.tsx

import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#141810]">
      {children}
    </div>
  );
}
