// src/components/reports/LowStockTable.tsx
const lowStockItems = [
  {
    name: 'Modem X100',
    category: 'Modem',
    current: 20,
    min: 50,
    warehouse: 'Main Warehouse',
    date: '2024-07-20',
  },
  // Add more items...
]

export default function LowStockTable() {
  return (
    <div className="px-4 py-3 overflow-x-auto">
      <table className="w-full bg-[#fafcf8] border border-[#dae7d0] rounded-xl">
        <thead className="bg-[#fafcf8] text-[#141b0e] text-sm font-medium">
          <tr>
            <th className="px-4 py-3 text-left">Product Name</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-left">Current Stock</th>
            <th className="px-4 py-3 text-left">Minimum Stock Level</th>
            <th className="px-4 py-3 text-left">Warehouse</th>
            <th className="px-4 py-3 text-left">Alert Date</th>
          </tr>
        </thead>
        <tbody>
          {lowStockItems.map((item, idx) => (
            <tr key={idx} className="border-t border-[#dae7d0] text-sm text-[#6f974e]">
              <td className="px-4 py-2 text-[#141b0e]">{item.name}</td>
              <td className="px-4 py-2">{item.category}</td>
              <td className="px-4 py-2">{item.current}</td>
              <td className="px-4 py-2">{item.min}</td>
              <td className="px-4 py-2">{item.warehouse}</td>
              <td className="px-4 py-2">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
