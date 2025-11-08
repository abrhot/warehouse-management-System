import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Check JWT headers from middleware
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');
    
    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
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
            // Connect the approvedBy field to the user
            approvedBy: userId,
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
            // Connect the approvedBy field to the user
            approvedBy: userId,
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