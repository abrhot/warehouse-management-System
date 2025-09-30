// src/lib/auth.ts

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("./prisma"));

async function login(email, password) {
    const user = await prisma_1.default.user.findUnique({ where: { email } });

    if (!user) {
        // This handles your "User not found" case
        return null;
    }

    const isMatch = await bcryptjs_1.default.compare(password, user.password);

    if (!isMatch) {
        // This handles incorrect password
        return null;
    }
    
    // 💡 THE FIX IS HERE: Ensure user.id is a string before returning
    return {
        ...user,
        id: user.id.toString(), // <-- CONVERT ID TO STRING HERE
    };
}