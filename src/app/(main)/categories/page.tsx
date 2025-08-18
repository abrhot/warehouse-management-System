// src/app/(main)/categories/page.tsx
import { CategoriesPageContent } from '@/components/categories/CategoriesPageContent';
import prisma from '@/lib/prisma';
import { Category } from '@/generated/prisma';

export type CategoryWithCount = Category & {
  _count: {
    products: number;
  };
};

export default async function CategoriesPage() {
  const categories: CategoryWithCount[] = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return <CategoriesPageContent initialCategories={categories} />;
}
