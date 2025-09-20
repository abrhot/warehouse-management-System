// src/app/api/stock/request/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
// FIX 1: Import the 'RequestStatus' enum from your generated prisma client
import { RequestStatus } from '@/generated/prisma'; 

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { stockItemId, notes, reason } = body;
    if (!stockItemId) {
        return NextResponse.json({ error: 'Stock Item ID is required.' }, { status: 400 });
    }
    
    const userId = session.user.id;

    const existingRequest = await prisma.stockRequest.findFirst({
      where: { 
        stockItemId: stockItemId,
        // FIX 2: Use the enum members directly instead of strings
        status: { in: [RequestStatus.PENDING, RequestStatus.RESERVED] }
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'An active request for this item already exists.' },
        { status: 409 } // 409 Conflict
      );
    }
    
    const [newRequest] = await prisma.$transaction([
      prisma.stockRequest.create({
        data: {
          stockItemId,
          type: 'OUT',
          // FIX 3: Use the enum here as well
          status: RequestStatus.PENDING, 
          notes: notes || null,
          reason: reason || null,
          // FIX 4: Correct the field name to match your Prisma schema
          requestedBy: userId, 
        },
      }),
      prisma.stockItem.update({
        where: { id: stockItemId },
        data: { status: 'RESERVED' },
      }),
    ]);

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    console.error('Error creating stock out request:', error);

    if (error.code === 'P2025' || error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Stock item not found. Please provide a valid item ID.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create stock out request due to an internal server error.' },
      { status: 500 }
    );
  }
}