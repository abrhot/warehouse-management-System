// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const stockItems = await prisma.stockItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
          },
        },
      },
    });
    return NextResponse.json(stockItems);
  } catch (error: any) {
    console.error("Failed to fetch stock items:", error);
    return NextResponse.json(
      { error: "Server failed to fetch stock items" },
      { status: 500 }
    );
  }
}
