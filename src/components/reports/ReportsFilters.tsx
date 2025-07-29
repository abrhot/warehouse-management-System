// src/components/reports/ReportsFilters.tsx
export default function ReportsFilters() {
  return (
    <div className="flex flex-col gap-3 px-4">
      <select className="h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4 text-base text-[#141b0e]">
        <option>Select Date Range</option>
        <option>Last 30 Days</option>
        <option>Last 6 Months</option>
      </select>
      <select className="h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4 text-base text-[#141b0e]">
        <option>Select Category</option>
        <option>Modems</option>
        <option>Cables</option>
      </select>
      <select className="h-14 rounded-xl border border-[#dae7d0] bg-[#fafcf8] px-4 text-base text-[#141b0e]">
        <option>Select Warehouse</option>
        <option>Main</option>
        <option>Branch A</option>
      </select>
    </div>
  )
}
