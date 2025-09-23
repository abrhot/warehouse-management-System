import { ProductsPageContent } from '@/components/products/ProductsPageContent';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Query arguments with relations, unchanged
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
  },
} satisfies Prisma.StockItemFindManyArgs;

// This is the full type Prisma returns from the query
export type StockItemWithRelations = Prisma.StockItemGetPayload<
  typeof stockItemWithRelationsArgs
>;

// This is the type that is safe to pass to a Client Component
export type SerializableStockItem = Omit<
  StockItemWithRelations,
  'createdAt' | 'updatedAt' | 'product'
> & {
  createdAt: string;
  updatedAt: string;
  product: Omit<
    StockItemWithRelations['product'],
    'createdAt' | 'updatedAt' | 'costPrice' | 'sellingPrice' | 'category'
  > & {
    costPrice: string;
    sellingPrice: string | null;
    createdAt: string;
    updatedAt: string;
    category: Omit<
      StockItemWithRelations['product']['category'],
      'createdAt' | 'updatedAt'
    > & {
      createdAt: string;
      updatedAt: string;
    };
  };
};

// Helper function to make data safe for the client
function makeSerializable(item: StockItemWithRelations): SerializableStockItem {
  return {
    ...item,
    costPrice: item.product.costPrice.toString(), // Convert Decimal to string
    sellingPrice: item.product.sellingPrice?.toString() ?? null,
    createdAt: item.createdAt.toISOString(), // Convert Date to string
    updatedAt: item.updatedAt.toISOString(),
    product: {
      ...item.product,
      costPrice: item.product.costPrice.toString(),
      sellingPrice: item.product.sellingPrice?.toString() ?? null,
      createdAt: item.product.createdAt.toISOString(),
      updatedAt: item.product.updatedAt.toISOString(),
      category: {
        ...item.product.category,
        createdAt: item.product.category.createdAt.toISOString(),
        updatedAt: item.product.category.updatedAt.toISOString(),
      },
    },
  };
}


export default async function ProductsPage() {
  const stockItems = await prisma.stockItem.findMany(stockItemWithRelationsArgs);

  // Serialize the data before sending it to the client component
  const serializableItems: SerializableStockItem[] = stockItems.map(makeSerializable);

  return <ProductsPageContent initialItems={serializableItems} />;
}
