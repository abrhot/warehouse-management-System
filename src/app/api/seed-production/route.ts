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

export async function GET(req: Request) {
  return POST(req);
}

export async function POST(req: Request) {
  try {
    console.log('🌱 Starting PRODUCTION database seeding...');

    // Check current state
    const existingProducts = await prisma.product.count();
    const existingCategories = await prisma.category.count();
    
    console.log(`Current state: ${existingProducts} products, ${existingCategories} categories`);

    // 1. Create categories first
    const categories = [
      { name: 'Routers', description: 'Network routing devices' },
      { name: 'Switches', description: 'Network switching devices' },
      { name: 'Firewalls', description: 'Network security devices' },
      { name: 'Servers', description: 'Server hardware' },
      { name: 'Cables', description: 'Network cables and accessories' },
      { name: 'Access Points', description: 'Wireless access points' },
      { name: 'Storage', description: 'Network storage devices' },
    ];

    const createdCategories = [];
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { name: cat.name },
        update: { description: cat.description },
        create: { name: cat.name, description: cat.description },
      });
      createdCategories.push(category);
    }
    console.log(`✅ ${createdCategories.length} categories processed`);

    // 2. Create/update users
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@warehouse.com' },
      update: { password: hashedPassword },
      create: {
        email: 'admin@warehouse.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: { password: hashedPassword },
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        role: 'USER'
      }
    });
    console.log('✅ Users processed');

    // 3. Create products and stock items (only if we don't have many products)
    let productsCreated = 0;
    let stockItemsCreated = 0;

    if (existingProducts < 10) {
      console.log('Creating products and stock items...');
      const productPrefixes = ['ProLink', 'NetCore', 'DataStream', 'SecureGate', 'FiberOptix', 'TechCore'];
      const productModels = ['XG', 'ZR', 'Pro', 'Elite', 'Max'];
      
      for (let i = 1; i <= 25; i++) {
        const category = createdCategories[getRandomInt(0, createdCategories.length - 1)];
        const prefix = productPrefixes[getRandomInt(0, productPrefixes.length - 1)];
        const model = productModels[getRandomInt(0, productModels.length - 1)];
        
        const productName = `${prefix} ${category.name.slice(0, -1)} ${model} ${getRandomInt(1000, 9999)}`;
        
        try {
          // Check if product with similar name exists
          const existingProduct = await prisma.product.findFirst({
            where: { name: productName }
          });

          if (!existingProduct) {
            const product = await prisma.product.create({
              data: {
                name: productName,
                sku: generateSku(category.name, i + existingProducts),
                categoryId: category.id,
                quantity: getRandomInt(1, 4),
                reorderLevel: getRandomInt(5, 12),
                costPrice: parseFloat((Math.random() * 500 + 50).toFixed(2)),
                sellingPrice: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
                location: `Aisle ${getRandomInt(1, 10)}-Shelf ${String.fromCharCode(65 + getRandomInt(0, 4))}`,
              },
            });
            productsCreated++;

            // Create stock items for each product
            for (let j = 1; j <= product.quantity; j++) {
              await prisma.stockItem.create({
                data: {
                  productId: product.id,
                  serialNumber: `SN-${product.sku}-${Date.now()}-${j}`,
                  status: 'IN_STOCK',
                  location: product.location,
                }
              });
              stockItemsCreated++;
            }
          }
        } catch (error: any) {
          if (error.code === 'P2002') {
            console.log(`Skipping duplicate: ${productName}`);
            continue;
          }
          console.error(`Error creating product ${productName}:`, error.message);
        }
      }
    } else {
      console.log('Products already exist, skipping product creation');
    }

    // 4. Create sample requests
    console.log('Creating sample requests...');
    const availableStockItems = await prisma.stockItem.findMany({
      where: { status: 'IN_STOCK' },
      take: 5
    });
    
    let requestsCreated = 0;
    for (let i = 0; i < Math.min(3, availableStockItems.length); i++) {
      try {
        // Check if request already exists for this stock item
        const existingRequest = await prisma.stockRequest.findFirst({
          where: { stockItemId: availableStockItems[i].id }
        });

        if (!existingRequest) {
          await prisma.stockRequest.create({
            data: {
              type: 'OUT',
              status: 'PENDING',
              notes: `Sample request ${i + 1} for dashboard testing`,
              requestedBy: testUser.id,
              stockItemId: availableStockItems[i].id,
            }
          });
          requestsCreated++;
        }
      } catch (error: any) {
        console.error(`Error creating request ${i + 1}:`, error.message);
      }
    }

    // Get final counts
    const finalProducts = await prisma.product.count();
    const finalCategories = await prisma.category.count();
    const finalStockItems = await prisma.stockItem.count();
    const finalRequests = await prisma.stockRequest.count();

    console.log('🎉 PRODUCTION database seeding completed!');

    return NextResponse.json({
      success: true,
      message: 'Production database seeded successfully',
      data: {
        categories: finalCategories,
        products: finalProducts,
        stockItems: finalStockItems,
        requests: finalRequests,
        newProductsCreated: productsCreated,
        newStockItemsCreated: stockItemsCreated,
        newRequestsCreated: requestsCreated,
        users: [
          { email: adminUser.email, role: adminUser.role },
          { email: testUser.email, role: testUser.role }
        ]
      }
    });

  } catch (error: any) {
    console.error('❌ Production seeding error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 });
  }
}
