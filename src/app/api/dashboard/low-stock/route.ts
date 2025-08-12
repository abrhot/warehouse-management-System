// src/app/api/dashboard/low-stock/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

export async function GET() {
  try {
    // Fetches products where current quantity is at or below the reorder level
    const lowStockItems = await prisma.product.findMany({
      where: {
        quantity: {
          lte: Prisma.sql('reorderLevel'), // Compares quantity to the reorderLevel field
        },
      },
      orderBy: {
        quantity: 'asc', // Show the lowest stock items first
      },
      take: 5, // Limit to the top 5 lowest stock items
    });

    return NextResponse.json(lowStockItems);
  } catch (error) {
    console.error("Failed to fetch low stock items:", error);
    return NextResponse.json(
      { error: 'Failed to fetch low stock items' },
      { status: 500 }
    );
  }
}