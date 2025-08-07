import PendingRequests from '@/components/admin/PendingRequests';

export default function AdminRequestsPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* This component will fetch and display pending requests */}
      <PendingRequests />
      
    </main>
  );
}