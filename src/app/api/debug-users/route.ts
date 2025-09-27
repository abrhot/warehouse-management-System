import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Get all users (for debugging)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    const userCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      userCount,
      users,
      databaseConnected: true
    });

  } catch (error: any) {
    console.error('Debug users error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      databaseConnected: false
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Force create admin user (even if exists)
    const email = 'admin@warehouse.com';
    
    // Delete existing admin if exists
    await prisma.user.deleteMany({
      where: { email }
    });

    // Create new admin user
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email,
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created/recreated successfully',
      user: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      },
      loginCredentials: {
        email: 'admin@warehouse.com',
        password: 'test123'
      }
    });

  } catch (error: any) {
    console.error('Force create admin error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
