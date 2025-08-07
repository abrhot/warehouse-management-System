import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, quantity, location, handler, notes } = body;

    if (!name || !category || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, or quantity' },
        { status: 400 }
      );
    }

    // Normalize product name and category for consistency (optional)
    const normalizedName = name.trim().toLowerCase();
    const normalizedCategory = category.trim().toLowerCase();

    let product = await prisma.product.findFirst({
      where: {
        name: normalizedName,
        category: normalizedCategory,
      },
    });

    if (product) {
      // Product exists → increment quantity
      product = await prisma.product.update({
        where: { id: product.id },
        data: {
          quantity: {
            increment: Number(quantity),
          },
        },
      });
    } else {
      // Product does not exist → create it
      product = await prisma.product.create({
        data: {
          name: normalizedName,
          category: normalizedCategory,
          quantity: Number(quantity),
          location: location?.trim(),
          handler: handler?.trim(),
          notes: notes?.trim(),
        },
      });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error in stock in:', error);
    return NextResponse.json(
      { error: 'Stock in failed: ' + error.message },
      { status: 500 }
    );
  }
}
