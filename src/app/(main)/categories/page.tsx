import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { CategoriesPageContent, CategoryWithProducts } from '@/components/categories/CategoriesPageContent';

// Query args
const categoryWithProductsArgs = {
  include: {
    products: true,
  },
  orderBy: {
    name: 'asc',
  },
} satisfies Prisma.CategoryFindManyArgs;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany(categoryWithProductsArgs);

  const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);

  const serializableCategories: CategoryWithProducts[] = categories.map(category => ({
    id: category.id.toString(),
    name: category.name,
    description: category.description,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    products: category.products.map(product => ({
      id: product.id.toString(),
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice?.toString() || null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    })),
  }));

  return (
    <CategoriesPageContent
      categories={serializableCategories}
      totalProducts={totalProducts}
    />
  );
}
