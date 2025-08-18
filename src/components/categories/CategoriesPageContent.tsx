// src/components/categories/CategoriesPageContent.tsx
'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { CategoriesProductAnalytics } from './CategoriesProductAnalytics';
import { CategoryProductsExpander } from './CategoryProductsExpander';
import { CategoryWithProducts } from '@/app/(main)/categories/page';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddCategoryModal } from './AddCategoryModal';

interface CategoriesPageContentProps {
  categories: CategoryWithProducts[];
  totalProducts: number;
}

export function CategoriesPageContent({ categories, totalProducts }: CategoriesPageContentProps) {
  const [localCategories, setLocalCategories] = useState<CategoryWithProducts[]>(categories);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(data?.user?.role === 'ADMIN');
        }
      } catch (e) {
        // ignore
      }
    };
    loadSession();
  }, []);

  const handleAddCategory = async (name: string, description: string) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) {
      alert('Not authorized or failed to create category');
      return;
    }
    const created = await res.json();
    setLocalCategories(prev => [
      ...prev,
      { ...created, products: [] },
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white min-h-screen">
      <PageHeader
        title="Category Analytics"
        description="View product distribution and stock levels by category."
      />

      {isAdmin && (
        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white hover:bg-blue-700">
            New Category
          </Button>
        </div>
      )}

      {/* Top analytics row: three charts (pie left, line middle, bar right) */}
      <CategoriesProductAnalytics categories={localCategories} />

      {/* Expandable categories list with product samples */}
      <CategoryProductsExpander categories={localCategories} />

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
}