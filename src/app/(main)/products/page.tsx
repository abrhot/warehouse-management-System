// src/app/(main)/products/page.tsx
import { PageHeader } from '@/components/ui/PageHeader';
import { ProductsPageContent } from '@/components/products/ProductsPageContent';
import prisma from '@/lib/prisma';
import { Product, Category, Supplier } from '@/generated/prisma';

// Define a new type for the product data with relations
export type ProductWithRelations = Product & { category: Category; supplier: Supplier | null };

export default async function ProductsPage() {
  const products: ProductWithRelations[] = await prisma.product.findMany({
    include: {
      category: true,
      supplier: true,
    },
  });

  return (
    <div className="flex flex-col gap-4 p-8">
      <PageHeader
        title="Products"
        description="Manage all products and their stock levels."
      />
      <ProductsPageContent initialProducts={products} />
    </div>
  );
}