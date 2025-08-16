// src/components/products/ProductTable.tsx
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MoreHorizontal } from 'lucide-react';
import { StockItemWithRelations } from '@/app/(main)/products/page';
import { StockForm } from './StockForm';
import { Badge } from '@/components/ui/badge';

interface ProductTableProps {
  items: StockItemWithRelations[];
}

export const ProductTable: React.FC<ProductTableProps> = ({
  items,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItemWithRelations | null>(null);

  const handleOpenSheet = (item: StockItemWithRelations) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'IN_STOCK': return 'success';
        case 'RESERVED': return 'secondary';
        case 'SHIPPED': return 'destructive';
        default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead className="w-[200px] text-black">Serial Number (SKU)</TableHead>
              <TableHead className="text-black">Name</TableHead>
              <TableHead className="text-black">Category</TableHead>
              <TableHead className="text-black">Status</TableHead>
              <TableHead className="text-right text-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-blue-500">
                  No items found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} className="border-gray-200">
                  <TableCell className="text-blue-500 font-medium">{item.serialNumber}</TableCell>
                  <TableCell className="font-medium text-black">{item.product.name}</TableCell>
                  <TableCell className="text-blue-500">{item.product.category.name}</TableCell>
                  <TableCell>
                     <Badge variant={getStatusVariant(item.status)}>{item.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={item.status !== 'IN_STOCK'}>
                          <MoreHorizontal className="h-4 w-4 text-black" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem onClick={() => handleOpenSheet(item)} className="text-black hover:bg-gray-100 cursor-pointer">
                          Request Stock Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="bg-white text-black border-gray-200">
          <SheetHeader>
            <SheetTitle className="text-black">
              Request Stock Out for {selectedItem?.product.name}
            </SheetTitle>
          </SheetHeader>
          {selectedItem && (
            <StockForm
              item={selectedItem}
              onClose={() => setIsSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};