// src/app/(main)/products/page.tsx
import { ProductsPageContent } from '@/components/products/ProductsPageContent';
import prisma from '@/lib/prisma';
import { StockItem, Product, Category, Supplier } from '@/generated/prisma';

export type StockItemWithRelations = StockItem & {
  product: Product & {
    category: Category;
    supplier: Supplier | null;
  };
};

export default async function ProductsPage() {
  const stockItems: StockItemWithRelations[] = await prisma.stockItem.findMany({
    include: {
      product: {
        include: {
          category: true,
          supplier: true,
        },
      },
    },
    orderBy: {
        createdAt: 'desc',
    }
  });

  // Serialize the data for the client component
  const serializableItems = stockItems.map(item => ({
    ...item,
    product: {
      ...item.product,
      costPrice: item.product.costPrice.toString(),
      sellingPrice: item.product.sellingPrice?.toString() || null,
    }
  }));

  return <ProductsPageContent initialItems={serializableItems} />;
}