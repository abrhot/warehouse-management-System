import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { email, password, createTestUser = false } = await req.json();
    
    console.log('Login attempt for email:', email);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL exists:', !!process.env.DATABASE_URL);
    
    // Check for hardcoded test users first (from memory)
    const testUsers = [
      { id: 'user-demo', email: 'user@warehouse.com', password: '123123', role: 'USER', name: 'John Smith' },
      { id: 'admin-demo', email: 'admin@warehouse.com', password: '123123', role: 'ADMIN', name: 'Sarah Johnson' }
    ];

    const testUser = testUsers.find(u => u.email === email.toLowerCase().trim());
    
    if (testUser && testUser.password === password.trim()) {
      console.log('Using hardcoded test user:', testUser.email);
      
      // Create JWT token for test user
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
      const token = await new SignJWT({ 
        id: testUser.id, 
        email: testUser.email, 
        name: testUser.name,
        role: testUser.role 
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secret);
      
      const response = NextResponse.json({
        success: true,
        user: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.name,
          role: testUser.role
        },
        token
      });
      
      // Set the auth cookie server-side
      response.cookies.set('authToken', token, {
        path: '/',
        maxAge: 86400, // 24 hours
        httpOnly: false, // Allow JavaScript access for client-side logout
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax'
      });
      
      console.log('Test user login successful, cookie set');
      return response;
    }
    
    // Test database connection
    const userCount = await prisma.user.count();
    console.log('Total users in database:', userCount);
    
    // Find user with case-insensitive email match
    let user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });
    
    // If user not found and createTestUser is true, create a new test user
    if (!user && createTestUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = email.includes('admin') ? 'ADMIN' : 'USER';
      user = await prisma.user.create({
        data: {
          email: email,
          name: email.includes('admin') ? 'Admin User' : 'Test User',
          password: hashedPassword,
          role: role
        }
      });
      console.log('Created test user:', user.email, 'with role:', role);
    } 
    // If still no user, return error with detailed debugging
    else if (!user) {
      // Show available users for debugging
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true },
        take: 10
      });
      console.log('Available users:', allUsers);
      console.log('Searched email:', email);
      console.log('Email type:', typeof email);
      console.log('Email length:', email?.length);
      
      return NextResponse.json({
        success: false,
        error: 'User not found',
        debug: {
          searchedEmail: email,
          emailType: typeof email,
          emailLength: email?.length,
          totalUsers: userCount,
          availableUsers: allUsers,
          suggestion: 'Use createTestUser: true to create a test user',
          databaseConnected: true
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
    
    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key');
    const token = await new SignJWT({ 
      id: user.id, 
      email: user.email, 
      name: user.name,
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);
    
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
    
    // Set the auth cookie server-side
    response.cookies.set('authToken', token, {
      path: '/',
      maxAge: 86400, // 24 hours
      httpOnly: false, // Allow JavaScript access for client-side logout
      secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
      sameSite: 'lax'
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
