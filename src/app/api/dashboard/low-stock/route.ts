// src/app/api/dashboard/low-stock/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch products where current quantity is at or below the reorder level
    const lowStockItems = await prisma.product.findMany({
      where: {
        // quantity less than or equal to reorderLevel
        quantity: {
          lte: prisma.product.fields?.reorderLevel as unknown as number, // ❌ this is incorrect
        },
      },
      orderBy: {
        quantity: 'asc', // Show the lowest stock items first
      },
      take: 5, // Limit to top 5
    });

    return NextResponse.json(lowStockItems);
  } catch (error) {
    console.error('Failed to fetch low stock items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch low stock items' },
      { status: 500 }
    );
  }
}
