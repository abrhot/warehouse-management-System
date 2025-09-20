// This is a Server Component for fetching data.
import { prisma } from '@/lib/prisma'; // Corrected: Use a named import
import { Prisma, RequestStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { MyRequestsPageContent } from '@/components/requests/MyRequestsPageContent';

// Define the query arguments to reuse for type generation and the actual query
const requestWithRelationsArgs = {
  include: {
    stockItem: {
      include: {
        product: true,
      },
    },
    requester: true, // Include the user who made the request
  },
  orderBy: {
    createdAt: 'desc',
  },
} satisfies Prisma.StockRequestFindManyArgs;

// Generate the specific type from the query for type safety
export type UserRequestWithRelations = Prisma.StockRequestGetPayload<typeof requestWithRelationsArgs>;

// This async function is a valid React Server Component.
export default async function MyRequestsPage() {
  const session = await getServerSession(authOptions);

  const requests = session?.user?.id
    ? await prisma.stockRequest.findMany({
        // Corrected: The field name is 'requestedBy' according to the error log.
        where: { requestedBy: session.user.id }, 
        ...requestWithRelationsArgs,
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
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    stockItem: request.stockItem
      ? {
          ...request.stockItem,
          createdAt: request.stockItem.createdAt.toISOString(),
          updatedAt: request.stockItem.updatedAt.toISOString(),
          product: {
            ...request.stockItem.product,
            costPrice: request.stockItem.product.costPrice.toString(),
            sellingPrice: request.stockItem.product.sellingPrice?.toString() || null,
            createdAt: request.stockItem.product.createdAt.toISOString(),
            updatedAt: request.stockItem.product.updatedAt.toISOString(),
          },
        }
      : null,
    requester: {
      ...request.requester,
      // Handle potentially null date fields in the User model
      emailVerified: request.requester.emailVerified?.toISOString() || null,
    },
  }));

  // It returns a valid JSX element, which is the client component with props.
  return <MyRequestsPageContent initialRequests={serializableRequests} summary={summary} />;
}

