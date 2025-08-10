"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;
        // --- Validation ---
        if (!name || !email || !password || !role) {
            return server_1.NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (!['ADMIN', 'USER'].includes(role)) {
            return server_1.NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
        }
        // --- Check if user already exists ---
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return server_1.NextResponse.json({ error: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
        }
        // --- Hash the password ---
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        // --- Create the new user ---
        const newUser = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role, // Cast the string to the Role enum type
            },
        });
        // Don't send the password back in the response
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        return server_1.NextResponse.json(userWithoutPassword, { status: 201 });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return server_1.NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
