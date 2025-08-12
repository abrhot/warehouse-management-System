// src/app/(main)/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Sidebar } from '@/components/layout/Sidebar'; // <-- Import your Sidebar component
import { redirect } from 'next/navigation';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    // If there is no session, redirect to the login page
    redirect('/login');
  }

  const user = {
    role: session.user?.role || 'USER',
    name: session.user?.name || '',
    email: session.user?.email || '',
    // Add other user properties you need
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-slate-900 text-slate-50 border-r border-slate-700">
        <Sidebar user={user} />
      </div>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}