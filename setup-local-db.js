// setup-local-db.js - Run this to set up your local database
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Check if users exist
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    if (userCount === 0) {
      console.log('👤 Creating admin user...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('test123', 10);
      
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@warehouse.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@warehouse.com');
      console.log('🔑 Password: test123');
    } else {
      console.log('👤 Users already exist in database');
      
      // Show existing users
      const users = await prisma.user.findMany({
        select: {
          email: true,
          name: true,
          role: true
        }
      });
      
      console.log('📋 Existing users:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    }
    
    // Check categories
    const categoryCount = await prisma.category.count();
    console.log(`📦 Categories: ${categoryCount}`);
    
    if (categoryCount === 0) {
      console.log('📦 Creating default categories...');
      await prisma.category.createMany({
        data: [
          { name: 'Electronics', description: 'Electronic devices and components' },
          { name: 'Tools', description: 'Hand tools and equipment' },
          { name: 'Materials', description: 'Raw materials and supplies' }
        ]
      });
      console.log('✅ Default categories created!');
    }
    
    console.log('\n🎉 Database setup complete!');
    console.log('🌐 You can now login at: http://localhost:3001');
    console.log('📧 Email: admin@warehouse.com');
    console.log('🔑 Password: test123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Database connection failed. Please check:');
      console.log('1. PostgreSQL is running');
      console.log('2. Database "warehouse_db" exists');
      console.log('3. DATABASE_URL in .env file is correct');
      console.log('\nExample DATABASE_URL:');
      console.log('DATABASE_URL="postgresql://postgres:password@localhost:5432/warehouse_db"');
    }
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
