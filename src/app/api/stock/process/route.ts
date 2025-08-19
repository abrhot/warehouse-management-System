import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { RequestStatus } from '@/generated/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pendingRequests = await prisma.stockRequest.findMany({
      where: { status: RequestStatus.PENDING },
      // Include the nested relations to get product and requester info
      include: {
        stockItem: {
          include: {
            product: true,
          },
        },
        requester: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(pendingRequests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return NextResponse.json({ error: 'Failed to fetch pending requests' }, { status: 500 });
  }
}