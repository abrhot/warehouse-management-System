// src/app/(main)/admin/requests/page.tsx
import { PageHeader } from '@/components/ui/PageHeader';
import { PendingRequests } from '@/components/admin/PendingRequests';

export default function AdminRequestsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="Pending Stock Requests"
        description="Review and manage all incoming stock requests."
      />
      <div className="mt-8">
        <PendingRequests />
      </div>
    </div>
  );
}