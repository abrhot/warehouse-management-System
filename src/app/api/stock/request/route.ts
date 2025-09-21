// src/app/api/stock/request/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { RequestStatus } from '@prisma/client'; 

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
        status: RequestStatus.PENDING 
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'An active request for this item already exists.' },
        { status: 409 }
      );
    }

    const [newRequest] = await prisma.$transaction([
      prisma.stockRequest.create({
        data: {
          type: 'OUT',
          status: RequestStatus.PENDING, 
          notes: notes || null,
          reason: reason || null,
          // --- FIX: Use 'connect' for both relations ---
          requester: {
            connect: { id: userId },
          },
          stockItem: { // Use the relation field 'stockItem'
            connect: { id: stockItemId }, // And connect it by its ID
          },
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