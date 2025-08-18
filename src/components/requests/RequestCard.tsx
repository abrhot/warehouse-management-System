// src/components/requests/RequestCard.tsx
'use client';

import { UserRequestWithRelations } from '@/app/(main)/my-requests/page';
import { Badge } from '@/components/ui/badge';
import { Calendar, Hash, StickyNote } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: { variant: 'secondary', text: 'Pending' },
    APPROVED: { variant: 'success', text: 'Approved' },
    REJECTED: { variant: 'destructive', text: 'Rejected' },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'outline', text: 'Unknown' };
  
  return <Badge variant={config.variant as any}>{config.text}</Badge>;
};

export function RequestCard({ request }: { request: UserRequestWithRelations }) {
  return (
    <div className="w-full rounded-lg bg-white p-3 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Product Name */}
      <div className="mb-2">
        <p className="font-semibold text-gray-800 truncate">{request.stockItem.product.name}</p>
      </div>

      {/* Serial Number */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <Hash className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <p className="font-mono text-blue-700 truncate">{request.stockItem.serialNumber}</p>
      </div>

      {/* Notes (only displayed if they exist) */}
      {request.notes && (
        <div className="flex items-start gap-2 mb-3 p-2 bg-gray-50 rounded-md border">
            <StickyNote className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 italic">{request.notes}</p>
        </div>
      )}

      {/* Footer with Date and Status */}
      <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
