// src/app/api/stock/request/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { stockItemId, notes, reason } = body;
    const userId = session.user.id;

    // First, check if a request for this stock item already exists.
    // This prevents the unique constraint violation.
    const existingRequest = await prisma.stockRequest.findUnique({
      where: { stockItemId },
    });

    if (existingRequest) {
      // If a request already exists, return a 409 Conflict error.
      // This is the correct HTTP status for a resource conflict.
      return NextResponse.json(
        { error: 'A request for this item already exists. Please resolve the existing request before creating a new one.' },
        { status: 409 } // 409 Conflict
      );
    }

    // Now, create the stock request and update the item's status to RESERVED within a single transaction.
    const [newRequest, updatedItem] = await prisma.$transaction([
      prisma.stockRequest.create({
        data: {
          stockItemId,
          type: 'OUT',
          notes: notes || null,
          reason: reason || null,
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

    // Provide more specific error messages to the client
    if (error.code === 'P2025') {
      // This error code means a record was not found for an update or delete operation.
      // In this case, it means the stockItemId from the request body doesn't exist.
      return NextResponse.json(
        { error: 'Stock item not found. Please provide a valid item ID.' },
        { status: 404 } // 404 Not Found
      );
    }

    return NextResponse.json(
      { error: 'Failed to create stock out request due to an internal server error.' },
      { status: 500 }
    );
  }
}