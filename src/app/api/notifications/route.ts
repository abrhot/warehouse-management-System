// src/app/api/notifications/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
// CORRECT
import prisma from '@/lib/prisma';
// Use string literals for enum values


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch only PENDING stock requests for the logged-in user
  const notifications = await prisma.stockRequest.findMany({
    where: {
      requestedBy: session.user.id,
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
