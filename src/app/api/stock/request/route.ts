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

    // Create a stock request and update the item's status to RESERVED
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
  } catch (error) {
    console.error('Error creating stock out request:', error);
    return NextResponse.json(
      { error: 'Failed to create stock out request.' },
      { status: 500 }
    );
  }
}