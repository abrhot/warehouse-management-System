// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Package2, Users, FileText, Settings, LayoutDashboard, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  role: 'ADMIN' | 'USER';
}

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isCurrent: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, icon, isCurrent }) => (
  <Link href={href} className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isCurrent ? 'bg-teal-500 text-white' : 'hover:bg-slate-700'}`}>
    {icon}
    <span>{label}</span>
  </Link>
);

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4 p-4 text-slate-50">
      <NavLink href="/dashboard" label="Dashboard" icon={<LayoutDashboard />} isCurrent={pathname === '/dashboard'} />
      <NavLink href="/products" label="Products" icon={<Package2 />} isCurrent={pathname === '/products'} />
      <NavLink href="/reports" label="Reports" icon={<FileText />} isCurrent={pathname === '/reports'} />
      <NavLink href="/settings" label="Settings" icon={<Settings />} isCurrent={pathname === '/settings'} />
      
      {/* Admin-only links */}
      {user.role === 'ADMIN' && (
        <>
          {/* Corrected href paths */}
          <NavLink href="/admin/users" label="Users" icon={<Users />} isCurrent={pathname.startsWith('/admin/users')} />
          <NavLink href="/admin/requests" label="Pending Requests" icon={<ScrollText />} isCurrent={pathname.startsWith('/admin/requests')} />
        </>
      )}

      {/* Notification Bell */}
      <div className="absolute top-4 right-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="relative p-2">
              <Bell />
              {/* Optional: Add a badge for unread notifications */}
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            {/* Content for the notification sidebar */}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}