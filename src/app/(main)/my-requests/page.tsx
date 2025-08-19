// ⬇️ ENSURE there is NO 'use client' directive at the top of THIS file.
// This is a Server Component for fetching data.

import { MyRequestsPageContent } from '@/components/requests/MyRequestsPageContent';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { StockRequest, StockItem, Product, User, RequestStatus } from '@/generated/prisma';

export type UserRequestWithRelations = StockRequest & {
  stockItem: (StockItem & { product: Product }) | null;
  requester: User;
};

// This async function is a valid React Server Component.
export default async function MyRequestsPage() {
  const session = await getServerSession(authOptions);

  const requests = session?.user?.id
    ? await prisma.stockRequest.findMany({
        where: { requestedBy: session.user.id },
        include: {
          stockItem: {
            include: {
              product: true,
            },
          },
          requester: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    : [];

  const summary = {
    total: requests.length,
    rejected: requests.filter(req => req.status === RequestStatus.REJECTED).length,
    pending: requests.filter(req => req.status === RequestStatus.PENDING).length,
  };

  // Ensure all data passed to the client component is serializable
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

  // It returns a valid JSX element, which is the client component with props.
  return <MyRequestsPageContent initialRequests={serializableRequests} summary={summary} />;
}