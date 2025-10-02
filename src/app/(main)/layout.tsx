import { Sidebar } from '@/components/layout/Sidebar';
import { redirect } from 'next/navigation';
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // Check for JWT token in cookies instead of NextAuth session
  const cookieStore = cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    redirect('/login');
  }

  let user = {
    role: 'USER',
    name: 'User',
    email: 'user@example.com',
  };

  try {
    // Verify and decode JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
    const { payload } = await jwtVerify(token, secret);
    
    user = {
      role: (payload as any).role || 'USER',
      name: (payload as any).name || 'User',
      email: (payload as any).email || 'user@example.com',
    };
  } catch (error) {
    console.error('JWT verification failed in layout:', error);
    redirect('/login');
  }

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