// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // This assumes your tsconfig paths are set correctly
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({ message: "Login successful" });

  response.cookies.set("authToken", token, {
    httpOnly: true,
    path: "/",
  });

  return response;
}
