// src/app/api/stock/pending/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// FIX: Corrected the enum name from 'StockItemStatus' to 'ItemStatus' to match your schema
import { RequestStatus, ItemStatus } from '@prisma/client';

export async function GET() {
  try {
    const pendingRequests = await prisma.stockRequest.findMany({
      where: {
        status: RequestStatus.PENDING,
      },
      include: {
        stockItem: {
          include: {
            product: true, 
          },
        },
        requester: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const productIds = [
      ...new Set(
        pendingRequests
          .map((req) => req.stockItem?.productId)
          .filter((id): id is string => !!id)
      ),
    ];

    if (productIds.length === 0) {
      const formattedRequests = pendingRequests.map(req => ({
        id: req.id,
        type: req.type,
        quantity: 1, // A request is for 1 unique stock item
        createdAt: req.createdAt.toISOString(),
        notes: req.notes,
        product: req.stockItem?.product ? { name: req.stockItem.product.name, quantity: 0 } : undefined,
        requester: req.requester ? { name: req.requester.name, email: req.requester.email } : undefined,
      }));
       return NextResponse.json(formattedRequests, { status: 200 });
    }
    
    const stockCounts = await prisma.stockItem.groupBy({
      by: ['productId'], 
      where: {
        productId: { in: productIds },
        // FIX: Using the correct 'ItemStatus' enum
        status: ItemStatus.IN_STOCK, 
      },
      _count: {
        id: true,
      },
    });

    const stockCountMap = new Map(
      stockCounts.map((item) => [item.productId, item._count.id])
    );

    const formattedRequests = pendingRequests.map((req) => {
      const product = req.stockItem?.product;
      return {
        id: req.id,
        type: req.type,
        quantity: 1, // A request is for 1 unique stock item
        createdAt: req.createdAt.toISOString(),
        notes: req.notes,
        product: product
          ? {
              name: product.name,
              quantity: stockCountMap.get(product.id) || 0,
            }
          : undefined,
        requester: req.requester
          ? {
              name: req.requester.name,
              email: req.requester.email,
            }
          : undefined,
      };
    });

    return NextResponse.json(formattedRequests, { status: 200 });

  } catch (error) {
    console.error('Error fetching pending requests:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
    return NextResponse.json(
      { error: 'Failed to fetch pending requests.', details: errorMessage },
      { status: 500 }
    );
  }
}