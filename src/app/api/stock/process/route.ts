// src/app/api/stock/process/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RequestStatus, StockType } from '@/generated/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { requestId, newStatus } = body;

    if (!requestId || !newStatus) {
      return NextResponse.json({ error: 'Missing requestId or newStatus' }, { status: 400 });
    }

    if (!Object.values(RequestStatus).includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    // Find the original request to get its details
    const request = await prisma.stockRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    if (request.status !== RequestStatus.PENDING) {
      return NextResponse.json({ error: 'Request has already been processed' }, { status: 400 });
    }
    
    // --- Main Logic: Handle Approval or Rejection ---

    if (newStatus === RequestStatus.APPROVED) {
      // Use a transaction to update both the request and the product stock together
      const [updatedRequest] = await prisma.$transaction([
        // 1. Update the request status
        prisma.stockRequest.update({
          where: { id: requestId },
          data: { status: RequestStatus.APPROVED },
        }),
        // 2. Update the product's quantity
        prisma.product.update({
          where: { id: request.productId },
          data: {
            quantity: {
              // Use increment for STOCK IN, decrement for STOCK OUT
              [request.type === StockType.IN ? 'increment' : 'decrement']: request.quantity,
            },
          },
        }),
      ]);
      return NextResponse.json(updatedRequest);
    } else { // If the status is REJECTED
      const updatedRequest = await prisma.stockRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.REJECTED },
      });
      return NextResponse.json(updatedRequest);
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}