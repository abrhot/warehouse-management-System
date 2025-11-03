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
  CheckCircle,
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
  '/admin/approvals': CheckCircle,
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

        <div className="space-y-2">
          {isOpen && (
            <div className="px-3 py-2 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 mb-1">Logged in as</p>
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span className={clsx(
                'inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded',
                user.role === 'ADMIN' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              )}>
                {user.role}
              </span>
            </div>
          )}
          <div className="px-3">
            <div className={clsx('flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer text-slate-700 hover:bg-red-50 hover:text-red-600')}
                onClick={() => logout()}
            >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span>Log out</span>}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
