'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Package, ChevronDown, ChevronRight, Boxes } from 'lucide-react';
import { AddCategoryModal } from './AddCategoryModal';
import { CategoryWithProducts, SerializableProduct } from '../../app/(main)/categories/page';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Placeholder for your actual API call function to add a category.
async function addCategoryAPI(name: string, description: string) {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) throw new Error('Failed to create category.');
}

interface CategoriesPageContentProps {
  categories: CategoryWithProducts[];
  totalProducts: number;
}

export function CategoriesPageContent({ categories, totalProducts }: CategoriesPageContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddCategory = async (name: string, description: string) => {
    try {
      await addCategoryAPI(name, description);
      toast.success(`Category "${name}" created successfully!`);
      setIsModalOpen(false);
      router.refresh(); 
    } catch (error) {
      toast.error('Error creating category. Please try again.');
      console.error(error);
    }
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
  };

  const handleProductClick = (productId: string) => {
    // This will navigate to the main products page.
    router.push(`http://localhost:3000/products`);
  };

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Product Categories</h1>
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-transform hover:scale-105">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Category
          </Button>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-md transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800">Total Categories</CardTitle>
                    <Boxes className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-800">{categories.length}</div>
                    <p className="text-xs text-gray-500 mt-1">
                        Distinct groups for product organization.
                    </p>
                </CardContent>
            </Card>
            <Card className="border-l-4 border-cyan-500 bg-gradient-to-r from-cyan-50 to-white shadow-md transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-cyan-800">Total Products</CardTitle>
                    <Package className="h-5 w-5 text-cyan-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-800">{totalProducts}</div>
                     <p className="text-xs text-gray-500 mt-1">
                        Sum of all items across all categories.
                    </p>
                </CardContent>
            </Card>
        </div>

        <Card className="overflow-hidden shadow-md">
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Product Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                      No categories found. Click "Add New Category" to get started.
                    </TableCell>
                  </TableRow>
                )}
                {categories.map((category) => (
                  <>
                    <TableRow key={category.id} onClick={() => toggleExpand(category.id)} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="px-4">
                        {expandedCategoryId === category.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{category.description || 'N/A'}</TableCell>
                      <TableCell className="text-right">{category.products.length}</TableCell>
                    </TableRow>
                    {expandedCategoryId === category.id && (
                      <TableRow className="bg-blue-50/50 hover:bg-blue-50/50">
                        <TableCell colSpan={4} className="p-0">
                           <div className="p-4">
                            <h4 className="font-semibold mb-3 text-sm text-blue-900">Products (Showing up to 5)</h4>
                             {category.products.length > 0 ? (
                                <Table>
                                  <TableHeader>
                                      <TableRow>
                                          <TableHead className="w-[60%]">Product Name</TableHead>
                                          <TableHead>SKU</TableHead>
                                      </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                      {category.products.slice(0, 5).map((product: SerializableProduct) => (
                                          <TableRow key={product.id} onClick={() => handleProductClick(product.id)} className="cursor-pointer hover:bg-blue-100/70">
                                              <TableCell className="font-semibold text-base text-gray-800">{product.name}</TableCell>
                                              <TableCell className="text-sm text-gray-600 font-mono">{product.sku}</TableCell>
                                          </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <p className="text-center text-sm text-gray-500 py-4">No products in this category.</p>
                              )}
                           </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </>
  );
}


