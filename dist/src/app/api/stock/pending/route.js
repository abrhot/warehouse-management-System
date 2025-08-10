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
        const pendingRequests = await prisma_1.default.stockRequest.findMany({
            where: {
                status: 'PENDING',
            },
            include: {
                product: {
                    select: {
                        name: true,
                        quantity: true,
                    },
                },
                requester: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return server_1.NextResponse.json(pendingRequests);
    }
    catch (error) {
        console.error("Failed to fetch pending requests:", error);
        return server_1.NextResponse.json({ error: 'Failed to fetch pending requests' }, { status: 500 });
    }
}
