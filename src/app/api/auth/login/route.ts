import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // make sure this path is correct
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = email.trim().toLowerCase();
    console.log("Login attempt:", normalizedEmail);

    // Debug: Check database connection and user count
    const userCount = await prisma.user.count();
    console.log("Total users in database:", userCount);
    
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      console.log("User not found for email:", normalizedEmail);
      // Debug: Show first few users
      const allUsers = await prisma.user.findMany({ select: { email: true }, take: 5 });
      console.log("Available users:", allUsers.map((u: any) => u.email));
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    console.log("User found:", user.email);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Password mismatch");
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
    console.log("Password matched");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    console.log("JWT token generated");

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax", // recommended for security
      secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in prod
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
