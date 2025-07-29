import { StockInForm } from "@/components/stock/StockInForm";
import { StockInHistoryTable } from "@/components/stock/StockInHistoryTable";
import { PageHeader } from "@/components/ui/PageHeader";

export default function StockInPage() {
  return (
    <main className="bg-[#fafbf8] min-h-screen px-40 py-5">
      <div className="max-w-[960px] mx-auto">
        <PageHeader
          title="📥 Stock In"
          subtitle="Manage incoming stock efficiently"
        />
        <StockInForm />
        <h3 className="text-[#141b0e] text-lg font-bold px-4 pb-2 pt-4">Recent Stock-In History</h3>
        <StockInHistoryTable />
      </div>
    </main>
  );
}
