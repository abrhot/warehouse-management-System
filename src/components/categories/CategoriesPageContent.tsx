'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Package, ChevronDown, ChevronRight, Boxes, Pencil, Trash2 } from 'lucide-react';
import { AddCategoryModal } from './AddCategoryModal';
import { CategoryWithProducts, SerializableProduct } from '../../app/(main)/categories/page';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Placeholder for your actual API call functions
async function addCategoryAPI(name: string, description: string) {
  const response = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description }) });
  if (!response.ok) throw new Error('Failed to create category.');
}
async function editCategoryAPI(id: string, name: string, description: string) {
  const response = await fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description }) });
  if (!response.ok) throw new Error('Failed to update category.');
}
async function deleteCategoryAPI(id: string) {
  const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete category.');
}

// Edit Category Modal Component
function EditCategoryModal({ isOpen, onClose, onEditCategory, category }: { isOpen: boolean, onClose: () => void, onEditCategory: (id: string, name: string, description: string) => void, category: CategoryWithProducts | null }) {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');

  if (!category) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditCategory(category.id, name, description);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update the details for the "{category.name}" category.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function CategoriesPageContent({ categories, totalProducts }: { categories: CategoryWithProducts[], totalProducts: number }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithProducts | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const router = useRouter();

  const handleAddCategory = async (name: string, description: string) => {
    try {
      await addCategoryAPI(name, description);
      toast.success(`Category "${name}" created successfully!`);
      setIsAddModalOpen(false);
      router.refresh(); 
    } catch (error) {
      toast.error('Error creating category.');
    }
  };

  const handleEditCategory = async (id: string, name: string, description: string) => {
    try {
      await editCategoryAPI(id, name, description);
      toast.success(`Category "${name}" updated successfully!`);
      setIsEditModalOpen(false);
      setEditingCategory(null);
      router.refresh();
    } catch (error) {
      toast.error('Error updating category.');
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return;
    try {
      await deleteCategoryAPI(deletingCategoryId);
      toast.success('Category deleted successfully!');
      setDeletingCategoryId(null);
      router.refresh();
    } catch (error) {
      toast.error('Error deleting category.');
    }
  };

  const openEditModal = (category: CategoryWithProducts) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
  };

  const handleProductClick = (productId: string) => {
    router.push(`http://localhost:3000/products`);
  };

  return (
    <>
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Product Categories</h1>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-transform hover:scale-105">
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
                    <p className="text-xs text-gray-500 mt-1">Distinct groups for product organization.</p>
                </CardContent>
            </Card>
            <Card className="border-l-4 border-cyan-500 bg-gradient-to-r from-cyan-50 to-white shadow-md transition-shadow hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-cyan-800">Total Products</CardTitle>
                    <Package className="h-5 w-5 text-cyan-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-800">{totalProducts}</div>
                     <p className="text-xs text-gray-500 mt-1">Sum of all items across all categories.</p>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <>
                    <TableRow key={category.id} className="hover:bg-gray-50">
                      <TableCell className="px-4 cursor-pointer" onClick={() => toggleExpand(category.id)}>
                        {expandedCategoryId === category.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </TableCell>
                      <TableCell className="font-medium text-lg cursor-pointer" onClick={() => toggleExpand(category.id)}>{category.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{category.description || 'N/A'}</TableCell>
                      <TableCell className="text-right">{category.products.length}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditModal(category)}>
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeletingCategoryId(category.id)}>
                           <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedCategoryId === category.id && (
                      <TableRow className="bg-blue-50/50 hover:bg-blue-50/50">
                        <TableCell colSpan={5} className="p-0">
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
                                              <TableCell className="font-semibold text-sm text-gray-800">{product.name}</TableCell>
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

      <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddCategory={handleAddCategory} />
      <EditCategoryModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onEditCategory={handleEditCategory} category={editingCategory} />
      <Dialog open={!!deletingCategoryId} onOpenChange={() => setDeletingCategoryId(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>This action cannot be undone. This will permanently delete the category.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setDeletingCategoryId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteCategory}>Delete</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


