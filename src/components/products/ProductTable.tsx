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
import { Input } from '@/components/ui/input';

interface ProductTableProps {
  products: ProductWithRelations[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  searchTerm,
  onSearchChange,
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
      {/* Search Bar */}
      <div className="flex justify-end">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Product Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenSheet(product, 'IN')}>
                          Stock In
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenSheet(product, 'OUT')}>
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
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
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