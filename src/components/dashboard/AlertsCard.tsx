'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, History, Package } from 'lucide-react';
// Define minimal local types for component props
type Product = { id: string; name: string; quantity: number; reorderLevel?: number };
type StockRequest = { id: string; status: string; type: string };
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// We assume the Product type has these properties, or they can be adapted.
interface LowStockItem extends Product {
  reorderLevel?: number;
}

export function AlertsCard({ lowStock, pendingRequests }: { lowStock: LowStockItem[], pendingRequests: StockRequest[] }) {
  return (
    <Card className="lg:col-span-1 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Alerts & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Pending Requests Section */}
        <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-700">Pending Requests</span>
          </div>
          <span className="font-bold text-lg text-blue-600">{pendingRequests.length}</span>
        </div>

        {/* Low Stock Section - Updated Design */}
        <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
                 <Package className="w-5 h-5 text-red-500" />
                 <h3 className="font-medium text-gray-700">Low Stock Items</h3>
                 <p className="text-xs text-muted-foreground">(Top 10 by urgency)</p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lowStock.length > 0 ? lowStock.slice(0, 10).map(item => {
                        const target = item.reorderLevel ?? 0;
                        const percentage = target > 0 ? Math.min(100, Math.round((item.quantity / target) * 100)) : 0;
                        const isCritical = target > 0 && item.quantity <= Math.max(1, Math.floor(target * 0.25));
                        const isWarning = !isCritical && target > 0 && item.quantity <= Math.max(1, Math.floor(target * 0.5));
                        const badgeVariant = isCritical ? 'destructive' : isWarning ? 'secondary' : 'default';

                        return (
                            <TableRow key={item.id} className={isCritical ? 'bg-red-50/60 hover:bg-red-50' : isWarning ? 'bg-amber-50/60 hover:bg-amber-50' : 'hover:bg-muted/30'}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className={isCritical ? 'w-2 h-2 rounded-full bg-red-500 inline-block' : isWarning ? 'w-2 h-2 rounded-full bg-amber-400 inline-block' : 'w-2 h-2 rounded-full bg-gray-400 inline-block'} />
                                        <span>{item.name}</span>
                                        <Badge variant={badgeVariant}>
                                            {isCritical ? 'Critical' : isWarning ? 'Low' : 'OK'}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={isCritical ? 'text-red-500 font-mono' : 'text-gray-700 font-mono'}>
                                            {item.quantity}{target ? ` / ${target}` : ''}
                                        </span>
                                        {target > 0 && (
                                            <Progress value={percentage} className="w-24 bg-gray-200" indicatorClassName={isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-green-500'} />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    }) : (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground py-8">All stock levels are healthy.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AlertsCard;

