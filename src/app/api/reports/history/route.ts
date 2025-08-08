// src/app/api/reports/history/route.ts
import { NextResponse } from 'next/server';
import { RequestStatus } from '@/generated/prisma'; // 👈 FINAL CORRECTED IMPORT
import prisma from '@/lib/prisma';

// ... rest of the file remains the same
export async function GET() {
  try {
    const requestHistory = await prisma.stockRequest.findMany({
      where: {
        status: {
          in: [RequestStatus.APPROVED, RequestStatus.REJECTED],
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
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}