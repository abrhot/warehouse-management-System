'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { StockItemWithRelations } from '@/app/(main)/products/page';
import { StockForm } from './StockForm';

export function ProductTable({
  items,
  onSuccess,
}: {
  items: StockItemWithRelations[];
  onSuccess: () => void;
}) {
  const [selectedItem, setSelectedItem] = useState<StockItemWithRelations | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleRequestClick = (item: StockItemWithRelations) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white text-black shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-white">
            <TableHead className="text-black">Serial Number</TableHead>
            <TableHead className="text-black">Product</TableHead>
            <TableHead className="text-black">Status</TableHead>
            <TableHead className="text-right text-black">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-blue-50">
              <TableCell className="text-black">{item.serialNumber}</TableCell>
              <TableCell className="text-black">{item.product.name}</TableCell>
              <TableCell className="text-black">{item.status}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-black border border-blue-300 hover:bg-blue-400 hover:text-white hover:shadow-[0_0_8px_#7dd3fc] transition-shadow duration-200"
                  onClick={() => handleRequestClick(item)}
                >
                  Request Out
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Slide-out Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="bg-white text-black border-gray-200">
          <SheetHeader>
            <SheetTitle className="text-black">
              Request Stock Out {selectedItem ? `– ${selectedItem.product.name}` : ''}
            </SheetTitle>
          </SheetHeader>

          {selectedItem && (
            <StockForm
              item={selectedItem}
              onSuccess={() => {
                setIsSheetOpen(false);
                setSelectedItem(null);
                onSuccess();
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
