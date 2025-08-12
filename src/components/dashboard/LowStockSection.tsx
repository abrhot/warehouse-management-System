// src/components/dashboard/LowStockSection.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LowStockItem { id: string; name: string; quantity: number; }

export function LowStockSection({ lowStockItems }: { lowStockItems: LowStockItem[] }) {
  return (
    <Card className="lg:col-span-1 shadow-sm">
      <CardHeader><CardTitle>Low Stock Items</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {lowStockItems.length > 0 ? lowStockItems.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right text-red-500 font-mono">{item.quantity}</TableCell>
              </TableRow>
            )) : <TableRow><TableCell colSpan={2} className="text-center">All stock levels are healthy.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}