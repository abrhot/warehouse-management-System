// src/components/categories/CategoriesHeader.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface CategoriesHeaderProps {
  onSearchChange: (term: string) => void;
  onAddCategory: () => void;
}

export function CategoriesHeader({ onSearchChange, onAddCategory }: CategoriesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search categories..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs bg-white"
        />
        <Button 
            className="bg-white text-black border border-gray-300 hover:bg-blue-500 hover:text-white flex items-center gap-2"
            onClick={onAddCategory}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>
    </div>
  );
}
