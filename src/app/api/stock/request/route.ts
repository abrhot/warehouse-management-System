import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { StockType } from '@/generated/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, productName, category, quantity, type, notes } = body;

    if (!type || !quantity || (!productId && !productName)) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    
    const requestingUserId = 1; // Placeholder for session user ID
    let finalProductId = productId;

    // Logic to find or create a product if a name is provided instead of an ID
    if (!productId && productName) {
        const normalizedName = productName.trim().toLowerCase();
        const normalizedCategory = category.trim().toLowerCase();

        let product = await prisma.product.findFirst({
            where: { name: normalizedName, category: normalizedCategory },
        });

        if (!product) {
            product = await prisma.product.create({
                data: {
                    name: normalizedName,
                    category: normalizedCategory,
                    quantity: 0, 
                },
            });
        }
        finalProductId = product.id;
    }

    // Create the Stock Request record, now including the 'notes' field
    const stockRequest = await prisma.stockRequest.create({
      data: {
        productId: finalProductId,
        quantity: Number(quantity),
        type: type as StockType,
        status: 'PENDING',
        requestedBy: requestingUserId,
        notes: notes, // Save the notes from the request body
      },
    });

    return NextResponse.json(stockRequest, { status: 201 });

  } catch (error: any) {
    console.error("Error creating stock request:", error);
    return NextResponse.json({ error: 'Failed to create stock request' }, { status: 500 });
  }
}