// prisma/seed.ts
import { PrismaClient, Role, ItemStatus } from '../src/generated/prisma';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Define standard categories for a network warehouse
const categories = [
  { name: 'Routers', description: 'Devices that forward data packets between computer networks.' },
  { name: 'Switches', description: 'Devices that connect devices together on a computer network.' },
  { name: 'Firewalls', description: 'Network security devices that monitor and filter incoming and outgoing network traffic.' },
  { name: 'Servers', description: 'Hardware and software that provides functionality for other programs or devices.' },
  { name: 'Cables & Patch Panels', description: 'Ethernet, fiber, and other cables, along with patch panels for organization.' },
  { name: 'Wireless Access Points', description: 'Networking hardware that allows other Wi-Fi devices to connect to a wired network.' },
  { name: 'Network Interface Cards', description: 'A computer hardware component that connects a computer to a computer network.' },
  { name: 'Storage Devices', description: 'Network-Attached Storage (NAS) and Storage Area Networks (SAN).' },
];

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

async function main() {
  console.log('Seeding database...');

  // 1. Create a default admin and user
  const password = await hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@warehouse.com' },
    update: {},
    create: {
      email: 'admin@warehouse.com',
      name: 'Admin User',
      password: password,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@warehouse.com' },
    update: {},
    create: {
      email: 'user@warehouse.com',
      name: 'Standard User',
      password: password,
      role: Role.USER,
    },
  });

  // 2. Create the standard categories
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

  // 3. Create 200 products and a corresponding stock item for each
  const productPrefixes = ['ProLink', 'NetCore', 'DataStream', 'SecureGate', 'FiberOptix', 'Apex', 'Titan'];
  const productModels = ['XG', 'ZR', 'S-Class', 'G-Force', 'Z-Series'];

  for (let i = 1; i <= 200; i++) {
    const category = createdCategories[getRandomInt(0, createdCategories.length - 1)];
    const prefix = productPrefixes[getRandomInt(0, productPrefixes.length - 1)];
    const model = productModels[getRandomInt(0, productModels.length - 1)];
    
    const productName = `${prefix} ${category.name.slice(0, -1)} ${model}-${getRandomInt(100, 9000)}`;
    
    // Create the product first
    const product = await prisma.product.create({
      data: {
        name: productName,
        sku: generateSku(category.name, i),
        categoryId: category.id,
        quantity: 1, // Quantity is 1 because we are creating one stock item
        reorderLevel: getRandomInt(10, 25),
        costPrice: parseFloat((Math.random() * (1000 - 50) + 50).toFixed(2)),
        sellingPrice: parseFloat((Math.random() * (2000 - 100) + 100).toFixed(2)),
        location: `Aisle ${getRandomInt(1, 20)}-Shelf ${String.fromCharCode(65 + getRandomInt(0, 4))}`,
      },
    });

    // --- NEW: Create a StockItem linked to the product ---
    await prisma.stockItem.create({
        data: {
            productId: product.id,
            serialNumber: `SN-${product.sku}-${Date.now()}`,
            status: ItemStatus.IN_STOCK,
            location: product.location,
        }
    });
  }

  console.log('200 products and their corresponding stock items created.');
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
