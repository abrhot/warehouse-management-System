// src/app/api/stock/process/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RequestStatus, ItemStatus } from '@/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      // Use a transaction to update both the request and the stock item's status
      const [updatedRequest] = await prisma.$transaction([
        // 1. Update the request status
        prisma.stockRequest.update({
          where: { id: requestId },
          data: { 
            status: RequestStatus.APPROVED,
            approvedBy: session.user.id,
          },
        }),
        // 2. Update the stock item's status to SHIPPED
        prisma.stockItem.update({
          where: { id: request.stockItemId },
          data: {
            status: ItemStatus.SHIPPED,
          },
        }),
      ]);
      return NextResponse.json(updatedRequest);
    } else { // If the status is REJECTED
      // Use a transaction to update the request and revert the stock item's status
      const [updatedRequest] = await prisma.$transaction([
        prisma.stockRequest.update({
            where: { id: requestId },
            data: { 
                status: RequestStatus.REJECTED,
                approvedBy: session.user.id,
            },
        }),
        // Revert the item's status from RESERVED back to IN_STOCK
        prisma.stockItem.update({
            where: { id: request.stockItemId },
            data: {
                status: ItemStatus.IN_STOCK,
            }
        })
      ]);
      return NextResponse.json(updatedRequest);
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
