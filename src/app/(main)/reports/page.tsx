// src/app/(main)/reports/page.tsx
import ReportsHeader from '@/components/reports/ReportsHeader'
import ReportsFilters from '@/components/reports/ReportsFilters'
import ReportsStatsCards from '@/components/reports/ReportsStatsCards'
import InventorySummaryChart from '@/components/reports/InventorySummaryChart'
import CategoryChart from '@/components/reports/CategoryChart'
import LowStockTable from '@/components/reports/LowStockTable'
import ReportsActions from '@/components/reports/ReportsActions'
import Link from "next/link";

export default function ReportsPage() {
  return (
    <div className="px-40 py-5 bg-[#fafcf8] min-h-screen flex justify-center">
      <div className="w-full max-w-[960px] flex flex-col">
        <ReportsHeader />
        <ReportsFilters />
        <ReportsStatsCards />

        <h2 className="text-[22px] font-bold px-4 pt-5 pb-3 text-[#141b0e]">Inventory Summary</h2>
        <div className="flex flex-wrap gap-4 px-4 py-6">
          <InventorySummaryChart />
          <CategoryChart />
        </div>

        <h2 className="text-[22px] font-bold px-4 pt-5 pb-3 text-[#141b0e]">Low Stock Alerts</h2>
        <LowStockTable />

        <ReportsActions />
      </div>
    </div>
  )
}
