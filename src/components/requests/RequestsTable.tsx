'use client';

import React, { useState, Fragment } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { UserRequestWithRelations } from '@/app/(main)/my-requests/page';

interface RequestsTableProps {
  requests: UserRequestWithRelations[];
  onSearchChange: (term: string) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: { variant: 'secondary', text: 'Pending' },
    APPROVED: { variant: 'success', text: 'Approved' },
    REJECTED: { variant: 'destructive', text: 'Rejected' },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline', text: 'Unknown' };
  
  // The 'as any' is used because your custom variants like 'success' might not be in the base BadgeProps type
  return <Badge variant={config.variant as any}>{config.text}</Badge>;
};

export function RequestsTable({ requests, onSearchChange }: RequestsTableProps) {
  // NEW: State to manage which row is expanded
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

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
            {/* NEW: Added a fixed-width column for the action button */}
            <TableHead className="w-[50px]">Actions</TableHead> 
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((req) => (
              <Fragment key={req.id}>
                <TableRow>
                  <TableCell className="font-mono text-xs">{req.stockItem?.serialNumber}</TableCell>
                  <TableCell className="font-medium">{req.stockItem?.product.name}</TableCell>
                  <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell><StatusBadge status={req.status} /></TableCell>
                  {/* NEW: Cell for the expansion button */}
                  <TableCell>
                    {req.status === 'REJECTED' && req.reason && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setExpandedRequestId(expandedRequestId === req.id ? null : req.id)}
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedRequestId === req.id ? 'rotate-180' : ''}`} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                {/* NEW: Conditionally rendered row for the rejection reason */}
                {expandedRequestId === req.id && (
                  <TableRow className="bg-stone-50 hover:bg-stone-50">
                    <TableCell colSpan={5} className="p-0">
                      <div className="p-4 text-sm text-destructive flex items-start space-x-2">
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