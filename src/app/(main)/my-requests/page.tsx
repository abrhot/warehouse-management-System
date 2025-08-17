// src/app/(main)/my-requests/page.tsx

import { MyRequestsPageContent } from '@/components/requests/MyRequestsPageContent';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { StockRequest, StockItem, Product } from '@/generated/prisma';

export type UserRequestWithRelations = StockRequest & {
  stockItem: StockItem & {
    product: Product;
  };
};

export default async function MyRequestsPage() {
  const session = await getServerSession(authOptions);
  
  const requests: UserRequestWithRelations[] = session?.user?.id ? await prisma.stockRequest.findMany({
    where: { requestedBy: session.user.id },
    include: {
      stockItem: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) : [];

  // Convert Decimal types to strings for client-side component compatibility
  const serializableRequests = requests.map(request => ({
    ...request,
    stockItem: {
        ...request.stockItem,
        product: {
            ...request.stockItem.product,
            costPrice: request.stockItem.product.costPrice.toString(),
            sellingPrice: request.stockItem.product.sellingPrice?.toString() || null,
        }
    }
  }));

  return <MyRequestsPageContent initialRequests={serializableRequests} />;
}
