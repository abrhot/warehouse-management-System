// POST /api/stock/request
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId, quantity, type } = await req.json()

  try {
    const newRequest = await prisma.stockRequest.create({
      data: {
        type,
        quantity,
        productId,
        requestedBy: session.user.id,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, data: newRequest })
  } catch (error) {
    console.error('Failed to create stock request:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
