// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { getNavRoutes } from '@/config/routes'; // Make sure this path is correct
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Users,
  LogOut,
  LucideIcon,
  Mail,
  ClipboardList,
  Menu,
  Tag,
  Boxes,
  Layers3,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { useState } from 'react';

// --- Icon Mapping ---
const iconMap: { [key: string]: LucideIcon } = {
  '/dashboard': LayoutDashboard,
  '/products': Boxes,
  '/categories': Layers3,
  '/my-requests': ClipboardList,
  '/reports': BarChart3,
  '/settings': Settings,
  '/admin/users': Users,
  '/admin/requests': Bell,
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(true);

  // Generate navigation routes based on the user's role.
  const navRoutes = getNavRoutes(user?.role);

  return (
    <aside className={clsx(
        'fixed top-0 left-0 z-50 flex h-screen flex-col border-r bg-white p-4 shadow-lg transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-20'
    )}>
      {/* Top Section: WMS Logo & Hamburger Menu */}
      <div className="flex h-16 items-center justify-between">
        {isOpen && (
            <Link href="/dashboard" className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              WarehouseIMS
            </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full"
        >
          <Menu />
        </Button>
      </div>

      {/* Main Navigation Links & User Profile */}
      <div className="flex flex-1 flex-col justify-between overflow-y-auto">
        <nav className="mt-6 flex flex-col gap-2">
          {navRoutes.map((route) => {
            const Icon = iconMap[route.path] || Package;
            const isActive = pathname === route.path || (route.path !== '/dashboard' && pathname.startsWith(route.path));
            
            return (
              <Link
                key={route.path}
                href={route.path}
                className={clsx(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                )}
              >
                <Icon className={clsx('h-5 w-5 flex-shrink-0', isActive ? 'text-white' : 'text-blue-600')} />
                {isOpen && <span>{route.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User profile and logout section */}
        <div className="pt-4">
            <div className={clsx('flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer text-slate-700 hover:bg-red-50 hover:text-red-600')}
                onClick={() => signOut()}
            >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span>Log out</span>}
            </div>
        </div>
      </div>
    </aside>
  );
}
