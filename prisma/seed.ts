// prisma/seed.ts
import { PrismaClient, Role } from '../src/generated/prisma';
import bcrypt from 'bcrypt';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// Helper function to generate a unique serial number for each stock item
const generateSerialNumber = (
  categoryName: string,
  productId: string,
  index: number
): string => {
  const categoryCode = categoryName.substring(0, 3).toUpperCase();
  const productIdFragment = productId.substring(0, 4).toUpperCase();
  const uniqueId = (index + 1).toString().padStart(4, '0'); // e.g., 0001, 0002
  return `${categoryCode}-${productIdFragment}-${uniqueId}`;
};


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

    // 4. Seed Products and their individual StockItems
    const productsData = [
        { name: 'Standard Pallet Wrap 500m', categoryName: 'Packaging', supplierName: 'Global Packaging Inc.', initialStock: 150, reorderLevel: 20, costPrice: 12.50 },
        { name: 'Leather Safety Gloves (Large)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', initialStock: 120, reorderLevel: 25, costPrice: 8.75 },
        { name: 'Safety Box Cutter (50pk)', categoryName: 'Tools', supplierName: 'Warehouse Tools Co.', initialStock: 40, reorderLevel: 10, costPrice: 99.99 },
        { name: 'Zebra Handheld Barcode Scanner', categoryName: 'Electronics', supplierName: 'Warehouse Tools Co.', initialStock: 12, reorderLevel: 3, costPrice: 450.00 },
        { name: 'Industrial Cleaning Solvent (5L)', categoryName: 'Janitorial', supplierName: 'Safety First Supplies', initialStock: 30, reorderLevel: 5, costPrice: 22.00 },
        { name: 'Thermal Labels (4x6, Roll)', categoryName: 'Office Supplies', supplierName: 'Office Best', initialStock: 200, reorderLevel: 40, costPrice: 9.50 },
        { name: 'Wooden Pallets (48x40)', categoryName: 'Raw Materials', supplierName: 'Logistics & Shipping', initialStock: 300, reorderLevel: 50, costPrice: 15.00 },
        { name: 'Assorted Screw Kit', categoryName: 'Hardware', supplierName: 'Warehouse Tools Co.', initialStock: 60, reorderLevel: 15, costPrice: 25.00 },
        { name: 'Forklift Propane Tank', categoryName: 'Consumables', supplierName: 'Industrial Machine Parts', initialStock: 18, reorderLevel: 4, costPrice: 40.00 },
    ];

    for (const p of productsData) {
      const categoryId = categoryMap.get(p.categoryName);
      const supplierId = supplierMap.get(p.supplierName);

      if (!categoryId || !supplierId) {
        console.warn(`Skipping product "${p.name}" due to missing category or supplier.`);
        continue;
      }

      // Step 1: Create the main product entry (without quantity or sku)
      const product = await prisma.product.upsert({
        where: { 
            name_categoryId: {
                name: p.name,
                categoryId: categoryId,
            }
        },
        update: {
          reorderLevel: p.reorderLevel,
          costPrice: new Decimal(p.costPrice),
          supplierId,
        },
        create: {
          name: p.name,
          reorderLevel: p.reorderLevel,
          costPrice: new Decimal(p.costPrice),
          categoryId,
          supplierId,
        },
      });

      // Step 2: Create individual StockItem entries for the product's initial quantity
      for (let i = 0; i < p.initialStock; i++) {
        const serialNumber = generateSerialNumber(p.categoryName, product.id, i);
        await prisma.stockItem.create({
            data: {
                productId: product.id,
                serialNumber: serialNumber,
                status: 'IN_STOCK',
            }
        });
      }
      console.log(`Seeded product "${p.name}" with ${p.initialStock} individual stock items.`);
    }

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
