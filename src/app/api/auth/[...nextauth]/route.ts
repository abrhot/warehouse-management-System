import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { productId, quantity, type, notes } = await req.json();

    if (!productId || !quantity || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Validate stock type (optional, but recommended)
    if (!["IN", "OUT"].includes(type)) {
      return NextResponse.json({ error: "Invalid stock type." }, { status: 400 });
    }

    const stockRequest = await prisma.stockRequest.create({
      data: {
        productId,
        quantity: Number(quantity),
        type,
        notes: notes || null,
        requestedBy: userId,
      },
    });

    return NextResponse.json(stockRequest, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
