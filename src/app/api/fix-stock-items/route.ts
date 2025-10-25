import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Utility API to create stock items for existing products that don't have them
export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Find products that don't have stock items
    const productsWithoutStockItems = await prisma.product.findMany({
      where: {
        stockItems: {
          none: {}
        }
      },
      include: {
        stockItems: true
      }
    });

    let totalStockItemsCreated = 0;
    const results = [];

    // Create stock items for each product
    for (const product of productsWithoutStockItems) {
      const stockItems = [];
      
      // Create stock items based on the product quantity
      for (let i = 0; i < product.quantity; i++) {
        const stockItem = await prisma.stockItem.create({
          data: {
            serialNumber: `${product.sku}-${String(i + 1).padStart(4, '0')}`,
            status: 'IN_STOCK',
            location: product.location,
            productId: product.id,
          },
        });
        stockItems.push(stockItem);
        totalStockItemsCreated++;
      }

      results.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: product.quantity,
        stockItemsCreated: stockItems.length
      });
    }

    return NextResponse.json({
      message: 'Stock items created successfully',
      totalProductsFixed: productsWithoutStockItems.length,
      totalStockItemsCreated,
      details: results
    });

  } catch (error: any) {
    console.error('Error creating stock items:', error);
    return NextResponse.json(
      { error: 'Failed to create stock items' },
      { status: 500 }
    );
  }
}

// GET method to check which products need stock items
export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Find products that don't have stock items
    const productsWithoutStockItems = await prisma.product.findMany({
      where: {
        stockItems: {
          none: {}
        }
      },
      select: {
        id: true,
        name: true,
        sku: true,
        quantity: true,
        _count: {
          select: {
            stockItems: true
          }
        }
      }
    });

    // Also get total counts
    const totalProducts = await prisma.product.count();
    const totalStockItems = await prisma.stockItem.count();

    return NextResponse.json({
      totalProducts,
      totalStockItems,
      productsWithoutStockItems: productsWithoutStockItems.length,
      details: productsWithoutStockItems
    });

  } catch (error: any) {
    console.error('Error checking stock items:', error);
    return NextResponse.json(
      { error: 'Failed to check stock items' },
      { status: 500 }
    );
  }
}
