// src/components/requests/RequestsBoardView.tsx
'use client';

import { UserRequestWithRelations } from '@/app/(main)/my-requests/page';
import { RequestCard } from './RequestCard';
import { Badge } from '@/components/ui/badge';
import { RequestStatus } from '@/generated/prisma';

interface RequestsBoardViewProps {
  requests: UserRequestWithRelations[];
}

const statusColumns: RequestStatus[] = [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.REJECTED];

const statusConfig = {
    PENDING: { title: 'Pending', color: 'bg-yellow-500' },
    APPROVED: { title: 'Approved', color: 'bg-green-500' },
    REJECTED: { title: 'Rejected', color: 'bg-red-500' },
};


export function RequestsBoardView({ requests }: RequestsBoardViewProps) {
  const groupedRequests = statusColumns.map(status => ({
    status,
    requests: requests.filter(req => req.status === status),
  }));

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {groupedRequests.map(({ status, requests: reqs }) => (
        <div key={status} className="flex flex-col flex-shrink-0 min-w-[280px] max-w-[300px] w-full">
          <div className="flex items-center gap-2 p-2 mb-4 border-b-2">
            <span className={`h-2 w-2 rounded-full ${statusConfig[status].color}`}></span>
            <h2 className="font-semibold text-gray-700">{statusConfig[status].title}</h2>
            <Badge variant="secondary">{reqs.length}</Badge>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto">
            {reqs.length > 0 ? (
              reqs.map(req => <RequestCard key={req.id} request={req} />)
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                No requests in this stage.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
