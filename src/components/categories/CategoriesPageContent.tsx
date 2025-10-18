'use client';

import { useState, Fragment } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewCategoryForm } from './NewCategoryForm';
import { useAuth } from '@/context/AuthContext';
import {
  PlusCircle,
  Package,
  ChevronDown,
  ChevronRight,
  Boxes,
  Pencil,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// ✅ Types
export type SerializableProduct = {
  id: string;
  name: string;
  sku: string | null;
  quantity: number;
  costPrice: string;
  sellingPrice: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CategoryWithProducts = {
  id: string;
  name: string;
  description: string | null;
  products: SerializableProduct[];
  createdAt: string;
  updatedAt: string;
};

// ✅ Component
export function CategoriesPageContent({
  categories,
  totalProducts,
}: {
  categories: CategoryWithProducts[];
  totalProducts: number;
}) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Categories</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total Products: {totalProducts}
              </p>
            </div>
            <Button
              onClick={() => setShowNewCategoryForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories available.
            </p>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => toggleExpand(category.id)}
                    >
                      {expanded === category.id ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2" />
                      )}
                      <h2 className="text-lg font-semibold">
                        {category.name}
                      </h2>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({category.products.length} products)
                      </span>
                    </div>
                  </div>

                  {expanded === category.id && (
                    <div className="mt-4">
                      {category.products.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No products in this category.
                        </p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>Cost Price</TableHead>
                              <TableHead>Selling Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {category.products.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.sku || '-'}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>{product.costPrice}</TableCell>
                                <TableCell>
                                  {product.sellingPrice || '-'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <NewCategoryForm
        open={showNewCategoryForm}
        onOpenChange={setShowNewCategoryForm}
        onSuccess={() => window.location.reload()}
        userRole={user?.role}
      />
    </div>
  );
}
