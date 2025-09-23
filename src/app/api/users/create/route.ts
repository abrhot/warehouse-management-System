// src/app/api/users/create/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // You need to import your authOptions

export async function POST(req: Request) {
  // --- FIX: Add Authorization Check ---
  // This ensures only an authenticated ADMIN can create a new user.
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // --- Validation (Your existing code is good) ---
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role !== 'ADMIN' && role !== 'USER') {
        return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    // --- Check if user already exists (Your existing code is good) ---
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // --- Hash the password (Your existing code is good) ---
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Create the new user ---
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role, // Prisma is smart enough to infer the enum type here
      },
    });
    
    // Don't send the password back in the response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}