import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    // The real error will be logged to your terminal from this line
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Server failed to fetch products" },
      { status: 500 }
    );
  }
}