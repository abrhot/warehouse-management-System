// src/app/api/notifications/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all stock requests for the logged-in user
  const notifications = await prisma.stockRequest.findMany({
    where: {
      requestedBy: session.user.id, // Prisma expects a string for the user ID
    },
    // Correctly include the nested product data via the stockItem
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
    // Order by newest first
    orderBy: {
      createdAt: 'desc',
    },
    // Limit to the last 20 notifications for performance
    take: 20,
  });

  return NextResponse.json(notifications);
}
