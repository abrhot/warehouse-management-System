// src/app/api/stock/in/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Function to generate a unique serial number
const generateSerialNumber = async (productId: string, categoryName: string): Promise<string> => {
    const categoryCode = categoryName.substring(0, 2).toUpperCase();
    
    // Find the count of existing items for this product to generate a unique number
    const itemCount = await prisma.stockItem.count({
        where: { productId: productId }
    });
    
    const uniqueId = (itemCount + 1).toString().padStart(5, '0'); // e.g., 00001, 00002
    
    return `${categoryCode}-${productId.substring(0, 4)}-${uniqueId}`;
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, location } = body;

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { category: true }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const serialNumber = await generateSerialNumber(productId, product.category.name);

        const newStockItem = await prisma.stockItem.create({
            data: {
                productId: productId,
                serialNumber: serialNumber,
                location: location || null,
                status: 'IN_STOCK',
            },
        });

        return NextResponse.json(newStockItem, { status: 201 });

    } catch (error) {
        console.error('Error creating stock item:', error);
        return NextResponse.json(
            { error: 'Failed to create stock item.' },
            { status: 500 }
        );
    }
}