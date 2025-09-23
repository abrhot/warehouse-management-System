// src/components/dashboard/StockOverview.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, LineChart } from 'lucide-react';

type Product = { id: string; name: string; quantity: number };

export function StockOverview({ products }: { products: Product[] }) {
  return (
    <div className="lg:col-span-1 flex flex-col gap-4">
      <Card className="shadow-sm bg-[#edf3e8] text-[#141b0e]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#6f9550]" />
            Inventory by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 text-center flex items-center justify-center">
            [Pie Chart Placeholder]
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm bg-[#edf3e8] text-[#141b0e]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-[#6f9550]" />
            Stock Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 text-center flex items-center justify-center">
            [Line Chart Placeholder]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}