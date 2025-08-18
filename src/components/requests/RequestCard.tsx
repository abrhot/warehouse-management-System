// src/components/requests/RequestCard.tsx
'use client';

import { UserRequestWithRelations } from '@/app/(main)/my-requests/page';
import { Calendar, DollarSign, Hash } from 'lucide-react';

export function RequestCard({ request }: { request: UserRequestWithRelations }) {
  const costPrice = parseFloat(request.stockItem.product.costPrice);

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Top section with Serial Number and Price */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-gray-400" />
          <p className="font-mono text-sm font-semibold text-blue-500">{request.stockItem.serialNumber.split('-')[2]}</p>
        </div>
        
      </div>

      {/* Main Content: Product Name */}
      <div className="mb-4">
        <p className="font-semibold text-gray-900">{request.stockItem.product.name}</p>
      </div>

      {/* Footer with Date */}
      <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(request.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
