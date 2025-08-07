import PendingRequests from '@/components/admin/PendingRequests';

export default function AdminRequestsPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* This is the component that fetches and displays pending requests */}
      <PendingRequests />
      
    </main>
  );
}