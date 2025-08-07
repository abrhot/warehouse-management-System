import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const pendingRequests = await prisma.stockRequest.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        // Include related product and user info to display on the dashboard
        product: {
          select: {
            name: true,
            quantity: true, // Show current stock
          },
        },
        requester: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Show the oldest requests first
      },
    });
    return NextResponse.json(pendingRequests);
  } catch (error: any) {
    console.error("Failed to fetch pending requests:", error);
    return NextResponse.json(
      { error: 'Failed to fetch pending requests' },
      { status: 500 }
    );
  }
}