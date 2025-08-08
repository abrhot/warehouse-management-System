// src/app/api/stock/request/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth'; // <--- 1. IMPORT your auth handler
import { StockType } from '@/generated/prisma';

export async function POST(req: Request) {
  // --- 2. Get the current user's session ---
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  // The user's real ID is now in this variable
  const requestingUserId = session.user.id;

  try {
    const body = await req.json();
    const { productId, productName, category, quantity, type, notes, sku } = body;

    if (!type || !quantity || (!productId && !productName)) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    
    // The hardcoded placeholder is now GONE.
    // const requestingUserId = 1; // <--- THIS IS THE DELETED BUG

    let finalProductId = productId;

    // Logic to find or create a product (this part is unchanged)
    if (!productId && productName) {
      const normalizedName = productName.trim().toLowerCase();
      const normalizedCategoryName = category.trim().toLowerCase();

      let productCategory = await prisma.category.findFirst({
        where: { name: normalizedCategoryName },
      });

      if (!productCategory) {
        productCategory = await prisma.category.create({
          data: { name: normalizedCategoryName },
        });
      }
      
      let product = await prisma.product.findFirst({
        where: { 
          name: normalizedName, 
          categoryId: productCategory.id 
        },
      });
      
      if (!product) {
        const generatedSku = sku || `${normalizedName.substring(0, 3)}-${productCategory.id}-${Date.now()}`;
        
        product = await prisma.product.create({
          data: {
            name: normalizedName,
            categoryId: productCategory.id,
            quantity: 0,
            sku: generatedSku,
          },
        });
      }
      
      finalProductId = product.id;
    }

    // --- 3. Create the request with the REAL user ID ---
    const stockRequest = await prisma.stockRequest.create({
      data: {
        productId: finalProductId,
        quantity: Number(quantity),
        type: type as StockType,
        status: 'PENDING',
        requestedBy: requestingUserId, // <-- Using the ID from the session
        notes: notes,
      },
    });

    return NextResponse.json(stockRequest, { status: 201 });

  } catch (error: any) {
    console.error("Error creating stock request:", error);
    return NextResponse.json({ error: 'Failed to create stock request' }, { status: 500 });
  }
}