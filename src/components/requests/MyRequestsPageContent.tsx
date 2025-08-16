// src/components/requests/MyRequestsPageContent.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { RequestsHeader } from './RequestsHeader';
import { RequestsTable } from './RequestsTable';
import { UserRequestWithRelations } from '@/app/(main)/my-requests/page';

export function MyRequestsPageContent({ initialRequests }: { initialRequests: UserRequestWithRelations[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRequests = useMemo(() => {
    return initialRequests.filter(req => {
      const matchesSearch = req.stockItem.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            req.stockItem.product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialRequests, searchTerm, statusFilter]);

  return (
    <div className="flex flex-1 justify-center bg-[#fafbf8] py-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl flex flex-col space-y-6">
        <RequestsHeader
          onStatusChange={setStatusFilter}
          currentFilter={statusFilter}
        />
        <RequestsTable
          requests={filteredRequests}
          onSearchChange={setSearchTerm}
        />
      </div>
    </div>
  );
}
