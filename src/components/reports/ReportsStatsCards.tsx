// src/components/reports/ReportsStatsCards.tsx
'use client'; // <-- Add this to make it a Client Component

import useSWR from 'swr';

// A simple fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ReportsStatsCards() {
  const { data, error, isLoading } = useSWR('/api/reports/stats', fetcher, {
    refreshInterval: 30000 // Optional: refetch data every 30 seconds
  });

  if (error) return <div>Failed to load stats</div>;
  if (isLoading) return <div>Loading...</div>; // You can add a shimmer/skeleton loader here

  const stats = [
    { label: 'Total Stock In', value: data?.totalStockIn.toLocaleString() || '0' },
    { label: 'Total Stock Out', value: data?.totalStockOut.toLocaleString() || '0' },
    { label: 'Low Stock Alerts', value: data?.lowStockAlerts.toLocaleString() || '0' },
    { label: 'Total Products Managed', value: data?.totalProductsManaged.toLocaleString() || '0' },
  ];

  return (
    <div className="flex flex-wrap gap-4 px-4 py-4">
      {stats.map((item, idx) => (
        <div key={idx} className="flex flex-col flex-1 min-w-[158px] bg-[#edf3e7] p-6 rounded-xl gap-2">
          <p className="text-[#141b0e] text-base font-medium">{item.label}</p>
          <p className="text-[#141b0e] text-2xl font-bold tracking-light">{item.value}</p>
        </div>
      ))}
    </div>
  );
}