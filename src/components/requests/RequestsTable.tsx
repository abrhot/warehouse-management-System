'use client';

import React, { useState, useMemo, Fragment } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { UserRequestWithRelations } from '@/app/(main)/my-requests/page';

// This file now contains all related components for the requests page for simplicity.

// ============================================================================
// 1. BADGE COMPONENT
// ============================================================================
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: { variant: 'secondary', text: 'Pending' },
    APPROVED: { variant: 'success', text: 'Approved' },
    REJECTED: { variant: 'destructive', text: 'Rejected' },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline', text: 'Unknown' };
  return <Badge variant={config.variant as any}>{config.text}</Badge>;
};


// ============================================================================
// 2. REQUESTS TABLE COMPONENT
// ============================================================================
interface RequestsTableProps {
  requests: UserRequestWithRelations[];
  onSearchChange: (term: string) => void;
}

export function RequestsTable({ requests, onSearchChange }: RequestsTableProps) {
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const toggleExpand = (requestId: string) => {
    setExpandedRequestId(currentId => (currentId === requestId ? null : requestId));
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-4">
        <Input
          placeholder="Search by product name or serial number..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Date Requested</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((req) => {
              const isExpandable = req.status === 'REJECTED' && req.reason;
              const isExpanded = expandedRequestId === req.id;

              return (
                <Fragment key={req.id}>
                  <TableRow
                    onClick={() => isExpandable && toggleExpand(req.id)}
                    className={isExpandable ? 'cursor-pointer' : ''}
                  >
                    <TableCell>
                      {isExpandable && (
                        <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {req.stockItem?.serialNumber || 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium">{req.stockItem?.product.name}</TableCell>
                    <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className={
                      req.status === 'REJECTED' ? 'bg-red-50' :
                      req.status === 'APPROVED' ? 'bg-blue-50' : ''
                    }>
                      <StatusBadge status={req.status} />
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow className="bg-stone-50 hover:bg-stone-50">
                      <TableCell colSpan={5} className="p-0">
                        <div className="p-4 text-sm text-destructive flex items-start space-x-3">
                          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">Rejection Reason:</p>
                            <p className="text-gray-600 italic">"{req.reason}"</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

