// src/components/dashboard/KpiSection.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, History, Warehouse } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { TinyLine } from './TinyLine';

interface KpiData { totalProducts: number; stockOut: number; pendingRequests: number; newProducts: number; }

export function KpiSection({ data }: { data: KpiData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard title="Total Products" value={data.totalProducts.toLocaleString()} percentage="+3.2%" trend="up" Icon={Warehouse}>
        <TinyLine values={[5,8,7,10,12,13,14,16,18,17]} color="#1b4cff" />
      </KpiCard>
      <KpiCard title="Stock Out (7d)" value={data.stockOut.toLocaleString()} percentage="-2.5%" trend="down" Icon={Package}>
        <TinyLine values={[12,11,10,9,9,8,8,7,7,6]} color="#e74c3c" />
      </KpiCard>
      <KpiCard title="Pending Requests" value={data.pendingRequests.toLocaleString()} percentage="+180.1%" trend="up" Icon={History}>
        <TinyLine values={[2,3,3,4,5,6,5,7,8,10]} color="#5b7cfa" />
      </KpiCard>
      <KpiCard title="New Products (7d)" value={data.newProducts.toLocaleString()} percentage="+19%" trend="up" Icon={Warehouse}>
        <TinyLine values={[1,2,2,3,4,4,5,6,7,7]} color="#16a085" />
      </KpiCard>
    </div>
  );
}