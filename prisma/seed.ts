// prisma/seed.ts
import { PrismaClient, Role } from '../src/generated/prisma';
import bcrypt from 'bcrypt';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  try {
    // 1. Seed Users
    const usersToCreate = [
      { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: Role.ADMIN },
      { name: 'Standard User', email: 'user@example.com', password: 'user123', role: Role.USER },
    ];

    for (const u of usersToCreate) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, password: hashedPassword, role: u.role },
        create: { name: u.name, email: u.email, password: hashedPassword, role: u.role },
      });
    }
    console.log(`Upserted ${usersToCreate.length} users.`);

    // 2. Seed Suppliers
    const suppliersData = [
      { name: 'Global Packaging Inc.', contactInfo: 'info@globalpackaging.com' },
      { name: 'Safety First Supplies', contactInfo: 'contact@safetyfirst.net' },
      { name: 'Warehouse Tools Co.', contactInfo: 'sales@warehousetools.co' },
      { name: 'Office Best', contactInfo: 'support@officebest.com' },
      { name: 'Industrial Machine Parts', contactInfo: 'parts@industrial.com' },
      { name: 'Logistics & Shipping', contactInfo: 'shipping@logistics.com' },
      { name: 'Heavy Duty Movers', contactInfo: 'contact@hdm.com' },
    ];

    const suppliers = await Promise.all(
      suppliersData.map(async (s) => {
        const result = await prisma.supplier.upsert({
          where: { name: s.name },
          update: s,
          create: s,
        });
        console.log(`Seeded supplier: ${result.name}`);
        return result;
      })
    );
    console.log(`Upserted ${suppliers.length} suppliers.`);

    // 3. Seed Categories
    const categoriesData = [
      { name: 'Packaging', description: 'Materials for packing and shipping.' },
      { name: 'Safety Equipment', description: 'Protective gear and safety tools.' },
      { name: 'Tools', description: 'Hand and power tools for various tasks.' },
      { name: 'Electronics', description: 'Scanners, printers, and other devices.' },
      { name: 'Janitorial', description: 'Cleaning supplies and equipment.' },
      { name: 'Office Supplies', description: 'Everyday supplies for office use.' },
      { name: 'Raw Materials', description: 'Basic goods used in production.' },
      { name: 'Hardware', description: 'Fasteners, hinges, and other hardware.' },
      { name: 'Consumables', description: 'Items that are used up or consumed.' },
    ];

    const categories = await Promise.all(
      categoriesData.map(async (c) => {
        const result = await prisma.category.upsert({
          where: { name: c.name },
          update: c,
          create: c,
        });
        console.log(`Seeded category: ${result.name}`);
        return result;
      })
    );
    console.log(`Upserted ${categories.length} categories.`);

    // Create lookup maps for easy ID access
    const supplierMap = new Map(suppliers.map((s) => [s.name, s.id]));
    const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

    // 4. Seed Products
    const productsData = [
      { sku: 'PKG-PW-STD-500', name: 'Standard Pallet Wrap 500m', categoryName: 'Packaging', supplierName: 'Global Packaging Inc.', quantity: 150, reorderLevel: 20, costPrice: 12.50 },
      { sku: 'SFE-GLV-LTH-LG', name: 'Leather Safety Gloves (Large)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 120, reorderLevel: 25, costPrice: 8.75 },
      { sku: 'TOL-BCK-SFT-50', name: 'Safety Box Cutter (50pk)', categoryName: 'Tools', supplierName: 'Warehouse Tools Co.', quantity: 40, reorderLevel: 10, costPrice: 99.99 },
      { sku: 'ELEC-SCA-HND-ZBR', name: 'Zebra Handheld Barcode Scanner', categoryName: 'Electronics', supplierName: 'Warehouse Tools Co.', quantity: 12, reorderLevel: 3, costPrice: 450.00 },
      { sku: 'JAN-CLN-SOL-5L', name: 'Industrial Cleaning Solvent (5L)', categoryName: 'Janitorial', supplierName: 'Safety First Supplies', quantity: 30, reorderLevel: 5, costPrice: 22.00 },
      { sku: 'OFF-LBL-THM-4X6', name: 'Thermal Labels (4x6, Roll)', categoryName: 'Office Supplies', supplierName: 'Office Best', quantity: 200, reorderLevel: 40, costPrice: 9.50 },
      { sku: 'RAW-PALLET-WOOD', name: 'Wooden Pallets (48x40)', categoryName: 'Raw Materials', supplierName: 'Logistics & Shipping', quantity: 300, reorderLevel: 50, costPrice: 15.00 },
      { sku: 'HW-SCREW-KIT', name: 'Assorted Screw Kit', categoryName: 'Hardware', supplierName: 'Warehouse Tools Co.', quantity: 60, reorderLevel: 15, costPrice: 25.00 },
      { sku: 'CON-FORKLIFT-GAS', name: 'Forklift Propane Tank', categoryName: 'Consumables', supplierName: 'Industrial Machine Parts', quantity: 18, reorderLevel: 4, costPrice: 40.00 },
    ];

    for (const p of productsData) {
      const categoryId = categoryMap.get(p.categoryName);
      const supplierId = supplierMap.get(p.supplierName);

      if (!categoryId || !supplierId) {
        console.warn(`Skipping product "${p.name}" due to missing category or supplier.`);
        continue;
      }

      await prisma.product.upsert({
        where: { sku: p.sku },
        update: {
          name: p.name,
          quantity: p.quantity,
          reorderLevel: p.reorderLevel,
          costPrice: new Decimal(p.costPrice),
          categoryId,
          supplierId,
        },
        create: {
          sku: p.sku,
          name: p.name,
          quantity: p.quantity,
          reorderLevel: p.reorderLevel,
          costPrice: new Decimal(p.costPrice),
          categoryId,
          supplierId,
        },
      });
      console.log(`Seeded product: ${p.name}`);
    }
    console.log(`Upserted ${productsData.length} products.`);

    console.log('Seeding finished.');
  } catch (e) {
    console.error("An error occurred during seeding:");
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();