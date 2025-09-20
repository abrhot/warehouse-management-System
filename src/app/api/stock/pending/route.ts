import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // FIX: Correctly use named import for prisma

export async function GET() {
  try {
    // --- Step 1: Fetch all PENDING requests with their related data ---
    const pendingRequests = await prisma.stockRequest.findMany({
      where: {
        // CHECK #1: Is the status field actually named 'status' in your schema?
        // Is the value 'PENDING' exactly as defined in your enum?
        status: 'PENDING',
      },
      include: {
        // CHECK #2: Are the relation fields on your StockRequest model
        // named exactly 'stockItem' and 'requester'?
        stockItem: {
          include: {
            product: true, // This assumes a 'product' relation exists on StockItem
          },
        },
        requester: {
          select: { name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'asc', // Show oldest requests first
      },
    });

    // --- Step 2: Get a list of unique product IDs from the requests ---
    const productIds = [
      ...new Set(
        pendingRequests
          .map((req) => req.stockItem?.product?.id)
          .filter((id): id is string => !!id)
      ),
    ];

    // --- Step 3: Fetch the current stock count for each of those products ---
    // This query will only run if there are pending requests with products
    if (productIds.length > 0) {
      const stockCounts = await prisma.stockItem.groupBy({
        // CHECK #3: Does your StockItem model have a field named 'productId'?
        // This is a common point of error.
        by: ['productId'],
        where: {
          productId: { in: productIds },
          status: 'IN_STOCK',
        },
        _count: {
          id: true,
        },
      });

      // Create a lookup map for easy access: { productId: count }
      const stockCountMap = new Map(
        stockCounts.map((item) => [item.productId, item._count.id])
      );

      // --- Step 4: Transform the data to match the frontend's expected structure ---
      const formattedRequests = pendingRequests.map((req) => {
          const product = req.stockItem?.product;
          return {
              id: req.id,
              type: req.type,
              quantity: req.quantity,
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
    }

    // If there are no product-related requests, return an empty array
    return NextResponse.json([], { status: 200 });

  } catch (error) {
    // IMPROVED LOGGING: This will print the detailed error to your server console
    console.error('Error fetching pending requests:', error);
    
    // Send back a more informative error response
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
    return NextResponse.json(
      { error: 'Failed to fetch pending requests.', details: errorMessage },
      { status: 500 }
    );
  }
}

