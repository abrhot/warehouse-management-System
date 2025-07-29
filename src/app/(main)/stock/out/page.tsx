// src/app/(main)/stock/out/page.tsx
import StockOutForm from '@/components/stock/StockOutForm'
import StockOutTable from '@/components/stock/StockOutTable'

export default function StockOutPage() {
  return (
    <div className="px-40 flex flex-1 justify-center py-5 bg-[#fafcf8] min-h-screen">
      <div className="flex flex-col max-w-[960px] w-full">
        <div className="flex justify-between items-center flex-wrap gap-3 p-4">
          <h1 className="text-[#141b0e] text-[32px] font-bold">📥 Stock Out</h1>
          <button className="h-8 px-4 bg-[#edf3e7] rounded-full text-sm font-medium text-[#141b0e]">
            ← Product List
          </button>
        </div>

        {/* Hero Section */}
        <div className="p-4">
          <div
            className="rounded-xl flex flex-col justify-end pt-[132px] bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.4), transparent), url('/images/stockout-hero.jpg')",
            }}
          >
            <div className="p-4 text-white">
              <h2 className="text-2xl font-bold">Stock Out Form</h2>
              <p>Record items issued or removed from the warehouse inventory.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <StockOutForm />

        {/* Table */}
        <h2 className="text-[#141b0e] text-[22px] font-bold px-4 pt-5 pb-3">Recent Stock-Out Activity</h2>
        <StockOutTable />
      </div>
    </div>
  )
}
