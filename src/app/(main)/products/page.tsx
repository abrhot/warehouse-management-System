import { ProductsPageContent } from '@/components/products/ProductsPageContent';
// Corrected: Use a named import for prisma
import prisma from '@/lib/prisma';
// Corrected: Import Prisma types directly from the client
import { Prisma } from '@prisma/client';

// Define the query arguments in a variable to reuse them for type generation
const stockItemWithRelationsArgs = {
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
} satisfies Prisma.StockItemFindManyArgs;

// Use Prisma's generated types to create a precise type for your data.
// This automatically updates if you change the query above.
export type StockItemWithRelations = Prisma.StockItemGetPayload<typeof stockItemWithRelationsArgs>;

export default async function ProductsPage() {
  // The findMany call now uses the args object
  const stockItems = await prisma.stockItem.findMany(stockItemWithRelationsArgs);

  // Serialize the data for the client component. Your logic here is correct.
  // Using .map() is necessary to convert Decimal types to strings for serialization.
  const serializableItems = stockItems.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString(), // Serialize Date objects
    updatedAt: item.updatedAt.toISOString(),
    product: {
      ...item.product,
      costPrice: item.product.costPrice.toString(), // Serialize Decimal
      sellingPrice: item.product.sellingPrice?.toString() || null, // Serialize Decimal
      createdAt: item.product.createdAt.toISOString(),
      updatedAt: item.product.updatedAt.toISOString(),
      category: {
        ...item.product.category,
        createdAt: item.product.category.createdAt.toISOString(),
        updatedAt: item.product.category.updatedAt.toISOString(),
      },
      supplier: item.product.supplier ? {
        ...item.product.supplier,
        createdAt: item.product.supplier.createdAt.toISOString(),
        updatedAt: item.product.supplier.updatedAt.toISOString(),
      } : null,
    }
  }));

  return <ProductsPageContent initialItems={serializableItems} />;
}

