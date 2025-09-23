import { NextResponse } from 'next/server';
// Use string literals for enum values
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const requestHistory = await prisma.stockRequest.findMany({
      where: {
        status: {
          in: ['APPROVED', 'REJECTED'],
        },
      },
      include: {
        product: { select: { name: true } },
        requester: { select: { name: true } },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(requestHistory);
  } catch (error) {
    console.error('Failed to fetch request history:', error);
    // ✅ FIX: Always return a JSON object for errors
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}