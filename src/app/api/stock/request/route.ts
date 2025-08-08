// src/app/api/stock/request/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Correct import path
import { StockType } from '@/generated/prisma';

export async function POST(req: Request) {
  // Get the current user's session using the correct method
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  
  const requestingUserId = session.user.id;

  try {
    const body = await req.json();
    const { productId, productName, category, quantity, type, notes, sku } = body;

    if (!type || !quantity || (!productId && !productName)) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    let finalProductId = productId;

    // Logic to find or create a product (unchanged)
    if (!productId && productName) {
      const normalizedName = productName.trim().toLowerCase();
      const normalizedCategoryName = category.trim().toLowerCase();
      let productCategory = await prisma.category.findFirst({ where: { name: normalizedCategoryName } });
      if (!productCategory) {
        productCategory = await prisma.category.create({ data: { name: normalizedCategoryName } });
      }
      let product = await prisma.product.findFirst({ where: { name: normalizedName, categoryId: productCategory.id } });
      if (!product) {
        const generatedSku = sku || `${normalizedName.substring(0, 3)}-${productCategory.id}-${Date.now()}`;
        product = await prisma.product.create({
          data: { name: normalizedName, categoryId: productCategory.id, quantity: 0, sku: generatedSku },
        });
      }
      finalProductId = product.id;
    }

    // Create the request with the real user ID
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