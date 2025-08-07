// src/app/api/stock/request/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { StockType } from '@/generated/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Assuming 'sku' is passed in the request body, but we'll generate one if not
    const { productId, productName, category, quantity, type, notes, sku } = body;

    if (!type || !quantity || (!productId && !productName)) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    
    const requestingUserId = 1; // Placeholder for session user ID
    let finalProductId = productId;

    // Logic to find or create a product if a name is provided
    if (!productId && productName) {
      const normalizedName = productName.trim().toLowerCase();
      const normalizedCategoryName = category.trim().toLowerCase();

      // Find or create the Category
      let productCategory = await prisma.category.findFirst({
        where: { name: normalizedCategoryName },
      });

      if (!productCategory) {
        productCategory = await prisma.category.create({
          data: {
            name: normalizedCategoryName,
          },
        });
      }
      
      // Find the product
      let product = await prisma.product.findFirst({
        where: { 
          name: normalizedName, 
          categoryId: productCategory.id 
        },
      });
      
      // If product doesn't exist, create it.
      if (!product) {
        // Here's the fix: generate a unique SKU if one isn't provided
        const generatedSku = sku || `${normalizedName.substring(0, 3)}-${productCategory.id}-${Date.now()}`;
        
        product = await prisma.product.create({
          data: {
            name: normalizedName,
            categoryId: productCategory.id,
            quantity: 0,
            sku: generatedSku, // Use the generated SKU
          },
        });
      }
      
      finalProductId = product.id;
    }

    // Create the Stock Request record
    const stockRequest = await prisma.stockRequest.create({
      data: {
        productId: finalProductId,
        quantity: Number(quantity),
        type: type as StockType,
        status: 'PENDING',
        requestedBy: requestingUserId,
        notes: notes,
      },
    });

    return NextResponse.json(stockRequest, { status: 201 });

  } catch (error: any) {
    console.error("Error creating stock request:", error);
    return NextResponse.json({ error: 'Failed to create stock request' }, { status: 500 });
  }
}