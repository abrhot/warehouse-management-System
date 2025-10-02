// src/app/api/my-requests/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  // Check JWT headers from middleware
  const userId = req.headers.get('x-user-id');
  const userRole = req.headers.get('x-user-role');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userRequests = await prisma.stockRequest.findMany({
      where: {
        requestedBy: userId,
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
