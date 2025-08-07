import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const pendingRequests = await prisma.stockRequest.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        product: {
          select: {
            name: true,
            quantity: true,
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
        createdAt: 'asc',
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