import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('=== DEBUG ENDPOINT CALLED ===');
    
    // Test basic connection
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    // Get all users with full details
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log('All users:', allUsers);
    
    // Test specific email searches
    const testEmails = ['admin@warehouse.com', 'user@warehouse.com', 'ad@warhouse.com'];
    const emailTests = [];
    
    for (const testEmail of testEmails) {
      const exactMatch = await prisma.user.findUnique({
        where: { email: testEmail }
      });
      
      const caseInsensitiveMatch = await prisma.user.findFirst({
        where: {
          email: {
            equals: testEmail,
            mode: 'insensitive'
          }
        }
      });
      
      emailTests.push({
        searchEmail: testEmail,
        exactMatch: exactMatch ? { id: exactMatch.id, email: exactMatch.email } : null,
        caseInsensitiveMatch: caseInsensitiveMatch ? { id: caseInsensitiveMatch.id, email: caseInsensitiveMatch.email } : null
      });
    }
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      userCount,
      allUsers,
      emailTests,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
