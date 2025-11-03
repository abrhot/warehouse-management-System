import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDemoUsers() {
  try {
    console.log('Creating demo users...\n');
    
    const hashedPassword = await bcrypt.hash('123123', 10);
    
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@warehouse.com' },
      update: { 
        password: hashedPassword,
        name: 'Sarah Johnson',
        role: 'ADMIN'
      },
      create: {
        email: 'admin@warehouse.com',
        name: 'Sarah Johnson',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created/updated:', adminUser.email);
    
    // Create regular user
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@warehouse.com' },
      update: { 
        password: hashedPassword,
        name: 'John Smith',
        role: 'USER'
      },
      create: {
        email: 'user@warehouse.com',
        name: 'John Smith',
        password: hashedPassword,
        role: 'USER'
      }
    });
    console.log('✅ Regular user created/updated:', regularUser.email);
    
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
