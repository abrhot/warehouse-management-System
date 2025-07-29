import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      {/* Optional: header/sidebar */}
      {children}
    </main>
  );
}
