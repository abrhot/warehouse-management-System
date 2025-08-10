"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma")); // make sure this path is correct
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function POST(req) {
    try {
        const { email, password } = await req.json();
        console.log("Login attempt:", email);
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            console.log("User not found");
            return server_1.NextResponse.json({ error: "User not found" }, { status: 401 });
        }
        console.log("User found:", user.email);
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Password mismatch");
            return server_1.NextResponse.json({ error: "Incorrect password" }, { status: 401 });
        }
        console.log("Password matched");
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("JWT token generated");
        const response = server_1.NextResponse.json({
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
    }
    catch (error) {
        console.error("Login error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
