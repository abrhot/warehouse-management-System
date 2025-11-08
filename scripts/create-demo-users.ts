import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDemoUsers() {
  try {
    console.log('Creating demo users...\n');
    
    const hashedPassword = await bcrypt.hash('123123', 10);
    
    // Fixed IDs that match the hardcoded test users in login API
    const ADMIN_ID = 'admin-demo';
    const USER_ID = 'user-demo';
    
    // Delete existing users with these emails first to avoid conflicts
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'admin@warehouse.com' },
          { email: 'user@warehouse.com' }
        ]
      }
    });
    console.log('🗑️  Deleted existing demo users if any\n');
    
    // Create admin user with specific ID
    const adminUser = await prisma.user.create({
      data: {
        id: ADMIN_ID,
        email: 'admin@warehouse.com',
        name: 'Sarah Johnson',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created:', adminUser.email, '(ID:', adminUser.id + ')');
    
    // Create regular user with specific ID
    const regularUser = await prisma.user.create({
      data: {
        id: USER_ID,
        email: 'user@warehouse.com',
        name: 'John Smith',
        password: hashedPassword,
        role: 'USER'
      }
    });
    console.log('✅ Regular user created:', regularUser.email, '(ID:', regularUser.id + ')');
    
    console.log('\n✅ Demo users ready!');
    console.log('\nCredentials:');
    console.log('Admin (Sarah Johnson) - Email: admin@warehouse.com, Password: 123123');
    console.log('User (John Smith)     - Email: user@warehouse.com, Password: 123123');
    
  } catch (error: any) {
    console.error('❌ Error creating demo users:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers();
