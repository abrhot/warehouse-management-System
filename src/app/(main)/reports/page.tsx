// src/app/(main)/reports/page.tsx
'use client'; 

import { useState } from 'react';
import ReportsHeader from '@/components/reports/ReportsHeader';
import ReportsFilters from '@/components/reports/ReportsFilters';
import ReportsStatsCards from '@/components/reports/ReportsStatsCards';
import InventorySummaryChart from '@/components/reports/InventorySummaryChart';
import CategoryChart from '@/components/reports/CategoryChart';
import LowStockTable from '@/components/reports/LowStockTable';
import RequestHistoryTable from '@/components/reports/RequestHistoryTable'; // <-- Import the new component
import ReportsActions from '@/components/reports/ReportsActions';

export default function ReportsPage() {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    category: 'all',
    warehouse: 'all',
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  return (
    <div className="px-40 py-5 bg-[#fafcf8] min-h-screen flex justify-center">
      <div className="w-full max-w-[960px] flex flex-col">
        <ReportsHeader />
        <ReportsFilters onChange={handleFilterChange} />
        <ReportsStatsCards />

        <h2 className="text-[22px] font-bold px-4 pt-5 pb-3 text-[#141b0e]">Inventory Summary</h2>
        <div className="flex flex-wrap gap-4 px-4 py-6">
          <InventorySummaryChart />
          <CategoryChart />
        </div>

        <h2 className="text-[22px] font-bold px-4 pt-5 pb-3 text-[#141b0e]">Low Stock Alerts</h2>
        <LowStockTable />

        {/* 👇 Add the new section and component here */}
        <h2 className="text-[22px] font-bold px-4 pt-5 pb-3 text-[#141b0e]">Request History</h2>
        <RequestHistoryTable />

        <ReportsActions />
      </div>
    </div>
  );
}