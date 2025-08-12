// src/components/dashboard/CategoriesSidebar.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CategoryData { id: number; name: string; products: { id: string; name: string; quantity: number; }[]; }

export function CategoriesSidebar({ categories }: { categories: CategoryData[] }) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardHeader><CardTitle>Categories & Stock</CardTitle></CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {categories.map(category => (
              <AccordionItem value={`item-${category.id}`} key={category.id}>
                <AccordionTrigger>{category.name}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pl-2 text-sm">
                    {category.products.map(product => (
                      <li key={product.id} className="flex justify-between items-center">
                        <span className="text-muted-foreground truncate pr-2">{product.name}</span>
                        <span className="font-mono text-xs bg-muted p-1 rounded-md">{product.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}