// src/components/categories/CategoryCard.tsx
'use client';
import { CategoryWithCount } from '@/app/(main)/categories/page';
import { Tag, Package } from 'lucide-react';

export function CategoryCard({ category }: { category: CategoryWithCount }) {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
                <Tag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description || 'No description'}</p>
            </div>
        </div>
      </div>
      <div className="mt-4 border-t pt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Products</span>
        </div>
        <span className="font-bold text-blue-600">{category._count.products}</span>
      </div>
    </div>
  );
}
