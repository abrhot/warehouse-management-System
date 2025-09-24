import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    // Check if users already exist
    const userCount = await prisma.user.count();
    
    if (userCount > 0) {
      return NextResponse.json({
        success: false,
        message: 'Database already has users',
        userCount
      });
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@warehouse.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    // Create a regular test user
    const testHashedPassword = await bcrypt.hash('test123', 10);
    
    const testUser = await prisma.user.create({
      data: {
        email: 'user@warehouse.com',
        name: 'Test User',
        password: testHashedPassword,
        role: 'USER'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      users: [
        { email: adminUser.email, role: adminUser.role },
        { email: testUser.email, role: testUser.role }
      ]
    });

  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
