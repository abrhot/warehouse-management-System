// src/app/(main)/settings/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { Search, Globe, Bell, Package, Users as UsersIcon, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SettingsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for each settings group (placeholder, not persisted)
  const [general, setGeneral] = useState({
    orgName: '',
    currency: 'ETB',
    language: 'am',
    timezone: 'Africa/Addis_Ababa',
  });

  const [inventory, setInventory] = useState({
    defaultReorderLevel: 10,
    lowStockThresholdPct: 25,
    valuationMethod: 'FIFO',
    autoCloseCompleted: true,
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    inAppAlerts: true,
    dailySummary: false,
    summaryTime: '09:00',
    lowStockSeverity: 'all',
  });

  const [locations, setLocations] = useState({
    multiLocation: true,
    defaultLocation: 'Main Warehouse',
  });

  const [users, setUsers] = useState({
    allowSelfSignup: false,
    passwordMinLength: 8,
    require2FA: false,
  });

  const [saved, setSaved] = useState<string | null>(null);
  const onSave = (key: string) => {
    setSaved(key);
    setTimeout(() => setSaved(null), 1200);
  };

  const sections = useMemo(() => ([
    {
      key: 'general',
      title: 'General Settings',
      icon: <Globe className="w-4 h-4 text-[#1b4cff]" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Organization Name</Label>
            <Input value={general.orgName} onChange={(e) => setGeneral({ ...general, orgName: e.target.value })} placeholder="e.g. EthioNet Warehouse" />
          </div>
          <div>
            <Label>Default Currency</Label>
            <Select value={general.currency} onValueChange={(v) => setGeneral({ ...general, currency: v })}>
              <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ETB">ETB (Br)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Language</Label>
            <Select value={general.language} onValueChange={(v) => setGeneral({ ...general, language: v })}>
              <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="am">Amharic</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Timezone</Label>
            <Select value={general.timezone} onValueChange={(v) => setGeneral({ ...general, timezone: v })}>
              <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Addis_Ababa">Africa/Addis_Ababa (EAT)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground">Update base information for your workspace.</div>
            <div className="flex items-center gap-2">
              {saved === 'general' && <span className="text-xs text-green-600">Saved</span>}
              <Button size="sm" onClick={() => onSave('general')}>Save</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'inventory',
      title: 'Inventory Settings',
      icon: <Package className="w-4 h-4 text-[#1b4cff]" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Default Reorder Level</Label>
            <Input type="number" value={inventory.defaultReorderLevel} onChange={(e) => setInventory({ ...inventory, defaultReorderLevel: Number(e.target.value || 0) })} />
          </div>
          <div>
            <Label>Low Stock Threshold (%)</Label>
            <Input type="number" value={inventory.lowStockThresholdPct} onChange={(e) => setInventory({ ...inventory, lowStockThresholdPct: Number(e.target.value || 0) })} />
          </div>
          <div>
            <Label>Stock Valuation Method</Label>
            <Select value={inventory.valuationMethod} onValueChange={(v) => setInventory({ ...inventory, valuationMethod: v })}>
              <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="FIFO">FIFO</SelectItem>
                <SelectItem value="LIFO">LIFO</SelectItem>
                <SelectItem value="AVERAGE">Average Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between mt-6">
            <Label className="mr-4">Auto-close completed requests</Label>
            <Switch checked={inventory.autoCloseCompleted} onCheckedChange={(v) => setInventory({ ...inventory, autoCloseCompleted: !!v })} />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground">Configure reorder logic and alert thresholds.</div>
            <div className="flex items-center gap-2">
              {saved === 'inventory' && <span className="text-xs text-green-600">Saved</span>}
              <Button size="sm" onClick={() => onSave('inventory')}>Save</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-4 h-4 text-[#1b4cff]" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label className="mr-4">Email Alerts</Label>
            <Switch checked={notifications.emailAlerts} onCheckedChange={(v) => setNotifications({ ...notifications, emailAlerts: !!v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="mr-4">In‑app Alerts</Label>
            <Switch checked={notifications.inAppAlerts} onCheckedChange={(v) => setNotifications({ ...notifications, inAppAlerts: !!v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="mr-4">Daily Summary</Label>
            <Switch checked={notifications.dailySummary} onCheckedChange={(v) => setNotifications({ ...notifications, dailySummary: !!v })} />
          </div>
          <div>
            <Label>Delivery Time</Label>
            <Select value={notifications.summaryTime} onValueChange={(v) => setNotifications({ ...notifications, summaryTime: v })}>
              <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent>
                {['06:00','09:00','12:00','15:00','18:00'].map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Low Stock Alert Severity</Label>
            <Select value={notifications.lowStockSeverity} onValueChange={(v) => setNotifications({ ...notifications, lowStockSeverity: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="warning">Warning only</SelectItem>
                <SelectItem value="critical">Critical only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground">Control how and when alerts are delivered.</div>
            <div className="flex items-center gap-2">
              {saved === 'notifications' && <span className="text-xs text-green-600">Saved</span>}
              <Button size="sm" onClick={() => onSave('notifications')}>Save</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'locations',
      title: 'Locations',
      icon: <MapPin className="w-4 h-4 text-[#1b4cff]" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label className="mr-4">Enable Multi‑location</Label>
            <Switch checked={locations.multiLocation} onCheckedChange={(v) => setLocations({ ...locations, multiLocation: !!v })} />
          </div>
          <div>
            <Label>Default Location</Label>
            <Input value={locations.defaultLocation} onChange={(e) => setLocations({ ...locations, defaultLocation: e.target.value })} placeholder="Main Warehouse" />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground">Manage warehouse location defaults.</div>
            <div className="flex items-center gap-2">
              {saved === 'locations' && <span className="text-xs text-green-600">Saved</span>}
              <Button size="sm" onClick={() => onSave('locations')}>Save</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'users',
      title: 'User Management',
      icon: <UsersIcon className="w-4 h-4 text-[#1b4cff]" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label className="mr-4">Allow self‑signup</Label>
            <Switch checked={users.allowSelfSignup} onCheckedChange={(v) => setUsers({ ...users, allowSelfSignup: !!v })} />
          </div>
          <div>
            <Label>Password min length</Label>
            <Input type="number" value={users.passwordMinLength} onChange={(e) => setUsers({ ...users, passwordMinLength: Number(e.target.value || 0) })} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="mr-4">Require 2FA</Label>
            <Switch checked={users.require2FA} onCheckedChange={(v) => setUsers({ ...users, require2FA: !!v })} />
          </div>
          <div className="sm:col-span-2 flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground">Basic access and security preferences.</div>
            <div className="flex items-center gap-2">
              {saved === 'users' && <span className="text-xs text-green-600">Saved</span>}
              <Button size="sm" onClick={() => onSave('users')}>Save</Button>
            </div>
          </div>
        </div>
      ),
    },
  ]), [general, inventory, notifications, locations, users, saved]);

  const filtered = sections.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 p-8 min-h-screen bg-white">
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

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-muted-foreground">Configure your workspace</CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground">No matching settings.</div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filtered.map(section => (
                  <AccordionItem key={section.key} value={section.key}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        {section.icon}
                        <span className="font-medium">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {section.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}