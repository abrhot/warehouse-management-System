import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check for hardcoded test users first (from memory)
    const testUsers = [
      { email: 'test@example.com', password: 'test123', id: 'test-user', role: 'USER', name: 'Test User' },
      { email: 'admin@warehouse.com', password: 'test123', id: 'admin-user', role: 'ADMIN', name: 'Admin User' }
    ];

    const testUser = testUsers.find(u => u.email === email.toLowerCase().trim());
    
    if (testUser && testUser.password === password.trim()) {
      // Generate JWT token
      const token = jwt.sign(
        { id: testUser.id, email: testUser.email, role: testUser.role },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '30d' }
      );

      // Set authToken cookie
      const response = NextResponse.json({ 
        message: 'Login successful',
        user: { id: testUser.id, email: testUser.email, role: testUser.role, name: testUser.name }
      });
      
      console.log(`[Simple-Login] Setting authToken cookie for user: ${testUser.email}`);
      response.cookies.set('authToken', token, {
        httpOnly: true,
        secure: false, // Allow over HTTP for localhost
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });

      console.log(`[Simple-Login] Cookie set successfully`);
      return response;
    }

    // Check database users
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password.trim(), user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '30d' }
    );

    // Set authToken cookie
    const response = NextResponse.json({ 
      message: 'Login successful',
      user: { id: user.id.toString(), email: user.email, role: user.role, name: user.name }
    });
    
    console.log(`[Simple-Login] Setting authToken cookie for DB user: ${user.email}`);
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: false, // Allow over HTTP for localhost
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    console.log(`[Simple-Login] Cookie set successfully for DB user`);
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
