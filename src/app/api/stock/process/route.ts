import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { RequestStatus, ItemStatus } from '@/generated/prisma';

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

    if (!Object.values(RequestStatus).includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid status provided' }, { status: 400 });
    }

    const request = await prisma.stockRequest.findUnique({
      where: { id: requestId },
      include: { stockItem: true },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    if (request.status !== RequestStatus.PENDING) {
      return NextResponse.json({ error: 'Request has already been processed' }, { status: 400 });
    }

    if (newStatus === RequestStatus.APPROVED) {
      const [updatedRequest, updatedStockItem] = await prisma.$transaction([
        prisma.stockRequest.update({
          where: { id: requestId },
          data: {
            status: RequestStatus.APPROVED,
            approvedBy: session.user.id,
          },
        }),
        prisma.stockItem.update({
          where: { id: request.stockItemId! },
          data: {
            status: ItemStatus.SHIPPED,
          },
        }),
      ]);
      return NextResponse.json({ updatedRequest, updatedStockItem });
    } else { // If the status is REJECTED
      const [updatedRequest, updatedStockItem] = await prisma.$transaction([
        prisma.stockRequest.update({
          where: { id: requestId },
          data: {
            status: RequestStatus.REJECTED,
            approvedBy: session.user.id,
            reason: remark, // Save the rejection remark
          },
        }),
        prisma.stockItem.update({
          where: { id: request.stockItemId! },
          data: {
            status: ItemStatus.IN_STOCK, // Revert status
          },
        })
      ]);
      return NextResponse.json({ updatedRequest, updatedStockItem });
    }

  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: `Failed to process request: ${error.message}` }, { status: 500 });
  }
}