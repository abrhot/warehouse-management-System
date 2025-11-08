const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if users table exists and has data
    const userCount = await prisma.user.count();
    console.log(`👥 Found ${userCount} users in the database`);
    
    if (userCount === 0) {
      console.log('ℹ️ No users found. Creating an admin user...');
      const hashedPassword = await require('bcryptjs').hash('admin123', 10);
      
      await prisma.user.create({
        data: {
          email: 'admin@warehouse.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('   Email: admin@warehouse.com');
      console.log('   Password: admin123');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkDatabase()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
