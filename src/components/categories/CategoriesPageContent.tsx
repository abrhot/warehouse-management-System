// src/components/categories/CategoriesPageContent.tsx
'use client';

import { PageHeader } from '@/components/ui/PageHeader';
import { CategoriesAnalyticsHeader } from './CategoriesAnalyticsHeader';
import { CategoriesProductAnalytics } from './CategoriesProductAnalytics';
import { CategoryProductsExpander } from './CategoryProductsExpander';
import { CategoryWithProducts } from '@/app/(main)/categories/page';

interface CategoriesPageContentProps {
  categories: CategoryWithProducts[];
  totalProducts: number;
}

export function CategoriesPageContent({ categories, totalProducts }: CategoriesPageContentProps) {
  return (
    <div className="flex flex-col gap-8 p-8 bg-white min-h-screen">
      <PageHeader
        title="Category Analytics"
        description="View product distribution and stock levels by category."
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 lg:max-w-md">
          <CategoriesAnalyticsHeader
            totalProducts={totalProducts}
            categories={categories}
          />
        </div>
        <div className="flex-1">
          <CategoriesProductAnalytics categories={categories} />
        </div>
      </div>

      <CategoryProductsExpander categories={categories} />
    </div>
  );
}