// prisma/seed.ts
import { PrismaClient, Role, ItemStatus, StockType, RequestStatus } from '../src/generated/prisma';
import bcrypt from 'bcrypt';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clean up existing data to ensure a fresh start
  await prisma.stockRequest.deleteMany();
  await prisma.stockItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  const standardUser = await prisma.user.create({
    data: {
      name: 'Standard User',
      email: 'user@example.com',
      password: hashedPassword,
      role: Role.USER,
    },
  });
  console.log('Seeded users.');

  // 3. Seed 7 Categories (Packages)
  const categoryData = Array.from({ length: 7 }, (_, i) => ({
    name: `Package ${i + 1}`,
    description: `Collection of items for package ${i + 1}.`,
  }));

  const categories = await prisma.category.createManyAndReturn({ data: categoryData });
  console.log(`Seeded ${categories.length} categories.`);

  // 4. Seed Suppliers
  const suppliersData = [
    { name: 'Global Supply Co.' },
    { name: 'Tech Innovations' },
    { name: 'Industrial Parts Inc.' },
  ];
  const suppliers = await prisma.supplier.createManyAndReturn({ data: suppliersData });
  console.log(`Seeded ${suppliers.length} suppliers.`);

  // 5. Seed 140 Products and their StockItems
  const productsToSeed = 140;
  for (let i = 0; i < productsToSeed; i++) {
    const category = categories[i % categories.length];
    const supplier = suppliers[i % suppliers.length];

    // Create a new product
    const product = await prisma.product.create({
      data: {
        sku: `SKU-${i + 1}`,
        name: `Product ${i + 1} (${category.name})`,
        costPrice: new Decimal(Math.floor(Math.random() * 50) + 10), // Random price
        quantity: 1, // Start with a quantity of 1 for the stock item
        categoryId: category.id,
        supplierId: supplier.id,
      },
    });

    // Create a StockItem for the product and set its status to IN_STOCK
    await prisma.stockItem.create({
      data: {
        serialNumber: `SN-${i + 1}-${Math.random().toString(36).substring(2, 8)}`,
        productId: product.id,
        status: ItemStatus.IN_STOCK,
      },
    });
  }

  console.log(`Seeded ${productsToSeed} products and stock items.`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('An error occurred during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });