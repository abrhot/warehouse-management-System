// src/components/requests/RequestsHeader.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, LayoutDashboard, Plus } from 'lucide-react';
import clsx from 'clsx';

interface RequestsHeaderProps {
  onStatusChange: (status: string) => void;
  currentFilter: string;
  view: 'table' | 'board';
  onViewChange: (view: 'table' | 'board') => void;
}

export function RequestsHeader({ onStatusChange, currentFilter, view, onViewChange }: RequestsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* This empty div can be used for branding or breadcrumbs later */}
      <div></div>
      
      <div className="flex items-center gap-4">
        {/* View Toggle */}
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
        
        {/* Status Filter - This is the expandable menu for status */}
        <Select value={currentFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px] bg-white hover:bg-blue-50 border-gray-300">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Create Request Button */}
        <Link href="/products" passHref>
          <Button className="bg-white text-black border border-gray-300 hover:bg-blue-500 hover:text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </Link>
      </div>
    </div>
  );
}
