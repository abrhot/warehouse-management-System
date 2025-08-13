import { NextResponse } from 'next/server';
import { StockType } from '@/generated/prisma'; // Keep this import for the enum
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma'; // Import the single Prisma instance

export async function POST(req: Request) {
  // 1. Get the current user session securely
  const session = await getServerSession(authOptions);

  // 2. Check for authentication
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, quantity, type, notes, reason } = body;

    // Validate StockType safely
    if (!Object.values(StockType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid stock request type.' },
        { status: 400 }
      );
    }
    console.log('Session:', session);
console.log('Request body:', body);
console.log('Allowed StockTypes:', Object.values(StockType));


    // 3. Use the authenticated user's ID from the session
    const userId = session.user.id;

    const newRequest = await prisma.stockRequest.create({
      data: {
        productId,
        quantity,
        type,
        notes: notes || null,
        reason: reason || null,
        // The relation name in your schema is 'requester', not 'requestedBy'
        // Let's use that for clarity, connecting via the 'requestedBy' field
        requester: {
            connect: {
                id: userId,
            }
        }
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating stock request:', error);
    return NextResponse.json(
      { error: 'Failed to create stock request.' },
      { status: 500 }
    );
  }
}