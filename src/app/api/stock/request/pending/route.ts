import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const requests = await prisma.stockRequest.findMany({
      where: { status: 'PENDING' },
      include: { product: true, requester: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(requests)
  } catch (error: any) {
    console.error('Error fetching pending stock requests:', error)
    return new NextResponse('Internal Server Error: ' + error.message, { status: 500 })
  }
}
