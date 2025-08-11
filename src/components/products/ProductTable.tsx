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
import { ProductWithRelations } from '@/app/(main)/products/page';
import { StockForm } from './StockForm';

interface ProductTableProps {
  products: ProductWithRelations[];
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithRelations | null>(null);
  const [stockType, setStockType] = useState<'IN' | 'OUT'>('IN');

  const handleOpenSheet = (product: ProductWithRelations, type: 'IN' | 'OUT') => {
    setSelectedProduct(product);
    setStockType(type);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border border-[#dae6d1]">
        <Table>
          <TableHeader className="bg-[#f0f9ed]">
            <TableRow>
              <TableHead className="w-[100px] text-[#141b0e]">SKU</TableHead>
              <TableHead className="text-[#141b0e]">Name</TableHead>
              <TableHead className="text-[#141b0e]">Category</TableHead>
              <TableHead className="text-[#141b0e]">Quantity</TableHead>
              <TableHead className="text-right text-[#141b0e]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#fafbf8]">
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-[#6f9550]">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-[#6f9550]">{product.sku}</TableCell>
                  <TableCell className="font-medium text-[#141b0e]">{product.name}</TableCell>
                  <TableCell className="text-[#6f9550]">{product.category.name}</TableCell>
                  <TableCell className="font-bold text-[#141b0e]">{product.quantity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 text-[#141b0e]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#edf3e8]">
                        <DropdownMenuItem onClick={() => handleOpenSheet(product, 'IN')} className="text-[#141b0e] hover:bg-[#dae6d1] cursor-pointer">
                          Stock In
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenSheet(product, 'OUT')} className="text-[#141b0e] hover:bg-[#dae6d1] cursor-pointer">
                          Stock Out
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
        <SheetContent side="right" className="bg-[#f0fdf4] text-[#141b0e] border-[#dae6d1]">
          <SheetHeader>
            <SheetTitle className="text-[#141b0e]">
              {stockType === 'IN' ? 'Stock In' : 'Stock Out'} for {selectedProduct?.name}
            </SheetTitle>
          </SheetHeader>
          {selectedProduct && (
            <StockForm
              product={selectedProduct}
              type={stockType}
              onClose={() => setIsSheetOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};