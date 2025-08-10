"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
async function GET() {
    try {
        const products = await prisma_1.default.product.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        return server_1.NextResponse.json(products);
    }
    catch (error) {
        // The real error will be logged to your terminal from this line
        console.error("Failed to fetch products:", error);
        return server_1.NextResponse.json({ error: "Server failed to fetch products" }, { status: 500 });
    }
}
