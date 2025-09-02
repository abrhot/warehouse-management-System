// src/components/dashboard/LowStockSection.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TriangleAlert, ShieldAlert, ShieldX, PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assumes a utility like clsx or tailwind-merge

// --- Type Definitions ---
interface LowStockItem {
  id: string;
  name: string;
  quantity: number;
  reorderLevel?: number;
}

interface LowStockSectionProps {
  lowStockItems: LowStockItem[];
}

// --- Constants for easier configuration ---
const CRITICAL_THRESHOLD = 0.25;
const WARNING_THRESHOLD = 0.5;
const DISPLAY_ITEM_LIMIT = 10;

// --- Helper to determine stock status ---
type StockStatus = 'critical' | 'warning' | 'ok';

const getStockStatus = (quantity: number, reorderLevel?: number): StockStatus => {
  if (!reorderLevel || reorderLevel <= 0) return 'ok';
  const ratio = quantity / reorderLevel;
  if (ratio <= CRITICAL_THRESHOLD) return 'critical';
  if (ratio <= WARNING_THRESHOLD) return 'warning';
  return 'ok';
};


// --- Row Sub-component for better separation of concerns ---
function LowStockItemRow({ item }: { item: LowStockItem }) {
  const status = getStockStatus(item.quantity, item.reorderLevel);
  const percentage = item.reorderLevel && item.reorderLevel > 0
    ? Math.min(100, Math.round((item.quantity / item.reorderLevel) * 100))
    : 0;

  const statusConfig = {
    critical: {
      icon: <ShieldX className="h-5 w-5 text-red-500 flex-shrink-0" />,
      badgeText: 'Critical',
      badgeVariant: 'destructive' as const,
      rowClass: 'bg-red-50/70 hover:bg-red-100/60',
      progressClass: 'bg-red-500',
      textClass: 'text-red-600',
    },
    warning: {
      icon: <ShieldAlert className="h-5 w-5 text-amber-500 flex-shrink-0" />,
      badgeText: 'Low',
      badgeVariant: 'secondary' as const,
      rowClass: 'bg-amber-50/70 hover:bg-amber-100/60',
      progressClass: 'bg-amber-500',
      textClass: 'text-amber-600',
    },
    ok: {
      icon: null,
      badgeText: 'OK',
      badgeVariant: 'outline' as const,
      rowClass: '',
      progressClass: 'bg-sky-500',
      textClass: 'text-muted-foreground',
    },
  };

  const config = statusConfig[status];

  return (
    <TableRow className={cn('transition-colors', config.rowClass)}>
      <TableCell className="p-3">
        <div className="flex items-center gap-3">
          {config.icon}
          <div className="flex flex-col">
            <span className="font-medium text-sm leading-tight">{item.name}</span>
            <Badge variant={config.badgeVariant} className="w-fit h-5 mt-1 px-1.5 text-xs font-normal">
              {config.badgeText}
            </Badge>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right p-3">
        <div className="flex flex-col items-end gap-1.5">
          <span className={cn('font-mono font-semibold text-sm', config.textClass)}>
            {item.quantity} {item.reorderLevel ? `/ ${item.reorderLevel}` : ''}
          </span>
          {item.reorderLevel ? (
            <Progress
              value={percentage}
              className="h-2 w-24 sm:w-32 bg-muted/40"
              indicatorClassName={config.progressClass}
            />
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

// --- Main Component ---
export function LowStockSection({ lowStockItems }: LowStockSectionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <TriangleAlert className="h-5 w-5 text-amber-500" />
          Low Stock Alerts
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Top {DISPLAY_ITEM_LIMIT} items needing attention, sorted by urgency.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Product</TableHead>
                <TableHead className="text-right pr-4">Stock Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.length > 0 ? (
                lowStockItems
                  .slice(0, DISPLAY_ITEM_LIMIT)
                  .map(item => <LowStockItemRow key={item.id} item={item} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <PackageCheck className="h-10 w-10 text-green-500" />
                      <p className="font-medium text-primary">All Good!</p>
                      <p className="text-sm">No items are currently low on stock.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}