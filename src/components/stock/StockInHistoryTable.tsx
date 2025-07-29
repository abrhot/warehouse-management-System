const stockInData = [
  {
    time: "2024-01-20 14:30",
    product: "Product X",
    quantity: 100,
    handler: "Abebe Kebede",
    notes: "Received from Supplier A",
  },
  {
    time: "2024-01-19 16:45",
    product: "Product Y",
    quantity: 50,
    handler: "Fatuma Hassan",
    notes: "Damaged packaging",
  },
  // Add more entries as needed...
];

export const StockInHistoryTable = () => (
  <div className="overflow-x-auto px-4 py-3">
    <table className="min-w-full bg-[#fafbf8] border border-[#dae6d1] rounded-xl text-sm">
      <thead>
        <tr className="text-[#141b0e]">
          <th className="px-4 py-3 text-left">Time</th>
          <th className="px-4 py-3 text-left">Product</th>
          <th className="px-4 py-3 text-left">Quantity</th>
          <th className="px-4 py-3 text-left">Handled By</th>
          <th className="px-4 py-3 text-left">Notes</th>
        </tr>
      </thead>
      <tbody className="text-[#6f9550]">
        {stockInData.map((entry, i) => (
          <tr key={i} className="border-t border-[#dae6d1]">
            <td className="px-4 py-2">{entry.time}</td>
            <td className="px-4 py-2">{entry.product}</td>
            <td className="px-4 py-2">{entry.quantity}</td>
            <td className="px-4 py-2">{entry.handler}</td>
            <td className="px-4 py-2">{entry.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
