'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Package2,
  Users,
  FileText,
  Settings,
  LayoutDashboard,
  ScrollText,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import '@/app/globals.css';


interface User {
  role: 'ADMIN' | 'USER';
}

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isCurrent: boolean;
  isOpen: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, icon, isCurrent, isOpen }) => (
  <Link
    href={href}
    className={`flex items-center gap-3 p-2 rounded-md transition-colors text-sm ${
      isCurrent
        ? 'bg-blue-600 text-white'
        : 'bg-white text-black hover:bg-blue-600 hover:text-white'
    }`}
  >
    {icon}
    {isOpen && <span className="font-medium">{label}</span>}
  </Link>
);

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`relative h-screen flex-shrink-0 transition-all duration-300 ease-in-out font-poppins ${
        isOpen ? 'w-64' : 'w-20'
      } border-r bg-white p-4 shadow-lg flex flex-col`}
    >
      {/* Top Section: WMS Logo & Hamburger Menu */}
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          {isOpen && (
            <h1 className="text-lg font-bold text-blue-600">WMS</h1>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full"
        >
          <Menu />
        </Button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto mt-6">
        <div className="flex flex-col gap-2">
          <NavLink
            href="/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className='h-4 w-4' />}
            isCurrent={pathname === '/dashboard'}
            isOpen={isOpen}
          />
          <NavLink
            href="/products"
            label="Products"
            icon={<Package2 className='h-4 w-4' />}
            isCurrent={pathname === '/products'}
            isOpen={isOpen}
          />
          <NavLink
            href="/reports"
            label="Reports"
            icon={<FileText className='h-4 w-4' />}
            isCurrent={pathname === '/reports'}
            isOpen={isOpen}
          />

          {/* Admin-only links */}
          {user.role === 'ADMIN' && (
            <>
              <NavLink
                href="/admin/users"
                label="Users"
                icon={<Users className='h-4 w-4' />}
                isCurrent={pathname.startsWith('/admin/users')}
                isOpen={isOpen}
              />
              <NavLink
                href="/admin/requests"
                label="Pending Requests"
                icon={<ScrollText className='h-4 w-4' />}
                isCurrent={pathname.startsWith('/admin/requests')}
                isOpen={isOpen}
              />
            </>
          )}

          <NavLink
            href="/settings"
            label="Settings"
            icon={<Settings className='h-4 w-4' />}
            isCurrent={pathname === '/settings'}
            isOpen={isOpen}
          />

        </div>
      </nav>

      {/* Logout Button */}
      <div className="flex-0 pt-4">
        <NavLink
          href="/login"
          label="Log Out"
          icon={<LogOut className='h-4 w-4' />}
          isCurrent={false}
          isOpen={isOpen}
        />
      </div>
    </div>
  );
}
