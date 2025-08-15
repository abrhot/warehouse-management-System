// src/app/(main)/settings/page.tsx
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { SettingsCard } from '@/components/settings/SettingsCard';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Added a new card for Locations to the settings categories
  const settingsCategories = [
    { title: 'General', description: 'View and update your general settings.', href: '/settings/general' },
    { title: 'Inventory', description: 'Configure inventory tracking and stock alerts.', href: '/settings/inventory' },
    { title: 'Users', description: 'Manage user roles, permissions, and access.', href: '/settings/users' },
    { title: 'Notifications', description: 'Configure email and in-app notifications.', href: '/settings/notifications' },
    { title: 'Locations', description: 'Manage shelves, bins, and other warehouse locations.', href: '/settings/locations' },
  ];

  return (
    <div className="flex flex-col gap-8 p-8 min-h-screen bg-white">
      {/* Top section is removed to "drag up" the page */}

      {/* Settings Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsCategories.map(card => (
            <SettingsCard key={card.title} {...card} />
          ))}
        </div>
      </section>
      
      {/* Integrations Section is removed */}
    </div>
  );
}