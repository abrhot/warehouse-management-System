import { PageHeader } from '@/components/ui/PageHeader';
import { ProductsPageContent } from '@/components/products/ProductsPageContent';
import prisma from '@/lib/prisma';
import { Product, Category, Supplier } from '@/generated/prisma';

export type ProductWithRelations = Product & { category: Category; supplier: Supplier | null };

export default async function ProductsPage() {
  const products: ProductWithRelations[] = await prisma.product.findMany({
    include: {
      category: true,
      supplier: true,
    },
  });

  // Map over the products and convert the Decimal types to strings
  const serializableProducts = products.map(product => ({
    ...product,
    costPrice: product.costPrice.toString(),
    sellingPrice: product.sellingPrice?.toString() || null,
  }));

  return (
    <div className="flex flex-col gap-4 p-8">
      <PageHeader
        title="Products"
        description="Manage all products and their stock levels."
      />
      <ProductsPageContent initialProducts={serializableProducts} />
    </div>
  );
}