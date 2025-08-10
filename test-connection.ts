// test-connection.ts

// This path is correct for this setup.
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Final Connection Test ---');
  try {
    const user = await prisma.user.findFirst();
    if (user) {
      console.log('✅ SUCCESS: Connection is working. Found user:', user.email);
    } else {
      console.log('✅ SUCCESS: Connection is working, but the User table is empty.');
    }
  } catch (error) {
    console.error('❌ FAILURE: Could not connect to the database.');
    console.error(error);
  } finally {
    await prisma.$disconnect();
    console.log('--- Connection Test Finished ---');
  }
}

main();