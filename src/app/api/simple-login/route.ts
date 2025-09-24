import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Test database connection first
    const userCount = await prisma.user.count();
    console.log('Total users:', userCount);
    
    // Find user with exact email match
    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (!user) {
      // Show available users for debugging
      const allUsers = await prisma.user.findMany({
        select: { email: true },
        take: 10
      });
      console.log('Available emails:', allUsers.map(u => u.email));
      
      return NextResponse.json({
        success: false,
        error: 'User not found',
        debug: {
          searchedEmail: email,
          totalUsers: userCount,
          availableEmails: allUsers.map(u => u.email)
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
