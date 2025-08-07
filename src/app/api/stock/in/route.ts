import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, quantity } = body;

    if (!productId || !quantity) {
      return NextResponse.json({ error: "Missing productId or quantity" }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: {
          increment: Number(quantity),
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error("Error in stock in:", error);
    return NextResponse.json({ error: "Stock in failed: " + error.message }, { status: 500 });
  }
}
