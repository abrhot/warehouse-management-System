import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- 1. Seed Users ---
  // You need bcrypt installed: npm install bcrypt @types/bcrypt
  const usersToCreate = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: Role.ADMIN,
    },
    {
      name: 'Standard User',
      email: 'user@example.com',
      password: 'user123',
      role: Role.USER,
    },
  ];

  for (const userData of usersToCreate) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      console.log(`✅ User created: ${userData.email}`);
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }

  // --- 2. Seed Products ---
  const productsToCreate = [
    { name: 'Standard Pallet Wrap', category: 'Packaging', quantity: 50 },
    { name: 'Cardboard Boxes (Medium)', category: 'Packaging', quantity: 200 },
    { name: 'Bubble Wrap (50m Roll)', category: 'Packaging', quantity: 30 },
    { name: 'Safety Gloves (Leather)', category: 'Safety Equipment', quantity: 100 },
    { name: 'Hard Hat (Yellow)', category: 'Safety Equipment', quantity: 40 },
    { name: 'High-Visibility Vest', category: 'Safety Equipment', quantity: 60 },
    { name: 'Box Cutter Knife', category: 'Tools', quantity: 75 },
    { name: 'Handheld Barcode Scanner', category: 'Electronics', quantity: 15 },
    { name: 'Label Printer Labels (Roll)', category: 'Consumables', quantity: 150 },
    { name: 'First Aid Kit (Wall-mounted)', category: 'Safety Equipment', quantity: 10 },
    { name: 'Forklift Propane Tank', category: 'Vehicle Parts', quantity: 8 },
    { name: 'Cleaning Solvent (5L)', category: 'Janitorial', quantity: 25 },
    { name: 'Industrial Mop & Bucket', category: 'Janitorial', quantity: 20 },
    { name: 'Caution Wet Floor Sign', category: 'Janitorial', quantity: 30 },
    { name: 'Wooden Pallets (48x40)', category: 'Materials', quantity: 300 },
    { name: 'Fire Extinguisher (ABC)', category: 'Safety Equipment', quantity: 22 },
    { name: 'Packing Tape (6-pack)', category: 'Packaging', quantity: 120 },
    { name: 'Work Boots (Size 10)', category: 'Safety Equipment', quantity: 18 },
    { name: 'Inventory Logbook', category: 'Office Supplies', quantity: 50 },
    { name: 'Permanent Markers (Black)', category: 'Office Supplies', quantity: 100 },
  ];
  
  // To ensure a clean slate, we delete all existing products first.
  await prisma.product.deleteMany({});
  console.log('Cleared existing products.');

  await prisma.product.createMany({
    data: productsToCreate,
  });
  console.log(`✅ Seeded ${productsToCreate.length} products.`);
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });