// src/components/dashboard/AlertsCard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Package, History } from 'lucide-react';
import { Product, StockRequest } from '@/generated/prisma';

export function AlertsCard({ lowStock, pendingRequests }: { lowStock: Product[], pendingRequests: StockRequest[] }) {
  return (
    <Card className="lg:col-span-1 shadow-sm bg-[#edf3e8] text-[#141b0e]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Package className="w-4 h-4 text-[#6f9550]" />
          <span>Low Stock Items: <span className="text-red-500 font-bold">{lowStock.length}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <History className="w-4 h-4 text-[#6f9550]" />
          <span>Pending Requests: <span className="font-bold">{pendingRequests.length}</span></span>
        </div>
      </CardContent>
    </Card>
  );
}