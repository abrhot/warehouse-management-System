// src/app/api/my-requests/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userRequests = await prisma.stockRequest.findMany({
      where: {
        requestedBy: session.user.id,
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
        createdAt: 'desc', // Show the most recent requests first
      },
    });

    return NextResponse.json(userRequests);
  } catch (error) {
    console.error('Failed to fetch user requests:', error);
    return NextResponse.json({ error: 'Failed to fetch user requests' }, { status: 500 });
  }
}
