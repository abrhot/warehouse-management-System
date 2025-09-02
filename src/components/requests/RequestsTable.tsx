'use client';

import React, { useState, useMemo, Fragment } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronDown, LayoutGrid, List } from 'lucide-react';
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
            <TableHead>Serial Number</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Date Requested</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((req) => (
              <Fragment key={req.id}>
                <TableRow>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span>{req.stockItem?.serialNumber || 'N/A'}</span>
                      {req.status === 'REJECTED' && req.reason && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleExpand(req.id)}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedRequestId === req.id ? 'rotate-180' : ''}`} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{req.stockItem?.product.name}</TableCell>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell><StatusBadge status={req.status} /></TableCell>
                </TableRow>
                {expandedRequestId === req.id && (
                  <TableRow className="bg-stone-50 hover:bg-stone-50">
                    <TableCell colSpan={4} className="p-0">
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

