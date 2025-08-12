// src/app/api/requests/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure you have a prisma client instance
import { RequestStatus } from '@/generated/prisma'; // Import your enum

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // 1. Validate the incoming status
    if (!status || !Object.values(RequestStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status provided.' },
        { status: 400 }
      );
    }

    // 2. Update the request in the database
    const updatedRequest = await prisma.stockRequest.update({
      where: { id: id },
      data: { status: status },
    });

    // 3. IMPORTANT: Return the updated data as JSON
    // This is the part that fixes your error.
    return NextResponse.json(updatedRequest, { status: 200 });
    
  } catch (error) {
    console.error('Update Request Error:', error);
    return NextResponse.json(
      { error: 'Failed to update the request.' },
      { status: 500 }
    );
  }
}