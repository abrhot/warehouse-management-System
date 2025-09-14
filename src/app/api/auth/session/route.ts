import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  // Get the session using the NextAuth helper
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // Return the user object from the session
  return NextResponse.json({ user: session.user }, { status: 200 });
}