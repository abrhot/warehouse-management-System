import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@warehouse.com' }
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
        email: 'admin@warehouse.com'
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@warehouse.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      },
      loginCredentials: {
        email: 'admin@warehouse.com',
        password: 'admin123'
      }
    });

  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
