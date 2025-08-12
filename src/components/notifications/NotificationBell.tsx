'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell } from 'lucide-react';

// StatusBadge component remains the same
function StatusBadge({ status }: { status: string }) {
  const statusStyles: { [key: string]: string } = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        statusStyles[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
}

// Notification interface remains the same
interface Notification {
  id: string;
  quantity: number;
  type: 'IN' | 'OUT';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  product: {
    name: string;
  };
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // New state to track if there are unread (pending) notifications
  const [hasUnread, setHasUnread] = useState(false);

  const fetchNotifications = async () => {
    // Keep isLoading true only for the very first fetch
    // subsequent background fetches won't show the "Loading..." text
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        // Check if any fetched notifications are pending to show the dot
        if (data.some((req: Notification) => req.status === 'PENDING')) {
          setHasUnread(true);
        } else {
          setHasUnread(false);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // FIX 1 & 2: Load data on mount and then poll for updates every 30 seconds
  useEffect(() => {
    fetchNotifications(); // Fetch immediately when component loads

    const intervalId = setInterval(fetchNotifications, 30000); // And every 30 seconds after

    // Cleanup function to stop polling when the component is removed
    return () => clearInterval(intervalId);
  }, []);

  // When the user opens the popover, we can consider the notifications "seen"
  const handleBellClick = () => {
    setHasUnread(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative" onClick={handleBellClick}>
          {/* FIX 3: Show a red dot if there are unread notifications */}
          {hasUnread && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
          )}
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">My Requests</h3>
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <p>Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">You have no recent requests.</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((req) => (
                  <li key={req.id} className="p-2 bg-secondary rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">{req.product.name}</span>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Type: {req.type} | Qty: {req.quantity}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}