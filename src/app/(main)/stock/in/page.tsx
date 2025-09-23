import { StockInForm } from "@/components/stock/StockInForm";
import { PageHeader } from "@/components/ui/PageHeader";

export default function StockInPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="📥 Stock In"
          subtitle="Manage incoming stock efficiently"
        />
        
        {/* The form is now the only component on this page */}
        <StockInForm />
        
        {/* The StockInHistoryTable and its title have been removed */}
      </div>
    </main>
  );
}