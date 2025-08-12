// src/app/api/notifications/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma'; // Make sure you have a prisma instance configured

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch all stock requests for the logged-in user
  // Also include the related product to get its name
  const notifications = await prisma.stockRequest.findMany({
    where: {
      requestedBy: session.user.id,
    },
    include: {
      product: {
        select: {
          name: true, // Select only the product name
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