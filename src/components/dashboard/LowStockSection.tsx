// src/components/dashboard/LowStockSection.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TriangleAlert } from 'lucide-react';

interface LowStockItem { id: string; name: string; quantity: number; reorderLevel?: number; }

export function LowStockSection({ lowStockItems }: { lowStockItems: LowStockItem[] }) {
  return (
    <Card className="lg:col-span-1 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TriangleAlert className="w-5 h-5 text-[#1b4cff]" />
          Low Stock Alerts
        </CardTitle>
        <p className="text-xs text-muted-foreground">Top 10 by urgency</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockItems.length > 0 ? lowStockItems.slice(0, 10).map(item => {
              const target = item.reorderLevel ?? 0;
              const percentage = target > 0 ? Math.min(100, Math.round((item.quantity / target) * 100)) : 0;
              const isCritical = target > 0 && item.quantity <= Math.max(1, Math.floor(target * 0.25));
              const isWarning = !isCritical && target > 0 && item.quantity <= Math.max(1, Math.floor(target * 0.5));
              const badgeVariant = isCritical ? 'destructive' : isWarning ? 'secondary' : 'default';

              return (
                <TableRow key={item.id} className={isCritical ? 'bg-red-50/60 hover:bg-red-50' : isWarning ? 'bg-[#e8eeff] hover:bg-[#dfe6ff]' : 'hover:bg-muted/30'}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className={isCritical ? 'w-2 h-2 rounded-full bg-red-500 inline-block' : isWarning ? 'w-2 h-2 rounded-full bg-[#5b7cfa] inline-block' : 'w-2 h-2 rounded-full bg-[#9db2ff] inline-block'} />
                      <span>{item.name}</span>
                      <Badge className={badgeVariant === 'destructive' ? 'bg-red-500 text-white border-none' : badgeVariant === 'secondary' ? 'bg-[#d5defb] text-[#0b2e9c] border-none' : 'bg-[#e8eeff] text-[#0b2e9c] border-none'}>
                        {isCritical ? 'Critical' : isWarning ? 'Low' : 'OK'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className={isCritical ? 'text-red-500 font-mono' : 'text-[#0b2e9c] font-mono'}>{item.quantity}{target ? ` / ${target}` : ''}</span>
                      {target ? (
                        <Progress value={percentage} className="w-36 bg-[#d5defb]" indicatorClassName={isCritical ? 'bg-red-500' : isWarning ? 'bg-[#5b7cfa]' : 'bg-[#1b4cff]'} />
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">All stock levels are healthy.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}