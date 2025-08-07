// src/app/api/reports/history/route.ts
import { NextResponse } from 'next/server';
import { RequestStatus } from '@prisma/client';
import prisma from '@/lib/prisma'; // 👈 Import the shared client

// ❌ Remove this line: const prisma = new PrismaClient();

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
    // This log will now appear in your terminal where the dev server is running
    console.error('Failed to fetch request history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}