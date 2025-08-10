"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// C:\Users\USER\Desktop\warehouse-management\prisma\seed.ts
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log(`Start seeding ...`);
    // --- 1. Seed Users ---
    const usersToCreate = [
        { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: client_1.Role.ADMIN },
        { name: 'Standard User', email: 'user@example.com', password: 'user123', role: client_1.Role.USER },
    ];
    for (const u of usersToCreate) {
        const hashedPassword = await bcrypt_1.default.hash(u.password, 10);
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
    const suppliers = await Promise.all(suppliersData.map((s) => prisma.supplier.upsert({ where: { name: s.name }, update: {}, create: { name: s.name } })));
    console.log(`Upserted ${suppliers.length} suppliers.`);
    // --- 3. Seed Categories ---
    const categoriesData = [
        { name: 'Packaging' }, { name: 'Safety Equipment' }, { name: 'Tools' }, { name: 'Electronics' },
        { name: 'Janitorial' }, { name: 'Office Supplies' }, { name: 'Raw Materials' },
    ];
    const categories = await Promise.all(categoriesData.map((c) => prisma.category.upsert({ where: { name: c.name }, update: {}, create: { name: c.name } })));
    console.log(`Upserted ${categories.length} categories.`);
    // Create maps for easy lookup
    const supplierMap = new Map(suppliers.map(s => [s.name, s.id]));
    const categoryMap = new Map(categories.map(c => [c.name, c.id]));
    // --- 4. Seed Products ---
    const productsData = [
        // Packaging
        { sku: 'PW-STD-500', name: 'Standard Pallet Wrap 500m', categoryName: 'Packaging', supplierName: 'Global Packaging Inc.', quantity: 150, reorderLevel: 20, costPrice: 12.50 },
        { sku: 'BOX-MED-100', name: 'Cardboard Boxes (Medium, 100pk)', categoryName: 'Packaging', supplierName: 'Global Packaging Inc.', quantity: 250, reorderLevel: 50, costPrice: 75.00 },
        { sku: 'TAPE-HVY-36', name: 'Heavy Duty Packing Tape (36pk)', categoryName: 'Packaging', supplierName: 'Global Packaging Inc.', quantity: 80, reorderLevel: 15, costPrice: 45.99 },
        // Safety Equipment
        { sku: 'GLV-LTH-LG', name: 'Leather Safety Gloves (Large)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 120, reorderLevel: 25, costPrice: 8.75 },
        { sku: 'HAT-YLW-01', name: 'Hard Hat (Yellow)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 60, reorderLevel: 10, costPrice: 15.00 },
        { sku: 'VEST-HIV-XL', name: 'High-Visibility Vest (XL)', categoryName: 'Safety Equipment', supplierName: 'Safety First Supplies', quantity: 75, reorderLevel: 15, costPrice: 11.25 },
        // Tools
        { sku: 'BCK-SFT-50', name: 'Safety Box Cutter (50pk)', categoryName: 'Tools', supplierName: 'Warehouse Tools Co.', quantity: 40, reorderLevel: 10, costPrice: 99.99 },
        { sku: 'SCA-HND-ZBR', name: 'Zebra Handheld Barcode Scanner', categoryName: 'Electronics', supplierName: 'Warehouse Tools Co.', quantity: 12, reorderLevel: 3, costPrice: 450.00 },
        // Office & Janitorial
        { sku: 'LBL-PRT-4X6', name: 'Thermal Labels (4x6, Roll)', categoryName: 'Office Supplies', supplierName: 'Office Best', quantity: 200, reorderLevel: 40, costPrice: 9.50 },
        { sku: 'CLN-SOL-5L', name: 'Industrial Cleaning Solvent (5L)', categoryName: 'Janitorial', supplierName: 'Safety First Supplies', quantity: 30, reorderLevel: 5, costPrice: 22.00 },
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
            update: {},
            create: {
                sku: p.sku,
                name: p.name,
                quantity: p.quantity,
                reorderLevel: p.reorderLevel,
                costPrice: p.costPrice,
                categoryId: categoryId,
                supplierId: supplierId,
            },
        });
    }
    console.log(`Upserted ${productsData.length} products.`);
    console.log('Seeding finished.');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
