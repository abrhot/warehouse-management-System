// src/app/api/notifications/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { RequestStatus } from '@/generated/prisma'; // Import RequestStatus

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch only PENDING stock requests for the logged-in user
  const notifications = await prisma.stockRequest.findMany({
    where: {
      requestedBy: session.user.id,
      status: RequestStatus.PENDING, // Filter for only pending requests
    },
    include: {
      stockItem: {
        select: {
          serialNumber: true,
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });

  return NextResponse.json(notifications);
}
