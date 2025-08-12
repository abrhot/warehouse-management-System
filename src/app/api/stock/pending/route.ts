// src/app/api/stock/pending/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RequestStatus } from '@/generated/prisma';

export async function GET() {
  try {
    // Fetch all requests where the status is PENDING
    const pendingRequests = await prisma.stockRequest.findMany({
      where: {
        status: RequestStatus.PENDING,
      },
      // Include the related product and user (requester) data
      include: {
        product: {
          select: { name: true, quantity: true }, // Include current stock quantity
        },
        requester: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'asc', // Show oldest requests first
      },
    });

    return NextResponse.json(pendingRequests, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch pending requests:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching requests.' },
      { status: 500 }
    );
  }
}