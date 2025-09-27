// reset-admin-password.js - Reset admin password to 'test123'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function resetAdminPassword() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Looking for admin user...');
    
    // Find admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@warehouse.com' }
    });
    
    if (!adminUser) {
      console.log('❌ Admin user not found. Creating new admin user...');
      
      const hashedPassword = await bcrypt.hash('test123', 10);
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@warehouse.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('✅ New admin user created!');
    } else {
      console.log('👤 Admin user found. Resetting password...');
      
      const hashedPassword = await bcrypt.hash('test123', 10);
      await prisma.user.update({
        where: { email: 'admin@warehouse.com' },
        data: { password: hashedPassword }
      });
      
      console.log('✅ Admin password reset successfully!');
    }
    
    console.log('\n🎉 Admin login credentials:');
    console.log('📧 Email: admin@warehouse.com');
    console.log('🔑 Password: test123');
    console.log('🌐 Login at: http://localhost:3001');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
