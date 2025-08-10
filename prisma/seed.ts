// prisma/seed.ts
import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient();
``
async function main() {
  const categories = [
    { name: 'Electronics', products: ['Modem', 'Router', 'Switch'] },
    { name: 'Furniture', products: ['Chair', 'Desk', 'Cabinet'] },
    { name: 'Stationery', products: ['Pen', 'Notebook', 'Marker'] },
  ];

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name }
    });

    for (const prod of cat.products) {
      await prisma.product.upsert({
        where: { name: prod },
        update: {},
        create: {
          name: prod,
          categoryId: category.id,
          quantity: 0
        }
      });
    }
  }
}

main()
  .then(() => console.log('Seeding complete.'))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
