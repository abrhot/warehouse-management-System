// src/app/api/notifications/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  // Check JWT headers from middleware
  const userId = req.headers.get('x-user-id');
  const userRole = req.headers.get('x-user-role');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch only PENDING stock requests for the logged-in user
  const notifications = await prisma.stockRequest.findMany({
    where: {
      requestedBy: userId,
      status: 'PENDING', // Filter for only pending requests
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
