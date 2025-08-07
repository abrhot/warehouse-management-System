// src/components/reports/RequestHistoryTable.tsx
'use client';

import useSWR from 'swr';
import { StockRequest, Product, User, StockType, RequestStatus } from '@prisma/client';

// Define a type for our fetched data, which includes relations
type RequestHistoryItem = StockRequest & {
  product: Pick<Product, 'name'>;
  requester: Pick<User, 'name'>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RequestHistoryTable() {
  const { data: history, error, isLoading } = useSWR<RequestHistoryItem[]>('/api/reports/history', fetcher);

  if (error) return <div>Failed to load request history.</div>;
  if (isLoading) return <div>Loading history...</div>;

  return (
    <div className="px-4 py-3 overflow-x-auto">
      <table className="w-full bg-[#fafcf8] border border-[#dae7d0] rounded-xl">
        <thead className="bg-[#fafcf8] text-[#141b0e] text-sm font-medium">
          <tr>
            <th className="px-4 py-3 text-left">Product Name</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Quantity</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Requested By</th>
            <th className="px-4 py-3 text-left">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {history && history.length > 0 ? (
            history.map((item) => (
              <tr key={item.id} className="border-t border-[#dae7d0] text-sm text-[#6f974e]">
                <td className="px-4 py-2 text-[#141b0e]">{item.product.name}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.type === StockType.IN ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">
                   <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status === RequestStatus.APPROVED ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2">{item.requester.name || 'N/A'}</td>
                <td className="px-4 py-2">{new Date(item.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-[#141b0e]">No request history found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}