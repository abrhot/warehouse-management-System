// src/components/reports/ReportsStatsCards.tsx
const stats = [
  { label: 'Total Stock In', value: '12,500' },
  { label: 'Total Stock Out', value: '11,200' },
  { label: 'Low Stock Alerts', value: '50' },
  { label: 'Total Products Managed', value: '5,000' },
]

export default function ReportsStatsCards() {
  return (
    <div className="flex flex-wrap gap-4 px-4 py-4">
      {stats.map((item, idx) => (
        <div key={idx} className="flex flex-col flex-1 min-w-[158px] bg-[#edf3e7] p-6 rounded-xl gap-2">
          <p className="text-[#141b0e] text-base font-medium">{item.label}</p>
          <p className="text-[#141b0e] text-2xl font-bold tracking-light">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

