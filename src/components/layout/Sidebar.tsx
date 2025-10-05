// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getNavRoutes } from '@/config/routes';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Users,
  LogOut,
  LucideIcon,
  ClipboardList,
  Menu,
  Boxes,
  Layers3,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { useState } from 'react';

interface SidebarProps {
  user: {
    role: string;
    name: string;
    email: string;
  };
}

const iconMap: { [key: string]: LucideIcon } = {
  '/my-requests': ClipboardList,
  '/dashboard': LayoutDashboard,
  '/products': Boxes,
  '/categories': Layers3,
  '/reports': BarChart3,
  '/settings': Settings,
  '/admin/users': Users,
  '/admin/requests': Bell,
};

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const { logout } = useAuth();

  const navRoutes = getNavRoutes(user.role);

  return (
    <aside className={clsx(
        'fixed top-0 left-0 z-50 flex h-screen flex-col border-r bg-white p-4 shadow-lg transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-20'
    )}>
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

        <div className="pt-4">
            <div className={clsx('flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer text-slate-700 hover:bg-red-50 hover:text-red-600')}
                onClick={() => logout()}
            >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span>Log out</span>}
            </div>
        </div>
      </div>
    </aside>
  );
}
