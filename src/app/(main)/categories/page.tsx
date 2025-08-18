// src/app/(main)/categories/page.tsx
import prisma from '@/lib/prisma';
import { Category, Product } from '@/generated/prisma';
import { CategoriesPageContent } from '@/components/categories/CategoriesPageContent';

export type CategoryWithProducts = Category & { products: Product[] };

export default async function CategoriesPage() {
  const categories: CategoryWithProducts[] = await prisma.category.findMany({
    include: {
      products: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  // Calculate total products for the header card
  const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);

  // Serialize Decimal types for client-side use
  const serializableCategories = categories.map(category => ({
    ...category,
    products: category.products.map(product => ({
      ...product,
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice?.toString() || null,
    })),
  }));

  return (
    <CategoriesPageContent 
      categories={serializableCategories} 
      totalProducts={totalProducts} 
    />
  );
}