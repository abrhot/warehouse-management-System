// src/components/reports/CategoryProductsExpander.tsx
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CategoryWithProducts } from '@/app/(main)/categories/page';
import React from 'react';

interface CategoryProductsExpanderProps {
  categories: CategoryWithProducts[];
}

export function CategoryProductsExpander({ categories }: CategoryProductsExpanderProps) {
  return (
    <Card className="p-4 border border-gray-200 shadow-sm">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl font-bold">Products by Category</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {categories.map((category) => (
            <AccordionItem key={category.id} value={category.name} className="border-b last:border-b-0">
              <AccordionTrigger className="hover:bg-gray-50 px-4 py-3 rounded-md transition-colors duration-150">
                <div className="flex justify-between items-center w-full pr-8">
                  <span className="text-lg font-semibold text-gray-800">{category.name}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                    {category.products.length} Products
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-gray-50 p-4">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.products.map((product) => (
                    <li key={product.id} className="rounded-lg border border-gray-200 p-3 bg-white shadow-sm">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span>{product.name}</span>
                        <span className="text-gray-500">Qty: {product.quantity}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}