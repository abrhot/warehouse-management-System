// prisma/seed.ts
import { PrismaClient, Role, StockType, RequestStatus } from '../src/generated/prisma';
import bcrypt from 'bcrypt';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

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
    suppliersData.map((s) =>
      prisma.supplier.upsert({ where: { name: s.name }, update: s, create: s })
    )
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
    categoriesData.map((c) =>
      prisma.category.upsert({ where: { name: c.name }, update: c, create: c })
    )
  );
  console.log(`Upserted ${categories.length} categories.`);

  // Create lookup maps for easy ID access
  const supplierMap = new Map(suppliers.map((s) => [s.name, s.id]));
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  // 4. Seed 40 Products
  const productsData = [
    // Packaging (5)
    { sku: 'PKG-PW-STD-500', name: 'Standard Pallet Wrap 500m', categoryName: 'Packaging', supplierName: 'Global Packaging Inc.', quantity: 150, reorderLevel: 20, costPrice: 12.50 },
    { sku: 'PKG-BOX-MED-100', name: 'Cardboard Boxes (Medium, 100pk)', categoryName: 'Packaging', supplierName: 'Global Packaging Inc.', quantity: 250, reorderLevel: 50, costPrice: 75.00 },
    { sku: 'PKG-TAPE-HVY-36', name: 'Heavy Duty Packing Tape (36pk)', categoryName: 'Packaging', supplierName: 'Global Packaging Inc.', quantity: 80, reorderLevel: 15, costPrice: 45.99 },
    { sku: 'PKG-BUBBLE-50M', name: 'Bubble Wrap Roll (50m)', categoryName: 'Packaging', supplierName: 'Global Packaging Inc.', quantity: 45, reorderLevel: 10, costPrice: 25.00 },
    { sku: 'PKG-LABEL-SHIP-1K', name: 'Shipping Labels (1000 Roll)', categoryName: 'Packaging', supplierName: 'Logistics & Shipping', quantity: 120, reorderLevel: 25, costPrice: 19.99 },
    // Safety Equipment (7)
    { sku: 'SFE-GLV-LTH-LG', name: 'Leather Safety Gloves (Large)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 120, reorderLevel: 25, costPrice: 8.75 },
    { sku: 'SFE-HAT-YLW-01', name: 'Hard Hat (Yellow)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 60, reorderLevel: 10, costPrice: 15.00 },
    { sku: 'SFE-VEST-HIV-XL', name: 'High-Visibility Vest (XL)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 75, reorderLevel: 15, costPrice: 11.25 },
    { sku: 'SFE-GLASS-CLR', name: 'Safety Glasses (Clear)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 200, reorderLevel: 50, costPrice: 3.50 },
    { sku: 'SFE-BOOTS-STL-10', name: 'Steel Toe Boots (Size 10)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 30, reorderLevel: 5, costPrice: 89.95 },
    { sku: 'SFE-AIDKIT-WALL', name: 'First Aid Kit (Wall-Mounted)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 15, reorderLevel: 3, costPrice: 120.00 },
    { sku: 'SFE-FIRE-EXT-ABC', name: 'Fire Extinguisher (ABC)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 25, reorderLevel: 5, costPrice: 55.00 },
    // Tools (6)
    { sku: 'TOL-BCK-SFT-50', name: 'Safety Box Cutter (50pk)', categoryName: 'Tools', supplierName: 'Warehouse Tools Co.', quantity: 40, reorderLevel: 10, costPrice: 99.99 },
    { sku: 'TOL-WRENCH-SET', name: 'Adjustable Wrench Set', categoryName: 'Tools', supplierName: 'Warehouse Tools Co.', quantity: 20, reorderLevel: 5, costPrice: 75.50 },
    { sku: 'TOL-HAMMER-CLAW', name: 'Claw Hammer (16oz)', categoryName: 'Tools', supplierName: 'Warehouse Tools Co.', quantity: 35, reorderLevel: 10, costPrice: 18.00 },
    { sku: 'TOL-TAPE-MEASURE', name: 'Tape Measure (25ft)', categoryName: 'Tools', supplierName: 'Warehouse Tools Co.', quantity: 50, reorderLevel: 15, costPrice: 12.75 },
    { sku: 'TOL-DOLLY-HVY', name: 'Heavy Duty Dolly Cart', categoryName: 'Tools', supplierName: 'Heavy Duty Movers', quantity: 10, reorderLevel: 2, costPrice: 150.00 },
    { sku: 'TOL-PALLET-JACK', name: 'Manual Pallet Jack', categoryName: 'Tools', supplierName: 'Heavy Duty Movers', quantity: 8, reorderLevel: 2, costPrice: 350.00 },
    // Electronics (3)
    { sku: 'ELEC-SCA-HND-ZBR', name: 'Zebra Handheld Barcode Scanner', categoryName: 'Electronics', supplierName: 'Warehouse Tools Co.', quantity: 12, reorderLevel: 3, costPrice: 450.00 },
    { sku: 'ELEC-PRT-LBL-THM', name: 'Thermal Label Printer', categoryName: 'Electronics', supplierName: 'Warehouse Tools Co.', quantity: 10, reorderLevel: 2, costPrice: 299.00 },
    { sku: 'ELEC-BATT-AAA-48', name: 'AAA Batteries (48 Pack)', categoryName: 'Electronics', supplierName: 'Office Best', quantity: 60, reorderLevel: 10, costPrice: 18.50 },
    // Janitorial (5)
    { sku: 'JAN-CLN-SOL-5L', name: 'Industrial Cleaning Solvent (5L)', categoryName: 'Janitorial', supplierName: 'Safety First Supplies', quantity: 30, reorderLevel: 5, costPrice: 22.00 },
    { sku: 'JAN-MOP-BKT-SET', name: 'Mop & Bucket Set', categoryName: 'Janitorial', supplierName: 'Safety First Supplies', quantity: 20, reorderLevel: 4, costPrice: 45.00 },
    { sku: 'JAN-TRASH-BAG-HVY', name: 'Heavy Duty Trash Bags (100ct)', categoryName: 'Janitorial', supplierName: 'Safety First Supplies', quantity: 50, reorderLevel: 10, costPrice: 35.00 },
    { sku: 'JAN-PAPER-TOWEL', name: 'Paper Towel Rolls (12pk)', categoryName: 'Janitorial', supplierName: 'Safety First Supplies', quantity: 80, reorderLevel: 20, costPrice: 24.00 },
    { sku: 'JAN-SIGN-WET-FLR', name: 'Wet Floor Sign', categoryName: 'Janitorial', supplierName: 'Safety First Supplies', quantity: 40, reorderLevel: 5, costPrice: 9.00 },
    // Office Supplies (5)
    { sku: 'OFF-LBL-THM-4X6', name: 'Thermal Labels (4x6, Roll)', categoryName: 'Office Supplies', supplierName: 'Office Best', quantity: 200, reorderLevel: 40, costPrice: 9.50 },
    { sku: 'OFF-PEN-BLK-12', name: 'Black Pens (12 pack)', categoryName: 'Office Supplies', supplierName: 'Office Best', quantity: 100, reorderLevel: 20, costPrice: 8.00 },
    { sku: 'OFF-CLIPBOARD', name: 'Standard Clipboard', categoryName: 'Office Supplies', supplierName: 'Office Best', quantity: 50, reorderLevel: 10, costPrice: 2.50 },
    { sku: 'OFF-BINDER-3IN', name: '3-Inch Binder', categoryName: 'Office Supplies', supplierName: 'Office Best', quantity: 70, reorderLevel: 15, costPrice: 4.75 },
    { sku: 'OFF-PAPER-A4-RM', name: 'A4 Paper Ream', categoryName: 'Office Supplies', supplierName: 'Office Best', quantity: 150, reorderLevel: 30, costPrice: 5.50 },
    // Raw Materials (3)
    { sku: 'RAW-PALLET-WOOD', name: 'Wooden Pallets (48x40)', categoryName: 'Raw Materials', supplierName: 'Logistics & Shipping', quantity: 300, reorderLevel: 50, costPrice: 15.00 },
    { sku: 'RAW-STEEL-BEAM-10', name: 'Steel Beam (10ft)', categoryName: 'Raw Materials', supplierName: 'Industrial Machine Parts', quantity: 80, reorderLevel: 10, costPrice: 120.00 },
    { sku: 'RAW-PLASTIC-PELLET', name: 'Plastic Pellets (1 ton)', categoryName: 'Raw Materials', supplierName: 'Global Packaging Inc.', quantity: 20, reorderLevel: 4, costPrice: 800.00 },
    // Hardware (4)
    { sku: 'HW-SCREW-KIT', name: 'Assorted Screw Kit', categoryName: 'Hardware', supplierName: 'Warehouse Tools Co.', quantity: 60, reorderLevel: 15, costPrice: 25.00 },
    { sku: 'HW-BOLT-HEX-100', name: 'Hex Bolts (100 pack)', categoryName: 'Hardware', supplierName: 'Industrial Machine Parts', quantity: 80, reorderLevel: 20, costPrice: 30.00 },
    { sku: 'HW-HINGE-DOOR', name: 'Industrial Door Hinge', categoryName: 'Hardware', supplierName: 'Industrial Machine Parts', quantity: 40, reorderLevel: 10, costPrice: 12.00 },
    { sku: 'HW-CASTER-WHEEL', name: 'Swivel Caster Wheel', categoryName: 'Hardware', supplierName: 'Heavy Duty Movers', quantity: 100, reorderLevel: 25, costPrice: 7.50 },
    // Consumables (2)
    { sku: 'CON-FORKLIFT-GAS', name: 'Forklift Propane Tank', categoryName: 'Consumables', supplierName: 'Industrial Machine Parts', quantity: 18, reorderLevel: 4, costPrice: 40.00 },
    { sku: 'CON-OIL-LUBE-1G', name: 'Lubricating Oil (1 Gallon)', categoryName: 'Consumables', supplierName: 'Warehouse Tools Co.', quantity: 30, reorderLevel: 10, costPrice: 28.00 },
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
  }
  console.log(`Upserted ${productsData.length} products.`);

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