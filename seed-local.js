// Simple script to seed the database locally
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSku(categoryName, index) {
  const categoryCode = categoryName.substring(0, 3).toUpperCase();
  const randomNumber = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${categoryCode}-${randomNumber}-${index}`;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Create categories
    const categories = [
      { name: 'Routers', description: 'Network routing devices' },
      { name: 'Switches', description: 'Network switching devices' },
      { name: 'Firewalls', description: 'Network security devices' },
      { name: 'Servers', description: 'Server hardware' },
      { name: 'Cables', description: 'Network cables and accessories' },
      { name: 'Access Points', description: 'Wireless access points' },
      { name: 'Storage', description: 'Network storage devices' },
    ];

    console.log('Creating categories...');
    const createdCategories = [];
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: { name: cat.name, description: cat.description },
      });
      createdCategories.push(category);
    }
    console.log(`✅ ${createdCategories.length} categories created`);

    // 2. Create users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    await prisma.user.upsert({
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
    console.log('✅ Users created');

    // 3. Create products and stock items
    console.log('Creating products and stock items...');
    const productPrefixes = ['ProLink', 'NetCore', 'DataStream', 'SecureGate', 'FiberOptix'];
    const productModels = ['XG', 'ZR', 'S-Class', 'G-Force'];
    
    let productsCreated = 0;
    let stockItemsCreated = 0;

    for (let i = 1; i <= 30; i++) {
      const category = createdCategories[getRandomInt(0, createdCategories.length - 1)];
      const prefix = productPrefixes[getRandomInt(0, productPrefixes.length - 1)];
      const model = productModels[getRandomInt(0, productModels.length - 1)];
      
      const productName = `${prefix} ${category.name.slice(0, -1)} ${model}-${getRandomInt(100, 999)}`;
      
      try {
        const product = await prisma.product.create({
          data: {
            name: productName,
            sku: generateSku(category.name, i),
            categoryId: category.id,
            quantity: getRandomInt(1, 3),
            reorderLevel: getRandomInt(5, 10),
            costPrice: parseFloat((Math.random() * 400 + 50).toFixed(2)),
            sellingPrice: parseFloat((Math.random() * 800 + 100).toFixed(2)),
            location: `Aisle ${getRandomInt(1, 8)}-Shelf ${String.fromCharCode(65 + getRandomInt(0, 3))}`,
          },
        });
        productsCreated++;

        // Create stock items
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
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`Skipping duplicate product: ${productName}`);
          continue;
        }
        throw error;
      }
    }

    // 4. Create sample requests
    console.log('Creating sample requests...');
    const stockItems = await prisma.stockItem.findMany({ take: 5 });
    let requestsCreated = 0;
    
    for (let i = 0; i < Math.min(3, stockItems.length); i++) {
      await prisma.stockRequest.create({
        data: {
          type: 'OUT',
          status: 'PENDING',
          notes: `Sample request ${i + 1} for dashboard testing`,
          requestedBy: testUser.id,
          stockItemId: stockItems[i].id,
        }
      });
      requestsCreated++;
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Products: ${productsCreated}`);
    console.log(`   Stock Items: ${stockItemsCreated}`);
    console.log(`   Sample Requests: ${requestsCreated}`);
    console.log(`   Users: 2 (admin@warehouse.com, test@example.com)`);
    console.log('\n✅ Your dashboard should now show products and pending requests!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
