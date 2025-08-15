// src/components/settings/SettingsCard.tsx
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Package, Users, Bell, Warehouse } from 'lucide-react';
import React from 'react';

// Map your titles to icons
const iconMap = {
  General: <Settings className="h-6 w-6 text-blue-500" />,
  Inventory: <Package className="h-6 w-6 text-green-500" />,
  Users: <Users className="h-6 w-6 text-purple-500" />,
  Notifications: <Bell className="h-6 w-6 text-orange-500" />,
  Locations: <Warehouse className="h-6 w-6 text-indigo-500" />,
};

interface SettingsCardProps {
  title: string;
  description: string;
  href: string;
}

export function SettingsCard({ title, description, href }: SettingsCardProps) {
  const IconComponent = (iconMap as any)[title];

  return (
    <Link href={href} className="group">
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full">
        <CardHeader className="flex flex-row items-center space-x-4">
          <div className="rounded-lg p-2 bg-gray-100 group-hover:bg-gray-200 transition-colors">
            {IconComponent}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}