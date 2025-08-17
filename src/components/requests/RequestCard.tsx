// src/components/requests/RequestCard.tsx
'use client';

import { UserRequestWithRelations } from '@/app/(main)/my-requests/page';

export function RequestCard({ request }: { request: UserRequestWithRelations }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-2">
        <p className="text-sm font-semibold text-gray-800">{request.stockItem.product.name}</p>
        <p className="font-mono text-xs text-blue-600">{request.stockItem.serialNumber}</p>
      </div>
      <div className="border-t border-gray-100 pt-2 text-xs text-gray-500">
        <p>Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
