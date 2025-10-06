import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Helper function to generate a random number within a range
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate a unique product SKU
function generateSku(categoryName: string, index: number) {
  const categoryCode = categoryName.substring(0, 3).toUpperCase();
  const randomNumber = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${categoryCode}-${randomNumber}-${index}`;
}

export async function POST(req: Request) {
  try {
    console.log('Starting database seeding...');

    // 1. Create categories first
    const categories = [
      { name: 'Routers', description: 'Devices that forward data packets between computer networks.' },
      { name: 'Switches', description: 'Devices that connect devices together on a computer network.' },
      { name: 'Firewalls', description: 'Network security devices that monitor and filter incoming and outgoing network traffic.' },
      { name: 'Servers', description: 'Hardware and software that provides functionality for other programs or devices.' },
      { name: 'Cables', description: 'Ethernet, fiber, and other cables for network connections.' },
      { name: 'Access Points', description: 'Networking hardware that allows Wi-Fi devices to connect to a wired network.' },
      { name: 'Storage', description: 'Network-Attached Storage (NAS) and Storage Area Networks (SAN).' },
    ];

    const createdCategories = await Promise.all(
      categories.map(cat => 
        prisma.category.upsert({
          where: { name: cat.name },
          update: {},
          create: { name: cat.name, description: cat.description },
        })
      )
    );
    console.log(`${createdCategories.length} categories created.`);

    // 2. Create users
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@warehouse.com' },
      update: {},
      create: {
        email: 'admin@warehouse.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        role: 'USER'
      }
    });

    // 3. Create products and stock items
    const productPrefixes = ['ProLink', 'NetCore', 'DataStream', 'SecureGate', 'FiberOptix', 'Apex', 'Titan'];
    const productModels = ['XG', 'ZR', 'S-Class', 'G-Force', 'Z-Series'];
    
    const productsCreated = [];
    const stockItemsCreated = [];

    for (let i = 1; i <= 50; i++) {
      const category = createdCategories[getRandomInt(0, createdCategories.length - 1)];
      const prefix = productPrefixes[getRandomInt(0, productPrefixes.length - 1)];
      const model = productModels[getRandomInt(0, productModels.length - 1)];
      
      const productName = `${prefix} ${category.name.slice(0, -1)} ${model}-${getRandomInt(100, 9000)}`;
      
      // Create the product
      const product = await prisma.product.create({
        data: {
          name: productName,
          sku: generateSku(category.name, i),
          categoryId: category.id,
          quantity: getRandomInt(1, 5), // Random quantity between 1-5
          reorderLevel: getRandomInt(5, 15),
          costPrice: parseFloat((Math.random() * (500 - 50) + 50).toFixed(2)),
          sellingPrice: parseFloat((Math.random() * (1000 - 100) + 100).toFixed(2)),
          location: `Aisle ${getRandomInt(1, 10)}-Shelf ${String.fromCharCode(65 + getRandomInt(0, 4))}`,
        },
      });
      productsCreated.push(product);

      // Create stock items for each product
      const quantity = product.quantity;
      for (let j = 1; j <= quantity; j++) {
        const stockItem = await prisma.stockItem.create({
          data: {
            productId: product.id,
            serialNumber: `SN-${product.sku}-${Date.now()}-${j}`,
            status: 'IN_STOCK',
            location: product.location,
          }
        });
        stockItemsCreated.push(stockItem);
      }
    }

    // 4. Create some sample stock requests
    const sampleRequests = [];
    for (let i = 0; i < 5; i++) {
      const randomStockItem = stockItemsCreated[getRandomInt(0, stockItemsCreated.length - 1)];
      const request = await prisma.stockRequest.create({
        data: {
          type: 'OUT',
          status: 'PENDING',
          notes: `Sample request ${i + 1} for testing dashboard`,
          requestedBy: testUser.id,
          stockItemId: randomStockItem.id,
        }
      });
      sampleRequests.push(request);
    }

    console.log('Database seeding completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with sample data',
      data: {
        categories: createdCategories.length,
        products: productsCreated.length,
        stockItems: stockItemsCreated.length,
        requests: sampleRequests.length,
        users: [
          { email: adminUser.email, role: adminUser.role },
          { email: testUser.email, role: testUser.role }
        ]
      }
    });

  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}
