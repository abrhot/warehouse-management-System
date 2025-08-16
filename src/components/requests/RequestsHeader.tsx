// src/components/requests/RequestsHeader.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RequestsHeaderProps {
  onStatusChange: (status: string) => void;
  currentFilter: string;
}

export function RequestsHeader({ onStatusChange, currentFilter }: RequestsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <h1 className="text-3xl font-bold text-gray-800">My Requests</h1>
      <div className="flex items-center gap-2">
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
        <Link href="/products" passHref>
          <Button className="bg-white text-black border border-gray-300 hover:bg-blue-500 hover:text-white">
            + Create Request
          </Button>
        </Link>
      </div>
    </div>
  );
}
