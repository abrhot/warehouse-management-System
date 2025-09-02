// src/components/dashboard/LowStockSection.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TriangleAlert, ShieldAlert, ShieldX, PackageCheck, ChevronDown } from 'lucide-react';
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

// --- Row Sub-component ---
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
      rowClass: 'bg-red-500/10 hover:bg-red-500/20',
      progressClass: 'bg-red-500',
      textClass: 'text-red-600 dark:text-red-400',
    },
    warning: {
      icon: <ShieldAlert className="h-5 w-5 text-amber-500 flex-shrink-0" />,
      badgeText: 'Low',
      badgeVariant: 'secondary' as const,
      rowClass: 'bg-amber-500/10 hover:bg-amber-500/20',
      progressClass: 'bg-amber-500',
      textClass: 'text-amber-600 dark:text-amber-400',
    },
    ok: { /* ... */ },
  };
  const config = statusConfig[status] || statusConfig.ok;

  return (
    <TableRow className={cn('transition-colors border-none', config.rowClass)}>
      {/* ... TableCell implementation remains the same */}
    </TableRow>
  );
}

// --- Main Component (Updated) ---
export function LowStockSection({ lowStockItems }: LowStockSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <Card className="shadow-sm bg-amber-50/40 dark:bg-amber-950/20 border-amber-500/20">
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="flex flex-row items-center justify-between p-4 cursor-pointer">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TriangleAlert className="h-5 w-5 text-amber-500" />
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
            <CardContent className="p-0 border-t border-amber-500/20">
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    {lowStockItems.length > 0 ? (
                      lowStockItems
                        .slice(0, DISPLAY_ITEM_LIMIT)
                        .map(item => <LowStockItemRow key={item.id} item={item} />)
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="h-36 text-center">
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