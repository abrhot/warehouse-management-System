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
        const { name, category, quantity, location, handler, notes } = body;
        if (!name || !category || !quantity) {
            return server_1.NextResponse.json({ error: 'Missing required fields: name, category, or quantity' }, { status: 400 });
        }
        // Normalize product name and category for consistency (optional)
        const normalizedName = name.trim().toLowerCase();
        const normalizedCategory = category.trim().toLowerCase();
        let product = await prisma_1.default.product.findFirst({
            where: {
                name: normalizedName,
                category: normalizedCategory,
            },
        });
        if (product) {
            // Product exists → increment quantity
            product = await prisma_1.default.product.update({
                where: { id: product.id },
                data: {
                    quantity: {
                        increment: Number(quantity),
                    },
                },
            });
        }
        else {
            // Product does not exist → create it
            product = await prisma_1.default.product.create({
                data: {
                    name,
                    category,
                    quantity: Number(quantity),
                    // remove location, handler, notes here
                },
            });
        }
        return server_1.NextResponse.json(product);
    }
    catch (error) {
        console.error('Error in stock in:', error);
        return server_1.NextResponse.json({ error: 'Stock in failed: ' + error.message }, { status: 500 });
    }
}
