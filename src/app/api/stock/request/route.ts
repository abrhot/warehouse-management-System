import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { StockType } from '@/generated/prisma'; // Import the enum

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productId, // For existing products
      productName, // For new products
      category, // For new products
      quantity,
      type, // 'IN' or 'OUT'
      // You can add other fields like notes, handler, etc. here
    } = body;

    // --- Basic Validation ---
    if (!type || !quantity || (!productId && !productName)) {
      return NextResponse.json(
        { error: 'Missing required fields: type, quantity, and product identifier.' },
        { status: 400 }
      );
    }
    
    // NOTE: In a real app, you would get the userId from the user's session (e.g., NextAuth.js)
    // For now, we'll use a placeholder. Make sure you have a user with id=1 in your database.
    const requestingUserId = 1; 

    let finalProductId = productId;

    // --- Logic for Stock In (Potentially new product) ---
    if (type === StockType.IN && !productId) {
      if (!productName || !category) {
        return NextResponse.json(
          { error: 'New products require a name and category.' },
          { status: 400 }
        );
      }
      
      // Find or create the product
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
            quantity: 0, // Quantity will be updated upon approval
          },
        });
      }
      finalProductId = product.id;
    }

    // --- Create the Stock Request ---
    const stockRequest = await prisma.stockRequest.create({
      data: {
        productId: finalProductId,
        quantity: Number(quantity),
        type: type,
        status: 'PENDING', // All requests start as pending
        requestedBy: requestingUserId,
        // You can add other transactional data here if you add them to your schema
        // e.g., notes: body.notes
      },
    });

    return NextResponse.json(stockRequest, { status: 201 });

  } catch (error: any) {
    console.error("Error creating stock request:", error);
    // Check for specific Prisma errors, e.g., foreign key constraint
    if (error.code === 'P2003') {
         return NextResponse.json({ error: "Invalid product or user." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create stock request: " + error.message }, { status: 500 });
  }
}