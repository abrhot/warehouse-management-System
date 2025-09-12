// src/components/dashboard/LowStockSection.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TriangleAlert, ShieldAlert, ShieldX, PackageCheck, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Type Definitions ---
interface LowStockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel?: number;
}

interface LowStockSectionProps {
  lowStockItems: LowStockItem[];
}

// --- Constants ---
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

// --- Row Sub-component (Updated Colors) ---
function LowStockItemRow({ item }: { item: LowStockItem }) {
  const status = getStockStatus(item.quantity, item.reorderLevel);
  const percentage = item.reorderLevel && item.reorderLevel > 0
    ? Math.min(100, Math.round((item.quantity / item.reorderLevel) * 100))
    : 0;

  // --- NEW COLOR COMPOSITION ---
  const statusConfig = {
    critical: {
      icon: <ShieldX className="h-5 w-5 text-red-500 flex-shrink-0" />,
      badgeText: 'Critical',
      badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 border-none',
      rowClass: 'bg-red-50 dark:bg-red-950/25 hover:bg-red-100/70 dark:hover:bg-red-950/40',
      progressClass: 'bg-red-500',
      textClass: 'text-red-600 dark:text-red-400',
    },
    warning: {
      icon: <ShieldAlert className="h-5 w-5 text-blue-500 flex-shrink-0" />,
      badgeText: 'Low',
      badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-none',
      rowClass: 'bg-blue-50 dark:bg-blue-950/25 hover:bg-blue-100/70 dark:hover:bg-blue-950/40',
      progressClass: 'bg-blue-500',
      textClass: 'text-blue-600 dark:text-blue-400',
    },
    ok: {
      icon: null,
      badgeText: 'OK',
      badgeClass: '',
      rowClass: '',
      progressClass: 'bg-sky-500',
      textClass: 'text-muted-foreground',
    },
  };

  const config = statusConfig[status];

  return (
    <TableRow className={cn('transition-colors border-t', config.rowClass)}>
      <TableCell className="p-3">
        <div className="flex items-center gap-3">
          {config.icon}
          <div className="flex flex-col">
            <span className="font-medium text-sm leading-tight">{item.name}</span>
            <Badge variant={status === 'critical' ? 'destructive' : 'secondary'} className={cn('w-fit h-5 mt-1 px-1.5 text-xs font-normal', config.badgeClass)}>
              {config.badgeText}
            </Badge>
          </div>
        </div>
      </TableCell>
      <TableCell className="p-3">
          <Badge variant="outline" className="font-normal">{item.category}</Badge>
      </TableCell>
      <TableCell className="text-right p-3">
        <div className="flex flex-col items-end gap-1.5">
          <span className={cn('font-mono font-semibold text-sm', config.textClass)}>
            {item.quantity} {item.reorderLevel ? `/ ${item.reorderLevel}` : ''}
          </span>
          {item.reorderLevel ? (
            <Progress
              value={percentage}
              className="h-2 w-24 sm:w-32 bg-slate-200 dark:bg-slate-700"
              indicatorClassName={config.progressClass}
            />
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

// --- Main Component (Updated Colors) ---
export function LowStockSection({ lowStockItems }: LowStockSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      {/* Card now uses a standard neutral background */}
      <Card className="shadow-sm">
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="flex flex-row items-center justify-between p-4 cursor-pointer">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  {/* Icon is now blue to match the new "warning" theme */}
                  <TriangleAlert className="h-5 w-5 text-blue-500" />
                  Low Stock Alerts
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {lowStockItems.length} items need attention.
              </p>
            </div>
            <ChevronDown
              className={cn(
                'h-5 w-5 text-muted-foreground transition-transform duration-300 flex-shrink-0',
                isOpen && 'rotate-180'
              )}
            />
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <CardContent className="p-0 border-t">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Product</TableHead>
                      <TableHead>Category</TableHead>
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
                        <TableCell colSpan={3} className="h-36 text-center">
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}