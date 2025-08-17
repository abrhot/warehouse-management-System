// src/components/requests/RequestsHeader.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, LayoutDashboard } from 'lucide-react';
import clsx from 'clsx';

// ... interface

export function RequestsHeader({ onStatusChange, currentFilter, view, onViewChange }: RequestsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <h1 className="text-3xl font-bold text-gray-800">My Requests</h1>
      <div className="flex items-center gap-4">
        {/* === THIS IS THE VIEW TOGGLE BUTTONS === */}
        <div className="flex items-center gap-1 rounded-lg bg-gray-200 p-1">
          <Button
            size="sm"
            onClick={() => onViewChange('table')}
            className={clsx(
              'flex items-center gap-2 px-3 py-1',
              view === 'table' ? 'bg-white text-black shadow-sm' : 'bg-transparent text-gray-600 hover:bg-white/50'
            )}
          >
            <Table className="h-4 w-4" />
            Table
          </Button>
          <Button
            size="sm"
            onClick={() => onViewChange('board')}
            className={clsx(
              'flex items-center gap-2 px-3 py-1',
              view === 'board' ? 'bg-white text-black shadow-sm' : 'bg-transparent text-gray-600 hover:bg-white/50'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Board
          </Button>
        </div>
        {/* ======================================= */}
        
        {/* ... other filters and buttons */}
      </div>
    </div>
  );
}