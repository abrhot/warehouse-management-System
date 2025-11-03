import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteUsers() {
  try {
    console.log('Deleting users...\n');
    
    // Delete admin@warehouse.com
    try {
      const deleted1 = await prisma.user.delete({
        where: { email: 'admin@warehouse.com' }
      });
      console.log('✅ Deleted admin@warehouse.com - ID:', deleted1.id);
    } catch (error: any) {
      if (error.code === 'P2025') {
        console.log('⚠️  admin@warehouse.com not found');
      } else {
        console.log('❌ Error deleting admin@warehouse.com:', error.message);
      }
    }
    
    // Delete user@warehouse.com
    try {
      const deleted2 = await prisma.user.delete({
        where: { email: 'user@warehouse.com' }
      });
      console.log('✅ Deleted user@warehouse.com - ID:', deleted2.id);
    } catch (error: any) {
      if (error.code === 'P2025') {
        console.log('⚠️  user@warehouse.com not found');
      } else {
        console.log('❌ Error deleting user@warehouse.com:', error.message);
      }
    }
    
    console.log('\n✅ Deletion process completed');
    
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUsers();
