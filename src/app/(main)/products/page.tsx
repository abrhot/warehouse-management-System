// src/app/(main)/products/page.tsx
import { ProductsPageContent } from '@/components/products/ProductsPageContent';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define query args for Prisma
const stockItemWithRelationsArgs = {
  include: {
    product: {
      include: {
        category: true,
        supplier: true, // supplier included, but no timestamps assumed
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
} satisfies Prisma.StockItemFindManyArgs;

// Create precise type for stock items
export type StockItemWithRelations = Prisma.StockItemGetPayload<typeof stockItemWithRelationsArgs>;

export default async function ProductsPage() {
  // Fetch stock items
  const stockItems = await prisma.stockItem.findMany(stockItemWithRelationsArgs);

  // Serialize for client component (convert Dates and Decimals to strings)
  const serializableItems = stockItems.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    product: {
      ...item.product,
      costPrice: item.product.costPrice.toString(),
      sellingPrice: item.product.sellingPrice?.toString() || null,
      createdAt: item.product.createdAt.toISOString(),
      updatedAt: item.product.updatedAt.toISOString(),
      category: {
        ...item.product.category,
        createdAt: item.product.category.createdAt.toISOString(),
        updatedAt: item.product.category.updatedAt.toISOString(),
      },
      supplier: item.product.supplier
        ? {
            ...item.product.supplier,
            // Remove createdAt/updatedAt because your schema doesn't have them
          }
        : null,
    },
  }));

  // Render client component with serialized data
  return <ProductsPageContent initialItems={serializableItems} />;
}
