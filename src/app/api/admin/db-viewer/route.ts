import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table') || 'user';
    const limit = parseInt(searchParams.get('limit') || '50');

    let data;
    let count;

    switch (table.toLowerCase()) {
      case 'user':
        data = await prisma.user.findMany({ take: limit, orderBy: { id: 'desc' } });
        count = await prisma.user.count();
        break;
      case 'product':
        data = await prisma.product.findMany({ 
          take: limit, 
          orderBy: { id: 'desc' },
          include: { category: true }
        });
        count = await prisma.product.count();
        break;
      case 'category':
        data = await prisma.category.findMany({ take: limit, orderBy: { id: 'desc' } });
        count = await prisma.category.count();
        break;
      case 'stockrequest':
        data = await prisma.stockRequest.findMany({ 
          take: limit, 
          orderBy: { id: 'desc' },
          include: { requester: true, approver: true, stockItem: true }
        });
        count = await prisma.stockRequest.count();
        break;
      case 'auditlog':
        data = await prisma.auditLog.findMany({ 
          take: limit, 
          orderBy: { id: 'desc' },
          include: { user: true, product: true }
        });
        count = await prisma.auditLog.count();
        break;
      case 'pendingproduct':
        data = await prisma.pendingProduct.findMany({ 
          take: limit, 
          orderBy: { id: 'desc' },
          include: { submitter: true, reviewer: true, category: true, supplier: true }
        });
        count = await prisma.pendingProduct.count();
        break;
      case 'pendingcategory':
        data = await prisma.pendingCategory.findMany({ 
          take: limit, 
          orderBy: { id: 'desc' },
          include: { submitter: true, reviewer: true }
        });
        count = await prisma.pendingCategory.count();
        break;
      default:
        return NextResponse.json({ error: 'Invalid table name' }, { status: 400 });
    }

    return NextResponse.json({
      table,
      count,
      limit,
      data
    });
  } catch (error: any) {
    console.error('Database viewer error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}
