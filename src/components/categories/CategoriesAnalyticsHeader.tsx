// src/components/categories/CategoriesAnalyticsHeader.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CategoryWithProducts } from '@/app/(main)/categories/page';
import Link from 'next/link';
import { useState } from 'react';

interface CategoriesAnalyticsHeaderProps {
  totalProducts: number;
  categories: CategoryWithProducts[];
}

export function CategoriesAnalyticsHeader({ totalProducts, categories }: CategoriesAnalyticsHeaderProps) {
  const [filter, setFilter] = useState<'All' | 'Available' | 'Low' | 'Out'>('All');

  const filteredCategories = categories.filter(cat => {
    const totalCatQuantity = cat.products.reduce((sum, p) => sum + p.quantity, 0);
    if (filter === 'Available' && totalCatQuantity > 0) return true;
    if (filter === 'Out' && totalCatQuantity === 0) return true;
    // For 'Low', you'd need a more complex check with reorder levels
    if (filter === 'Low' && totalCatQuantity < 50) return true; // Example logic
    return filter === 'All';
  });

  return (
    <Card className="p-4 border border-gray-200 shadow-sm h-full">
      <CardHeader className="flex flex-row justify-between items-center p-0 mb-4">
        <div>
          <CardTitle className="text-4xl font-bold">
            {totalProducts}
          </CardTitle>
          <CardDescription className="text-gray-500">
            Current Stock Level
          </CardDescription>
        </div>
        <Button variant="outline" className="text-blue-600">
          <Link href="/products">View All Products</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex justify-between items-center text-sm mb-2">
          <span>Category</span>
          <div className="flex gap-1">
            <span className="text-green-600">Available</span>
            <span className="text-yellow-600">Low Stock</span>
            <span className="text-red-600">Out of Stock</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {categories.map(category => {
            const productCount = category.products.length;
            const totalCatQuantity = category.products.reduce((sum, p) => sum + p.quantity, 0);
            const progressValue = totalProducts > 0 ? (totalCatQuantity / totalProducts) * 100 : 0;
            const statusColor = totalCatQuantity === 0 ? 'bg-red-500' : totalCatQuantity < 50 ? 'bg-yellow-500' : 'bg-green-500';

            return (
              <div key={category.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="text-gray-500">{totalCatQuantity} units</span>
                </div>
                <Progress value={progressValue} className={`h-2`} indicatorClassName={statusColor} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}