import StockOutForm from '@/components/stock/StockOutForm';
import { PageHeader } from '@/components/ui/PageHeader';

export default function StockOutPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="📤 Stock Out"
          subtitle="Record items issued or removed from the inventory."
        />
        
        {/* The form is now the only component on this page */}
        <StockOutForm />

        {/* The hero image and StockOutTable have been removed */}
      </div>
    </main>
  );
}