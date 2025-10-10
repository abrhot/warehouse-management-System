import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const rejectSchema = z.object({
  notes: z.string().min(1, 'Rejection reason is required'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role');
    const userId = request.headers.get('x-user-id');
    
    if (userRole !== 'ADMIN' || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { notes } = rejectSchema.parse(body);

    // Find the pending category
    const pendingCategory = await prisma.pendingCategory.findUnique({
      where: { id: params.id },
    });

    if (!pendingCategory) {
      return NextResponse.json(
        { error: 'Pending category not found' },
        { status: 404 }
      );
    }

    if (pendingCategory.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Category has already been reviewed' },
        { status: 400 }
      );
    }

    // Update pending category status
    await prisma.pendingCategory.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
        reviewedBy: userId,
        notes,
      },
    });

    return NextResponse.json({
      message: 'Category rejected successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error rejecting category:', error);
    return NextResponse.json(
      { error: 'Failed to reject category' },
      { status: 500 }
    );
  }
}
