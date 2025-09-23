import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // make sure this path is correct
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("Login attempt:", email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("User not found");
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
