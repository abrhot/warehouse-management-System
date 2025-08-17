// src/components/requests/MyRequestsPageContent.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { RequestsHeader } from './RequestsHeader';
import { RequestsTable } from './RequestsTable';
import { RequestsBoardView } from './RequestsBoardView';
import { UserRequestWithRelations } from '@/app/(main)/my-requests/page';

export function MyRequestsPageContent({ initialRequests }: { initialRequests: UserRequestWithRelations[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [view, setView] = useState<'table' | 'board'>('table');

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/my-requests/${requestId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete request');
      }
      
      toast.success('Request deleted successfully!');
      setRequests(prev => prev.filter(req => req.id !== requestId));

    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.stockItem.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            req.stockItem.product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  return (
    <div className="flex flex-1 justify-center bg-[#fafbf8] py-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl flex flex-col space-y-6">
        <RequestsHeader
          onStatusChange={setStatusFilter}
          currentFilter={statusFilter}
          view={view}
          onViewChange={setView}
        />
        {view === 'table' ? (
          <RequestsTable
            requests={filteredRequests}
            onSearchChange={setSearchTerm}
            onDeleteRequest={handleDeleteRequest}
          />
        ) : (
          <RequestsBoardView requests={filteredRequests} />
        )}
      </div>
    </div>
  );
}
