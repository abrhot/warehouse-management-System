// src/components/stock/StockOutTable.tsx
const sampleData = [
  {
    time: '2024-07-26 10:00',
    product: 'Fiber Optic Cable',
    quantity: '100m',
    issuedTo: 'Technician 1',
    handler: 'Abebe Kebede',
    purpose: 'Installation',
  },
  {
    time: '2024-07-25 15:30',
    product: 'Router',
    quantity: '5',
    issuedTo: 'Department A',
    handler: 'Fatuma Ahmed',
    purpose: 'Replacement',
  },
  // Add more...
]

export default function StockOutTable() {
  return (
    <div className="px-4 py-3">
      <div className="overflow-x-auto rounded-xl border border-[#dae7d0] bg-[#fafcf8]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#141b0e] font-medium">
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Issued To</th>
              <th className="px-4 py-3">Handled By</th>
              <th className="px-4 py-3">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((item, idx) => (
              <tr key={idx} className="border-t border-[#dae7d0] text-[#6f974e]">
                <td className="px-4 py-2">{item.time}</td>
                <td className="px-4 py-2 text-[#141b0e]">{item.product}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.issuedTo}</td>
                <td className="px-4 py-2">{item.handler}</td>
                <td className="px-4 py-2">{item.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
