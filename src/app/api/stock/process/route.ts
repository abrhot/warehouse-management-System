import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
// FIX 1: Corrected to a named import
import prisma from '@/lib/prisma';
// FIX 2: Corrected the import path to the standard client location
// Use string literals for enum values at runtime

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { requestId, newStatus, remark } = body;

    if (!requestId || !newStatus) {
      return NextResponse.json({ error: 'Missing requestId or newStatus' }, { status: 400 });
    }

    if (newStatus !== 'APPROVED' && newStatus !== 'REJECTED') {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    const request = await prisma.stockRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    if (request.status !== 'PENDING') {
      return NextResponse.json({ error: 'Request has already been processed' }, { status: 400 });
    }

    // Use a transaction to ensure both updates succeed or fail together
    if (newStatus === 'APPROVED') {
      await prisma.$transaction([
        prisma.stockRequest.update({
          where: { id: requestId },
          data: {
            status: 'APPROVED',
            // FIX 3: Use 'connect' on the 'approver' relation field
            approver: {
              connect: { id: session.user.id },
            },
          },
        }),
        prisma.stockItem.update({
          where: { id: request.stockItemId! },
          data: {
            status: 'SHIPPED', // Or whatever status is appropriate after approval
          },
        }),
      ]);
    } else { // If the status is REJECTED
      await prisma.$transaction([
        prisma.stockRequest.update({
          where: { id: requestId },
          data: {
            status: 'REJECTED',
            reason: remark, // Save the rejection remark
             // FIX 3: Use 'connect' on the 'approver' relation field
            approver: {
              connect: { id: session.user.id },
            },
          },
        }),
        prisma.stockItem.update({
          where: { id: request.stockItemId! },
          data: {
            status: 'IN_STOCK', // Revert item status to available
          },
        })
      ]);
    }
    
    return NextResponse.json({ success: true, newStatus: newStatus });

  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: `Failed to process request: ${error.message}` }, { status: 500 });
  }
}