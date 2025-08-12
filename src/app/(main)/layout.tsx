import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Sidebar } from '@/components/layout/Sidebar';
import { redirect } from 'next/navigation';
import { NotificationBell } from "@/components/notifications/NotificationBell";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user = {
    role: session.user?.role || 'USER',
    name: session.user?.name || '',
    email: session.user?.email || '',
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* This is the ONLY place your sidebar should be */}
      <div className="hidden md:block w-64 bg-background border-r">
        <Sidebar user={user} />
      </div>

      <div className="flex flex-col flex-1">
        {/* This is the ONLY place your header and bell icon should be */}
        <header className="flex h-14 items-center justify-end gap-4 border-b bg-background px-6">
          <NotificationBell />
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}