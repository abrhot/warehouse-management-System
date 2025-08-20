// src/app/api/stock/request/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
// --- FIX: Import authOptions from a central library file ---
// This is the most stable way to handle auth configuration.
// Ensure you have a file at 'src/lib/auth.ts' that exports your authOptions.
import { authOptions } from '@/lib/auth'; 
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  // This will now correctly resolve the user's session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { stockItemId, notes, reason } = body;
    const userId = session.user.id;

    // First, check if a request for this stock item already exists.
    const existingRequest = await prisma.stockRequest.findUnique({
      where: { stockItemId },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'A request for this item already exists.' },
        { status: 409 } // 409 Conflict
      );
    }

    // Create the request and update the item's status in a transaction
    const [newRequest] = await prisma.$transaction([
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

    if (error.code === 'P2025') {
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
