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
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead className="w-[100px] text-black">SKU</TableHead>
              <TableHead className="text-black">Name</TableHead>
              <TableHead className="text-black">Category</TableHead>
              <TableHead className="text-black">Quantity</TableHead>
              <TableHead className="text-right text-black">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-blue-500">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="border-gray-200">
                  <TableCell className="text-blue-500">{product.sku}</TableCell>
                  <TableCell className="font-medium text-black">{product.name}</TableCell>
                  <TableCell className="text-blue-500">{product.category.name}</TableCell>
                  <TableCell className="font-bold text-black">{product.quantity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4 text-black" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem onClick={() => handleOpenSheet(product, 'IN')} className="text-black hover:bg-gray-100 cursor-pointer">
                          Stock In
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenSheet(product, 'OUT')} className="text-black hover:bg-gray-100 cursor-pointer">
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
        <SheetContent side="right" className="bg-white text-black border-gray-200">
          <SheetHeader>
            <SheetTitle className="text-black">
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