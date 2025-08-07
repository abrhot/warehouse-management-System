import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RequestStatus } from '@/generated/prisma';

export async function POST(req: Request) {
  const { requestId, newStatus } = await req.json();

  if (!requestId || !newStatus || !['APPROVED', 'REJECTED'].includes(newStatus)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // NOTE: In a real app, you'd get the admin's ID from their session.
  // Make sure you have a user (e.g., an admin) with id=2 in your database.
  const approverId = 2; 

  try {
    const request = await prisma.stockRequest.findUnique({
      where: { id: requestId },
      include: { product: true },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    if (request.status !== 'PENDING') {
      return NextResponse.json({ error: 'Request has already been processed' }, { status: 400 });
    }

    // --- If REJECTED, just update the status ---
    if (newStatus === RequestStatus.REJECTED) {
      const updatedRequest = await prisma.stockRequest.update({
        where: { id: requestId },
        data: {
          status: RequestStatus.REJECTED,
          approvedBy: approverId,
        },
      });
      return NextResponse.json(updatedRequest);
    }
    
    // --- If APPROVED, run a transaction ---
    if (newStatus === RequestStatus.APPROVED) {
      // For stock OUT, check if there's enough quantity
      if (request.type === 'OUT' && request.product.quantity < request.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${request.product.name}. Available: ${request.product.quantity}, Requested: ${request.quantity}` },
          { status: 400 }
        );
      }

      // Use a transaction to ensure both updates succeed or fail together
      const [updatedRequest, updatedProduct] = await prisma.$transaction([
        // 1. Update the request status
        prisma.stockRequest.update({
          where: { id: requestId },
          data: {
            status: RequestStatus.APPROVED,
            approvedBy: approverId,
          },
        }),
        // 2. Update the product quantity
        prisma.product.update({
          where: { id: request.productId },
          data: {
            quantity: {
              [request.type === 'IN' ? 'increment' : 'decrement']: request.quantity,
            },
          },
        }),
      ]);

      return NextResponse.json(updatedRequest);
    }
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}