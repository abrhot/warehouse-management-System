import { prisma } from '@/lib/prisma'; // Corrected: Use a named import
import { Prisma } from '@prisma/client';
import { CategoriesPageContent } from '@/components/categories/CategoriesPageContent';

// Define the query arguments to reuse for type generation and the actual query
const categoryWithProductsArgs = {
  include: {
    products: true, // Include all related products
  },
  orderBy: {
    name: 'asc', // Order categories alphabetically
  }
} satisfies Prisma.CategoryFindManyArgs;

// Generate the specific type from the query for type safety
export type CategoryWithProducts = Prisma.CategoryGetPayload<typeof categoryWithProductsArgs>;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany(categoryWithProductsArgs);

  // Calculate total products for the header card
  const totalProducts = categories.reduce((sum, cat) => sum + cat.products.length, 0);

  // Serialize date and decimal fields before passing to the client component
  const serializableCategories = categories.map(category => ({
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    // We also need to serialize fields in the nested products array
    products: category.products.map(product => ({
        ...product,
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

