// src/components/dashboard/KpiSection.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, History, DollarSign, Warehouse } from 'lucide-react';
import { KpiCard } from './KpiCard';

interface KpiData { totalRevenue: number; stockOut: number; pendingRequests: number; newProducts: number; }

export function KpiSection({ data }: { data: KpiData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard title="Total Revenue" value={`$${data.totalRevenue.toLocaleString()}`} percentage="+20.1%" trend="up" Icon={DollarSign} />
      <KpiCard title="Stock Out (7d)" value={data.stockOut.toLocaleString()} percentage="-2.5%" trend="down" Icon={Package} />
      <KpiCard title="Pending Requests" value={data.pendingRequests.toLocaleString()} percentage="+180.1%" trend="up" Icon={History} />
      <KpiCard title="New Products (7d)" value={data.newProducts.toLocaleString()} percentage="+19%" trend="up" Icon={Warehouse} />
    </div>
  );
}