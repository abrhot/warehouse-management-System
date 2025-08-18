// src/app/(main)/my-requests/page.tsx
import { MyRequestsPageContent } from '@/components/requests/MyRequestsPageContent';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { StockRequest, StockItem, Product, User } from '@/generated/prisma';

// Corrected Type: The StockRequest now includes a StockItem, and the StockItem includes a Product.
export type UserRequestWithRelations = StockRequest & {
  stockItem: (StockItem & { product: Product }) | null;
  requester: User;
};

export default async function MyRequestsPage() {
  const session = await getServerSession(authOptions);

  // The Prisma query now correctly includes the 'stockItem' and then the 'product'
  const requests = session?.user?.id
    ? await prisma.stockRequest.findMany({
        where: { requestedBy: session.user.id },
        include: {
          stockItem: {
            include: {
              product: true, // This is the correct way to access Product
            },
          },
          requester: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    : [];

  // Convert Decimal types to strings for client-side component compatibility
  const serializableRequests = requests.map(request => ({
    ...request,
    stockItem: request.stockItem
      ? {
          ...request.stockItem,
          product: {
            ...request.stockItem.product,
            costPrice: request.stockItem.product.costPrice.toString(),
            sellingPrice: request.stockItem.product.sellingPrice?.toString() || null,
          },
        }
      : null,
    requester: request.requester,
  }));

  return <MyRequestsPageContent initialRequests={serializableRequests} />;
}