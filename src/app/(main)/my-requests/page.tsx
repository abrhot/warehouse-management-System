// src/app/(main)/my-requests/page.tsx
import prisma from '@/lib/prisma';
import { Prisma, RequestStatus } from '@/generated/prisma';
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

// Main Server Component
export default async function MyRequestsPage() {
  const session = await getServerSession(authOptions);

  // Fetch requests for the current user
  const requests: UserRequestWithRelations[] = session?.user?.id
    ? await prisma.stockRequest.findMany({
        where: { requestedBy: session.user.id },
        ...requestWithRelationsArgs,
      })
    : [];

  // Summarize request statuses
  const summary = {
    total: requests.length,
    rejected: requests.filter(req => req.status === RequestStatus.REJECTED).length,
    pending: requests.filter(req => req.status === RequestStatus.PENDING).length,
  };

  // Pass Date objects directly; no conversion to strings
  return <MyRequestsPageContent initialRequests={requests} summary={summary} />;
}
