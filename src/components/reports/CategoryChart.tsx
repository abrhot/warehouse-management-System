// src/components/reports/CategoryChart.tsx
const categoryData = [
  { label: 'Modem', height: '20%' },
  { label: 'Cable', height: '70%' },
  { label: 'Router', height: '10%' },
  { label: 'Switch', height: '30%' },
  { label: 'Access Point', height: '80%' },
  { label: 'Fiber', height: '10%' },
]

export default function CategoryChart() {
  return (
    <div className="flex flex-col flex-1 min-w-72 border border-[#dae7d0] p-6 rounded-xl">
      <p className="text-base font-medium text-[#141b0e]">Inventory by Category</p>
      <p className="text-[32px] font-bold text-[#141b0e] truncate">-5%</p>
      <div className="flex gap-1">
        <p className="text-[#6f974e] text-base">Last 30 Days</p>
        <p className="text-[#e71f08] text-base font-medium">-5%</p>
      </div>
      <div className="grid grid-flow-col gap-6 items-end justify-items-center px-3 py-4 min-h-[180px]">
        {categoryData.map(({ label, height }, i) => (
          <div key={i} className="flex flex-col items-center w-full">
            <div className="w-full bg-[#edf3e7] border-t-2 border-[#6f974e]" style={{ height }} />
            <p className="text-[13px] font-bold text-[#6f974e] mt-2">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
