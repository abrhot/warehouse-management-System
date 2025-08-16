// src/components/requests/RequestsTable.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
  
  return <Badge variant={config.variant as any}>{config.text}</Badge>;
};

export function RequestsTable({ requests, onSearchChange }: RequestsTableProps) {
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
              <TableRow key={req.id}>
                <TableCell className="font-mono text-xs">{req.stockItem.serialNumber}</TableCell>
                <TableCell className="font-medium">{req.stockItem.product.name}</TableCell>
                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <StatusBadge status={req.status} />
                </TableCell>
              </TableRow>
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
