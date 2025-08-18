// src/components/categories/CategoriesPageContent.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { CategoriesHeader } from './CategoriesHeader';
import { CategoryList } from './CategoryList';
import { AddCategoryModal } from './AddCategoryModal';
import { CategoryWithCount } from '@/app/(main)/categories/page';

export function CategoriesPageContent({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategory = async (name: string, description: string) => {
    try {
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to add category');
        }

        const newCategory = await res.json();
        // Manually add the '_count' property for consistency
        const newCategoryWithCount = { ...newCategory, _count: { products: 0 } };

        setCategories(prev => [...prev, newCategoryWithCount].sort((a, b) => a.name.localeCompare(b.name)));
        toast.success('Category added successfully!');
        setIsModalOpen(false);
    } catch (error: any) {
        toast.error(error.message);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  return (
    <div className="flex flex-1 justify-center bg-[#fafbf8] py-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl flex flex-col space-y-6">
        <CategoriesHeader
          onSearchChange={setSearchTerm}
          onAddCategory={() => setIsModalOpen(true)}
        />
        <CategoryList categories={filteredCategories} />
        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddCategory={handleAddCategory}
        />
      </div>
    </div>
  );
}
