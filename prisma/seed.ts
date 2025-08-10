import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- 1. Seed Users ---
  const usersToCreate = [
    { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: Role.ADMIN },
    { name: 'Standard User', email: 'user@example.com', password: 'user123', role: Role.USER },
  ];
  for (const u of usersToCreate) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, password: hashedPassword, role: u.role },
    });
  }
  console.log(`Upserted ${usersToCreate.length} users.`);

  // --- 2. Seed Suppliers ---
  const suppliersData = [
    { name: 'Global Packaging Inc.' },
    { name: 'Safety First Supplies' },
    { name: 'Warehouse Tools Co.' },
    { name: 'Office Best' },
  ];
  const suppliers = await Promise.all(
    suppliersData.map((s) =>
      prisma.supplier.upsert({ where: { name: s.name }, update: {}, create: { name: s.name } })
    )
  );
  console.log(`Upserted ${suppliers.length} suppliers.`);

  // --- 3. Seed Categories ---
  const categoriesData = [
    { name: 'Packaging' },
    { name: 'Safety Equipment' },
    { name: 'Tools' },
    { name: 'Electronics' },
    { name: 'Janitorial' },
    { name: 'Office Supplies' },
    { name: 'Raw Materials' },
  ];
  const categories = await Promise.all(
    categoriesData.map((c) =>
      prisma.category.upsert({ where: { name: c.name }, update: {}, create: { name: c.name } })
    )
  );
  console.log(`Upserted ${categories.length} categories.`);

  // Create maps for easy lookup
  const supplierMap = new Map(suppliers.map((s) => [s.name, s.id]));
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  // --- 4. Seed Products ---
  const productsData = [
    // Packaging (6 products)
    {
      sku: 'PW-STD-500',
      name: 'Standard Pallet Wrap 500m',
      categoryName: 'Packaging',
      supplierName: 'Global Packaging Inc.',
      quantity: 150,
      reorderLevel: 20,
      costPrice: 12.5,
    },
    {
      sku: 'BOX-MED-100',
      name: 'Cardboard Boxes (Medium, 100pk)',
      categoryName: 'Packaging',
      supplierName: 'Global Packaging Inc.',
      quantity: 250,
      reorderLevel: 50,
      costPrice: 75,
    },
    {
      sku: 'TAPE-HVY-36',
      name: 'Heavy Duty Packing Tape (36pk)',
      categoryName: 'Packaging',
      supplierName: 'Global Packaging Inc.',
      quantity: 80,
      reorderLevel: 15,
      costPrice: 45.99,
    },
    {
      sku: 'BUB-WRP-500',
      name: 'Bubble Wrap Roll 500mm x 100m',
      categoryName: 'Packaging',
      supplierName: 'Global Packaging Inc.',
      quantity: 100,
      reorderLevel: 20,
      costPrice: 20,
    },
    {
      sku: 'STR-FLM-10',
      name: 'Stretch Film (10 rolls)',
      categoryName: 'Packaging',
      supplierName: 'Global Packaging Inc.',
      quantity: 60,
      reorderLevel: 10,
      costPrice: 55,
    },
    {
      sku: 'TWN-PLY-05',
      name: 'Packing Twine (5kg Spool)',
      categoryName: 'Packaging',
      supplierName: 'Global Packaging Inc.',
      quantity: 40,
      reorderLevel: 5,
      costPrice: 18.75,
    },

    // Safety Equipment (6 products)
    {
      sku: 'GLV-LTH-LG',
      name: 'Leather Safety Gloves (Large)',
      categoryName: 'Safety Equipment',
      supplierName: 'Safety First Supplies',
      quantity: 120,
      reorderLevel: 25,
      costPrice: 8.75,
    },
    {
      sku: 'HAT-YLW-01',
      name: 'Hard Hat (Yellow)',
      categoryName: 'Safety Equipment',
      supplierName: 'Safety First Supplies',
      quantity: 60,
      reorderLevel: 10,
      costPrice: 15,
    },
    {
      sku: 'VEST-HIV-XL',
      name: 'High-Visibility Vest (XL)',
      categoryName: 'Safety Equipment',
      supplierName: 'Safety First Supplies',
      quantity: 75,
      reorderLevel: 15,
      costPrice: 11.25,
    },
    {
      sku: 'GLS-SFT-CLR',
      name: 'Safety Glasses (Clear Lens)',
      categoryName: 'Safety Equipment',
      supplierName: 'Safety First Supplies',
      quantity: 90,
      reorderLevel: 20,
      costPrice: 6.5,
    },
    {
      sku: 'MSK-DST-50',
      name: 'Dust Masks (50pk)',
      categoryName: 'Safety Equipment',
      supplierName: 'Safety First Supplies',
      quantity: 200,
      reorderLevel: 30,
      costPrice: 25,
    },
    {
      sku: 'KNE-PAD-PR',
      name: 'Industrial Knee Pads (Pair)',
      categoryName: 'Safety Equipment',
      supplierName: 'Safety First Supplies',
      quantity: 45,
      reorderLevel: 10,
      costPrice: 14.4,
    },

    // Tools (6 products)
    {
      sku: 'BCK-SFT-50',
      name: 'Safety Box Cutter (50pk)',
      categoryName: 'Tools',
      supplierName: 'Warehouse Tools Co.',
      quantity: 40,
      reorderLevel: 10,
      costPrice: 99.99,
    },
    {
      sku: 'WRC-PLR-SET',
      name: 'Pliers Set (5-piece)',
      categoryName: 'Tools',
      supplierName: 'Warehouse Tools Co.',
      quantity: 35,
