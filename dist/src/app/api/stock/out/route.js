"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
async function POST(req) {
    try {
        const body = await req.json();
        const { productId, quantity } = body;
        if (!productId || !quantity) {
            return server_1.NextResponse.json({ error: "Missing productId or quantity" }, { status: 400 });
        }
        const updatedProduct = await prisma_1.default.product.update({
            where: { id: productId },
            data: {
                quantity: {
                    decrement: Number(quantity),
                },
            },
        });
        return server_1.NextResponse.json(updatedProduct);
    }
    catch (error) {
        console.error("Error in stock out:", error);
        return server_1.NextResponse.json({ error: "Stock out failed: " + error.message }, { status: 500 });
    }
}
