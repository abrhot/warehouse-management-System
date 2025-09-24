import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, createTestUser = false } = await req.json();
    
    // Test database connection first
    const userCount = await prisma.user.count();
    console.log('Total users:', userCount);
    
    // Find user with exact email match
    let user = await prisma.user.findUnique({
      where: { email: email }
    });
    
    // If user not found and createTestUser is true, create a new test user
    if (!user && createTestUser) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      user = await prisma.user.create({
        data: {
          email: email,
          name: 'Test User',
          password: hashedPassword,
          role: 'USER'
        }
      });
      console.log('Created test user:', user.email);
    } 
    // If still no user, return error
    else if (!user) {
      // Show available users for debugging
      const allUsers = await prisma.user.findMany({
        select: { email: true },
        take: 10
      });
      console.log('Available emails:', allUsers.map((u: any) => u.email));
      
      return NextResponse.json({
        success: false,
        error: 'User not found',
        debug: {
          searchedEmail: email,
          totalUsers: userCount,
          availableEmails: allUsers.map((u: any) => u.email),
          suggestion: 'Use createTestUser: true to create a test user'
        }
      }, { status: 401 });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
