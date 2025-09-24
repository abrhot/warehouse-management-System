import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    console.log('Debug login attempt:', { email });
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, email: true, name: true, role: true, password: true }
    });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        searchedEmail: email.trim().toLowerCase()
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
    
    return NextResponse.json({
      success: true,
      userFound: true,
      passwordValid: isPasswordValid,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    
  } catch (error: any) {
    console.error('Debug login error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
