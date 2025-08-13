import { NextResponse } from 'next/server';
import { StockType } from '@/generated/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  // 1. Get the current user session securely
  const session = await getServerSession(authOptions);

  // 2. Check for authentication
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 3. Parse the request body
    const body = await req.json();
    const { productId, quantity, type, notes, reason } = body;

    // 4. Validate StockType
    if (!Object.values(StockType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid stock request type.' },
        { status: 400 }
      );
    }

    // 5. Get authenticated user's ID
    const userId = session.user.id;

    // 6. Create the stock request
    const newRequest = await prisma.stockRequest.create({
      data: {
        productId,
        quantity,
        type,
        notes: notes || null,
        reason: reason || null,
        requestedBy: userId, // link directly to user
        // approvedBy remains null until admin approves
      },
      include: {
        product: true, // return product details in response
        requester: true, // include requester info
      },
    });

    // 7. Return the created request
    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating stock request:', error);
    return NextResponse.json(
      { error: 'Failed to create stock request.' },
      { status: 500 }
    );
  }
}
